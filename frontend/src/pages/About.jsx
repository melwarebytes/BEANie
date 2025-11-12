import React from 'react'
import Card from '../components/Card'

export default function About(){
  return (
    <div>
      <h1>About BEANie</h1>
      <Card>
        <p className="small">BEANie is a curated coffee resource for home brewers and professionals. We collect bean profiles, brewing guides and experiments to help you make better coffee.</p>
        <p className="small">Built with care — coffee-first design and minimal UI.</p>
      </Card>
    </div>
  )
}