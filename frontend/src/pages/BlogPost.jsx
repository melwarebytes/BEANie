// frontend/src/pages/BlogPost.jsx
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/apiClient'
import Card from '../components/Card'

export default function BlogPost(){
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=>{
    let cancelled = false
    setLoading(true)
    api.get(`/api/blogs/${id}`)
      .then(res => { if(!cancelled) setPost(res.data) })
      .catch(err => { console.warn(err); if(!cancelled) setError('Could not load post') })
      .finally(()=>{ if(!cancelled) setLoading(false) })
    return ()=>{ cancelled = true }
  },[id])

  if (loading) return <div><h1>Loading…</h1></div>
  if (error) return <div><h1>Error</h1><p className="small">{error}</p></div>
  if (!post) return <div><h1>Not found</h1></div>

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
        <div>
          <h1>{post.title}</h1>
          <div className="small">Published: {new Date(post.createdAt).toLocaleDateString()}</div>
        </div>
        <div>
          <Link to="/blog" className="button secondary">Back to Blog</Link>
        </div>
      </div>

      <Card>
        <div style={{marginBottom:12, color:'var(--coffee-brown)'}} className="small">
          {post.tags && post.tags.map(t => <span key={t} className="tag" style={{marginRight:6}}>{t}</span>)}
        </div>

        <div className="article-content" dangerouslySetInnerHTML={{ __html: post.content || `<p>${post.excerpt || 'No content.'}</p>` }} />
      </Card>
    </div>
  )
}