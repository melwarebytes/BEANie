// frontend/src/pages/Blog.jsx
import React, { useEffect, useState } from 'react'
import api from '../api/apiClient'
import Card from '../components/Card'
import { Link } from 'react-router-dom'

export default function Blog(){
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(()=>{
    setLoading(true)
    api.get('/api/blogs')
      .then(res => {
        const items = Array.isArray(res.data) ? res.data : (res.data?.blogs || res.data?.data || [])
        setPosts(items)
      })
      .catch(err => {
        console.warn('Blog fetch failed', err)
        setError('Could not load blog posts; showing sample posts.')
        setPosts([])
      })
      .finally(()=>setLoading(false))
  },[])

  return (
    <div>
      <h1>Blog</h1>
      {loading && <p className="small">Loading…</p>}
      {error && <p style={{color:'red'}} className="small">{error}</p>}

      <div className="grid cols-3" style={{marginTop:12}}>
        {posts.length ? posts.map(p => (
          <Link key={p._id || p.id} to={`/blog/${p._id || p.id}`} style={{ textDecoration:'none', color:'inherit' }}>
            <Card>
              <h3>{p.title}</h3>
              <p className="small">{p.excerpt || (p.content && (p.content.replace(/<[^>]+>/g, '').slice(0,120) + '...'))}</p>
              <div style={{marginTop:8}} className="small">Read →</div>
            </Card>
          </Link>
        )) : <Card><p className="small">No posts available.</p></Card>}
      </div>
    </div>
  )
}