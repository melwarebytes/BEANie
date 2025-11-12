// frontend/src/pages/Encyclopedia.jsx
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/apiClient'
import Card from '../components/Card'

export default function Encyclopedia() {
  const [entries, setEntries] = useState([])
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchEntries = async (query = '', type = '') => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get(`/api/encyclopedia?search=${encodeURIComponent(query)}&type=${encodeURIComponent(type)}`)
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || [])
      setEntries(data)
    } catch (err) {
      console.error('Failed to fetch encyclopedia', err)
      setError('Failed to load encyclopedia data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEntries()
  }, [])

  const handleSearch = e => {
    e.preventDefault()
    fetchEntries(search, typeFilter)
  }

  return (
    <div>
      <h1>Encyclopedia</h1>
      <p className="small">Explore coffee origins, brewing methods, and the science behind each cup.</p>

      {/* Search + Filters */}
      <form onSubmit={handleSearch} style={{ marginTop: 20, marginBottom: 32 }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <select
            className="input"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            style={{
              flex: '0 0 180px',
              height: '44px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              padding: '0 8px'
            }}
          >
            <option value="">All Categories</option>
            <option value="origin">Origins</option>
            <option value="method">Methods</option>
            <option value="equipment">Equipment</option>
            <option value="science">Science</option>
          </select>

          <input
            className="input"
            type="text"
            placeholder="Search for topics, origins, or brewing methods..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: '1 1 500px',
              height: '44px',
              minWidth: '300px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              padding: '0 12px'
            }}
          />

          <button
            className="button"
            type="submit"
            style={{
              flex: '0 0 100px',
              height: '44px',
              borderRadius: '8px',
              fontWeight: 600
            }}
          >
            Search
          </button>
        </div>
      </form>

      {loading && <p className="small">Loading entries...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="grid cols-3" style={{ marginTop: 12 }}>
        {entries.length ? entries.map(e => (
          <Link
            key={e._id}
            to={`/encyclopedia/${e._id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Card className="hover-card">
              <h3>{e.title}</h3>
              <p className="small">
                {e.summary || (e.body && e.body.replace(/<[^>]+>/g, '').slice(0, 140) + '...')}
              </p>
              <div className="small" style={{ marginTop: 8 }}>
                <span className="tag">{e.type}</span>
                <span style={{ marginLeft: 8 }}>Read →</span>
              </div>
            </Card>
          </Link>
        )) : (
          <Card><p className="small">No results found.</p></Card>
        )}
      </div>
    </div>
  )
}