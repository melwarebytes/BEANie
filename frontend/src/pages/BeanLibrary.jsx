// frontend/src/pages/BeanLibrary.jsx
import React, { useEffect, useState } from 'react'
import api from '../api/apiClient'
import Card from '../components/Card'

export default function BeanLibrary(){
  const [beans, setBeans] = useState([])
  const [origin, setOrigin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(()=>{
    setLoading(true)
    api.get('/api/beans')
      .then(res => {
        console.log('GET /api/beans ->', res.data)
        const payload = res.data
        const items = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.beans)
            ? payload.beans
            : Array.isArray(payload?.data)
              ? payload.data
              : []
        setBeans(items)
      })
      .catch(err => {
        console.warn('/api/beans failed', err)
        setError('Could not load beans; showing sample data.')
        setBeans([
          { _id:'b1', name:'Yirgacheffe', origin:'Ethiopia', notes:'Floral, tea-like' },
          { _id:'b2', name:'Colombian Huila', origin:'Colombia', notes:'Chocolate, caramel' }
        ])
      })
      .finally(()=>setLoading(false))
  },[])

  const filtered = origin ? beans.filter(b => (b.origin || '').toLowerCase().includes(origin.toLowerCase())) : beans

  return (
    <div>
      <h1>Bean Library</h1>
      <p className="small">Filter and explore bean profiles.</p>

      <div style={{marginTop:12, marginBottom:16}}>
        <input className="input" placeholder="Filter by origin (e.g. Ethiopia)" value={origin} onChange={e=>setOrigin(e.target.value)} />
      </div>

      {loading && <p className="small">Loading…</p>}
      {error && <p style={{color:'red'}} className="small">{error}</p>}

      <div className="grid cols-3">
        {filtered.length ? filtered.map(b => (
          <Card key={b._id || b.id || b.name}>
            <h3>{b.name}</h3>
            <p className="small"><strong>Origin:</strong> {b.origin}</p>
            <p className="small"><strong>Tasting Notes:</strong> {b.notes}</p>
          </Card>
        )) : (
          <Card><p className="small">No beans match that filter.</p></Card>
        )}
      </div>
    </div>
  )
}