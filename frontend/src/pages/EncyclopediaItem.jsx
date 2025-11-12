// frontend/src/pages/EncyclopediaItem.jsx
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/apiClient'
import Card from '../components/Card'

export default function EncyclopediaItem() {
  const { id } = useParams()
  const [entry, setEntry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    api.get(`/api/encyclopedia/${id}`)
      .then(res => {
        if (!cancelled) setEntry(res.data)
      })
      .catch(err => {
        console.warn('Failed to fetch encyclopedia item', err)
        if (!cancelled) setError('Failed to load entry')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [id])

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>
  if (!entry) return <p>Entry not found.</p>

  return (
    <div>
      {/* --- Header Section --- */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>{entry.title}</h1>
          <div className="small" style={{ color: 'var(--coffee-brown)' }}>
            Category: {entry.type} | Updated {new Date(entry.updatedAt).toLocaleDateString()}
          </div>
        </div>

        <Link
          to="/encyclopedia"
          style={{
            alignSelf: 'center',
            background: 'transparent',
            border: 'none',
            color: 'var(--coffee-brown)',
            fontWeight: 500,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '8px',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#3b2d1f'
            e.currentTarget.style.backgroundColor = '#f1e4d0'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'var(--coffee-brown)'
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          ← Back
        </Link>
      </div>

      {/* --- Content Card --- */}
      <Card>
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: entry.body }}
        />
      </Card>
    </div>
  )
}