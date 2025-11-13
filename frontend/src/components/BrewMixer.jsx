import React from "react";

export default function BrewMixer({ params, setParams, predicted }) {
  const methods = ["Pour-over","French Press","Espresso","Cold Brew","Aeropress"];
  const roasts = ["Light","Medium","Dark"];
  const grinds = ["Fine","Medium","Coarse"];

  return (
    <div className="mixer-card">
      <h3>Brew Mixer</h3>

      <label>Method</label>
      <select value={params.brewMethod} onChange={e=>setParams({...params, brewMethod: e.target.value})}>
        {methods.map(m=> <option key={m} value={m}>{m}</option>)}
      </select>

      <label>Roast Level</label>
      <select value={params.roastLevel} onChange={e=>setParams({...params, roastLevel: e.target.value})}>
        {roasts.map(r=> <option key={r} value={r}>{r}</option>)}
      </select>

      <label>Grind Size</label>
      <select value={params.grindSize} onChange={e=>setParams({...params, grindSize: e.target.value})}>
        {grinds.map(g=> <option key={g} value={g}>{g}</option>)}
      </select>

      <label>Ratio (coffee : water)</label>
      <input
        type="range"
        min="0.01"
        max="0.08"
        step="0.001"
        value={params.ratio}
        onChange={e=>setParams({...params, ratio: parseFloat(e.target.value)})}
      />
      <div className="small-info">{`1 : ${Math.round(1/params.ratio)}`}</div>

      <label>Water Temp (°C)</label>
      <input
        type="number"
        min="70"
        max="100"
        value={params.tempC}
        onChange={e=>setParams({...params, tempC: parseInt(e.target.value)})}
      />

      <div className="predictions">
        <h4>Predicted Flavors</h4>
        {predicted.length===0 ? <p className="muted">No strong flavors detected</p> :
          <ul>
            {predicted.map(p => (
              <li key={p.flavor}><strong>{p.flavor}</strong> — {Math.round(p.score*100)}%</li>
            ))}
          </ul>
        }
      </div>
    </div>
  );
}
