import React, { useState } from 'react'
import Card from '../components/Card'

export default function BrewGuides(){
  // simple ratio calculator: grams of coffee from water
  const [water, setWater] = useState(300)
  const [ratio, setRatio] = useState(16)

  const coffee = +(water / ratio).toFixed(1)

  return (
    <div>
      <h1>Brew Guides</h1>
      <p className="small">Practical recipes and a quick ratio calculator for your brewing method.</p>

      <section style={{marginTop:16, display:'grid', gridTemplateColumns:'1fr 320px', gap:16}}>
        <div>
          <Card>
            <h3>Ratio Calculator</h3>
            <div style={{marginTop:8}}>
              <label className="small">Water (ml)</label>
              <input className="input" type="number" value={water} onChange={e=>setWater(+e.target.value)} />
            </div>
            <div style={{marginTop:8}}>
              <label className="small">Ratio (water : coffee)</label>
              <input className="input" type="number" value={ratio} onChange={e=>setRatio(+e.target.value)} />
            </div>
            <div style={{marginTop:12}}>
              <strong>{coffee} g</strong> of coffee
            </div>
          </Card>

          <div style={{marginTop:16}}>
            <Card>
              <h3>Popular Recipes</h3>
              <ul>
                <li><strong>Pour Over</strong> — 16:1, 18g coffee : 288ml water, 2:30–3:00 brew time</li>
                <li><strong>French Press</strong> — 12:1, coarse grind, 30s bloom + 3:45 steep</li>
                <li><strong>Espresso (brew ratio)</strong> — 2:1 yield ratio, 18g in = 36g out</li>
              </ul>
            </Card>
          </div>
        </div>

        <aside>
          <Card>
            <h4>Pro Tip</h4>
            <p className="small">Adjust ratio and extraction time based on taste — if sour, extract longer/hotter; if bitter, shorter/colder.</p>
          </Card>
        </aside>
      </section>
    </div>
  )
}