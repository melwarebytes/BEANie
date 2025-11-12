import React, { useEffect, useState } from 'react'
import api from '../api/apiClient'
import Card from '../components/Card'

export default function Dashboard(){
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ articles: 0, beans: 0 })

  useEffect(()=>{
    let mounted = true
    async function load(){
      try {
        const me = await api.get('/api/auth/me')
        if (!mounted) return
        setUser(me.data)

        // load a couple admin counts (these endpoints should exist in backend)
        const [aRes, bRes] = await Promise.allSettled([
          api.get('/api/articles?count=true'),
          api.get('/api/beans?count=true')
        ])

        if (aRes.status === 'fulfilled') {
          // support various shapes
          const aCount = aRes.value.data?.count ?? (Array.isArray(aRes.value.data) ? aRes.value.data.length : undefined)
          setStats(s => ({ ...s, articles: typeof aCount === 'number' ? aCount : s.articles }))
        }
        if (bRes.status === 'fulfilled') {
          const bCount = bRes.value.data?.count ?? (Array.isArray(bRes.value.data) ? bRes.value.data.length : undefined)
          setStats(s => ({ ...s, beans: typeof bCount === 'number' ? bCount : s.beans }))
        }
      } catch (err) {
        console.warn('Dashboard init error', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return ()=>{ mounted = false }
  },[])

  if (loading) return <div><h1>Dashboard</h1><p className="small">Loading…</p></div>

  if (!user) {
    return (
      <div>
        <h1>Dashboard</h1>
        <p className="small">Please log in to access the dashboard.</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Welcome, {user.name || user.email}</h1>
      <p className="small">Role: {user.role || 'user'}</p>

      <div className="grid cols-3" style={{marginTop:12}}>
        <Card>
          <h4>Site Stats</h4>
          <p className="small">Articles: <strong>{stats.articles}</strong></p>
          <p className="small">Beans: <strong>{stats.beans}</strong></p>
        </Card>

        <Card>
          <h4>Quick Actions</h4>
          <p className="small"><button className="button" onClick={()=>window.location.href='/dashboard/create-article'}>Create Article</button></p>
          <p className="small"><button className="button" onClick={()=>window.location.href='/dashboard/create-bean'}>Add Bean</button></p>
        </Card>

        <Card>
          <h4>Admin Tools</h4>
          <p className="small">Manage content, approve submissions and view site analytics.</p>
        </Card>
      </div>

      <div style={{marginTop:20}}>
        <Card>
          <h3>Recent activity</h3>
          <p className="small">This area can show recent posts, comments, or moderation tasks (example only).</p>
        </Card>
      </div>
    </div>
  )
}