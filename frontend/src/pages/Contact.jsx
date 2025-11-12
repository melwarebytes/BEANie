import React, { useState } from 'react'
import api from '../api/apiClient'
import Card from '../components/Card'

export default function Contact(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(null)

  function handleSubmit(e){
    e.preventDefault()
    setStatus('sending')
    api.post('/api/contact', { name, email, message }).then(()=>{
      setStatus('sent'); setName(''); setEmail(''); setMessage('')
    }).catch(()=>setStatus('error'))
  }

  return (
    <div>
      <h1>Contact</h1>
      <Card>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input className="input" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} required />
            <input className="input" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div>
            <textarea placeholder="Message" value={message} onChange={e=>setMessage(e.target.value)} required />
          </div>
          <div style={{marginTop:12}}>
            <button className="button" type="submit">Send</button>
            {status === 'sending' && <span style={{marginLeft:10}} className="small">Sending…</span>}
            {status === 'sent' && <span style={{marginLeft:10}} className="small">Message sent — thanks!</span>}
            {status === 'error' && <span style={{marginLeft:10, color:'red'}}>Error sending message.</span>}
          </div>
        </form>
      </Card>
    </div>
  )
}