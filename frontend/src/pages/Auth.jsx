// frontend/src/pages/Auth.jsx
import React, { useState } from 'react'
import api from '../api/apiClient'
import Card from '../components/Card'
import { useNavigate } from 'react-router-dom'

export default function Auth(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [mode, setMode] = useState('login') // or signup
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function submit(e){
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
      const payload = mode === 'login' ? { email, password } : { name, email, password }

      const res = await api.post(endpoint, payload)

      // DEBUG: log entire response so we can see its shape
      console.log('Auth response:', res.data)

      // accept several common token property names
      const token = res.data?.token || res.data?.accessToken || res.data?.access_token || res.data?.data?.token

      if (!token) {
        // If no token, show full response to user in console and error out
        console.error('No token in auth response:', res.data)
        throw new Error('No token returned from server (see console for response)')
      }

      // store token and broadcast auth change
      localStorage.setItem('token', token)
      window.dispatchEvent(new CustomEvent('authChanged', { detail: { token } }))

      // Optionally fetch profile to prime client (ignore errors)
      try { await api.get('/api/auth/me') } catch(_) { /* ignore */ }

      navigate('/dashboard', { replace: true })
    } catch (err) {
      console.error('Auth error', err)
      setError(err.response?.data?.message || err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>{mode === 'login' ? 'Sign in' : 'Create account'}</h1>
      <Card>
        <form onSubmit={submit}>
          {mode === 'signup' && (
            <div style={{marginBottom:8}}>
              <input className="input" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required />
            </div>
          )}

          <div style={{marginBottom:8}}>
            <input className="input" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>

          <div style={{marginBottom:8}}>
            <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>

          <div style={{display:'flex', gap:8}}>
            <button className="button" type="submit" disabled={loading}>
              {loading ? (mode === 'login' ? 'Signing in…' : 'Creating…') : (mode === 'login' ? 'Login' : 'Create account')}
            </button>
            <button
              type="button"
              className="button secondary"
              onClick={()=>setMode(mode === 'login' ? 'signup' : 'login')}
            >
              {mode === 'login' ? 'Create account' : 'Have an account? Log in'}
            </button>
          </div>

          {error && <p style={{color:'red', marginTop:8}}>{error}</p>}
        </form>
      </Card>
    </div>
  )
}