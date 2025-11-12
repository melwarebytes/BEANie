import React from 'react'

export default function Footer(){
  return (
    <footer>
      <div style={{maxWidth:1200, margin:'0 auto'}}>© {new Date().getFullYear()} BEANie — crafted with care for coffee lovers.</div>
    </footer>
  )
}