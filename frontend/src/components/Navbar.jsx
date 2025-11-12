// frontend/src/components/Navbar.jsx
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/apiClient'

export default function Navbar(){
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  async function loadUser() {
    const token = localStorage.getItem('token')
    if (!token) {
      setUser(null)
      return
    }
    try {
      const res = await api.get('/api/auth/me')
      setUser(res.data)
    } catch (err) {
      console.warn('Navbar: failed to fetch /api/auth/me', err)
      setUser(null)
    }
  }

  useEffect(()=>{
    loadUser()

    // Listen for explicit authChanged events (fired after login/logout)
    const onAuthChanged = (e) => {
      // e.detail may contain token, but we'll just attempt to reload user
      loadUser()
    }
    window.addEventListener('authChanged', onAuthChanged)

    // Also listen for storage events (cross-tab login/logout)
    const onStorage = (e) => {
      if (e.key === 'token') loadUser()
    }
    window.addEventListener('storage', onStorage)

    return () => {
      window.removeEventListener('authChanged', onAuthChanged)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  function handleLogout(){
    localStorage.removeItem('token')
    setUser(null)
    // trigger other listeners
    window.dispatchEvent(new CustomEvent('authChanged', { detail: { loggedOut: true } }))
    navigate('/')
  }

  return (
    <header style={{
      background:'linear-gradient(90deg, var(--coffee-cream), var(--coffee-beige))',
      padding:'1rem 2rem',
      borderBottom:'1px solid rgba(0,0,0,0.04)'
    }}>
      <nav style={{
        maxWidth:1200,
        margin:'0 auto',
        display:'flex',
        alignItems:'center',
        justifyContent:'space-between'
      }}>
        <div style={{display:'flex', alignItems:'center', gap:16}}>
          <Link to="/" style={{textDecoration:'none', color:'var(--coffee-dark)', fontWeight:"600", fontSize:"1.2rem"}}>
            BEANie
          </Link>
          <Link to="/">Home</Link>
          <Link to="/encyclopedia">Encyclopedia</Link>
          <Link to="/brew-guides">Brew Guides</Link>
          <Link to="/beans">Bean Library</Link>
          <Link to="/coffee-lab">Coffee Lab</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/contact">Contact Us</Link>
        </div>

        <div style={{display:'flex', alignItems:'center', gap:12}}>
          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <button onClick={handleLogout} className="button" style={{padding:'6px 10px'}}>Logout</button>
            </>
          ) : (
            <Link to="/auth"><button className="button" style={{padding:'6px 10px'}}>Login</button></Link>
          )}
        </div>
      </nav>
    </header>
  )
}