import React from 'react'
import Card from '../components/Card'

export default function CoffeeLab(){
  return (
    <div>
      <h1>Coffee Lab</h1>
      <p className="small">Tools and experiments — calibrate your grinder and develop your roast notes.</p>

      <div style={{marginTop:16}} className="grid cols-3">
        <Card>
          <h3>Grind Comparison</h3>
          <p className="small">Visual guide to adjust grind size for your method.</p>
        </Card>
        <Card>
          <h3>Roast Log</h3>
          <p className="small">Record roast profiles and tasting notes.</p>
        </Card>
        <Card>
          <h3>Extraction Chart</h3>
          <p className="small">Track TDS and extraction yield over time.</p>
        </Card>
      </div>
    </div>
  )
}