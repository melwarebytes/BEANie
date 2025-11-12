// frontend/src/pages/Home.jsx
import React, { useEffect, useState } from 'react'
import api from '../api/apiClient'
import Card from '../components/Card'
import { Link } from 'react-router-dom'

export default function Home(){
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.allSettled([
      api.get('/api/blogs/featured'),
      api.get('/api/encyclopedia/featured')
    ])
    .then(results => {
      if (cancelled) return

      // results: [ {status, value/res}, {status, value/res} ]
      const blogsRes = results[0]
      const encRes = results[1]

      const blogs = (blogsRes.status === 'fulfilled' && Array.isArray(blogsRes.value.data))
        ? blogsRes.value.data
        : (blogsRes.status === 'fulfilled' && Array.isArray(blogsRes.value.data?.data) ? blogsRes.value.data.data : [])

      const enc = (encRes.status === 'fulfilled' && Array.isArray(encRes.value.data))
        ? encRes.value.data
        : (encRes.status === 'fulfilled' && Array.isArray(encRes.value.data?.data) ? encRes.value.data.data : [])

      console.log('featured blogs ->', blogs)
      console.log('featured encyclopedia ->', enc)

      // Normalize items to a common shape and mark type
      const normBlogs = (blogs || []).map(b => ({
        _id: b._id || b.id,
        title: b.title,
        excerpt: b.excerpt || (b.content ? b.content.replace(/<[^>]+>/g, '').slice(0,160) : ''),
        type: 'blog',
        source: b
      }))

      const normEnc = (enc || []).map(e => ({
        _id: e._id || e.id,
        title: e.title,
        excerpt: e.summary || (e.body ? e.body.replace(/<[^>]+>/g, '').slice(0,160) : ''),
        type: 'encyclopedia',
        source: e
      }))

      // Combine: keep order blogs first then encyclopedia; you can choose any merge strategy
      const combined = [...normBlogs, ...normEnc]

      // Remove duplicates by _id (just in case)
      const uniq = []
      const seen = new Set()
      for (const item of combined) {
        if (!item._id) {
          // safety: generate fallback id
          item._id = Math.random().toString(36).slice(2,9)
        }
        if (!seen.has(item._id)) {
          seen.add(item._id)
          uniq.push(item)
        }
      }

      // Optionally sort by createdAt if available on source objects (descending)
      uniq.sort((a,b) => {
        const at = a.source?.createdAt ? new Date(a.source.createdAt).getTime() : 0
        const bt = b.source?.createdAt ? new Date(b.source.createdAt).getTime() : 0
        return bt - at
      })

      setFeatured(uniq)
    })
    .catch(err => {
      console.warn('Failed to fetch featured sections', err)
      setError('Failed to load featured content.')
      // fallbacks
      setFeatured([
        { _id: 'fa1', title: 'The Science of Extraction', excerpt: 'How grind size, water temp and time shape your cup.', type: 'blog' },
        { _id: 'fa2', title: 'Pour Over: A Love Story', excerpt: 'Recipe, ratios and common mistakes.', type: 'blog' },
        { _id: 'fe1', title: 'Yirgacheffe — Origins and Notes', excerpt: 'Why Yirgacheffe tastes floral and tea-like.', type: 'encyclopedia' }
      ])
    })
    .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [])

  return (
    <div>
      <section className="hero">
        <div>
          <h1>BEANie — The Coffee Encyclopedia</h1>
          <p>Explore origins, brewing methods, tasting notes and in-depth bean profiles. Curated guides for home brewers and pros alike.</p>
          <div style={{marginTop:16}}>
            <Link to="/encyclopedia" className="button">Explore Encyclopedia</Link>
            <Link to="/brew-guides" className="button secondary" style={{marginLeft:12}}>Brew Guides</Link>
          </div>
        </div>
        <aside className="card">
          <h3>Trending</h3>
          <ul style={{listStyle:'none', padding:0, margin:0}}>
            <li style={{padding:'8px 0'}}><span className="tag">Recipe</span> <strong>Cold Brew Concentrate Tips</strong></li>
            <li style={{padding:'8px 0'}}><span className="tag">Origin</span> <strong>Yirgacheffe: Floral Notes Explained</strong></li>
          </ul>
        </aside>
      </section>

      <section style={{marginTop: 18}}>
        <h2>Featured</h2>
        {loading && <p className="small">Loading featured content…</p>}
        {error && <p style={{color:'red'}} className="small">{error}</p>}

        <div className="grid cols-3" style={{marginTop:12}}>
          {featured.length ? featured.map(item => {
            const link = item.type === 'blog' ? `/blog/${item._id}` : `/encyclopedia/${item._id}`
            return (
              <Link key={item._id} to={link} style={{ textDecoration:'none', color:'inherit' }}>
                <Card>
                  <h3>{item.title}</h3>
                  <p className="small">{item.excerpt}</p>
                  <div style={{marginTop:8}} className="small">
                    <span className="tag" style={{marginRight:8}}>{item.type === 'blog' ? 'Blog' : 'Encyclopedia'}</span>
                    Read →
                  </div>
                </Card>
              </Link>
            )
          }) : (
            <Card><p className="small">No featured content available.</p></Card>
          )}
        </div>
      </section>

      {/* rest of home page content (featured articles etc) can follow here */}
    </div>
  )
}