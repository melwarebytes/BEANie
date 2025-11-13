import React from "react";

/**
 * Minimal interactive wheel:
 * - draws a circular wheel with segments based on flavors
 * - clicking a segment toggles selection
 */
export default function FlavorWheel({ flavors, selection, setSelection }) {
  const radius = 140;
  const cx = radius + 10;
  const cy = radius + 10;
  const total = flavors.length || 1;
  const anglePer = (Math.PI * 2) / total;

  function toggle(name) {
    if (selection.includes(name)) setSelection(selection.filter(s=>s!==name));
    else setSelection([...selection, name]);
  }

  return (
    <div className="wheel-card">
      <h3>Flavor Wheel</h3>
      <svg width={2*radius+20} height={2*radius+20} viewBox={`0 0 ${2*radius+20} ${2*radius+20}`}>
        {flavors.map((f, i) => {
          const start = i * anglePer - Math.PI/2;
          const end = start + anglePer;
          const x1 = cx + radius * Math.cos(start);
          const y1 = cy + radius * Math.sin(start);
          const x2 = cx + radius * Math.cos(end);
          const y2 = cy + radius * Math.sin(end);
          const large = anglePer > Math.PI ? 1 : 0;
          const d = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2} Z`;
          const active = selection.includes(f.name);
          return (
            <g key={f.name} onClick={()=>toggle(f.name)} style={{cursor:"pointer"}}>
              <path d={d} fill={f.hue || "#ccc"} opacity={active?0.95:0.7} stroke="#fff" />
              {/* label */}
              <text
                x={cx + (radius*0.6) * Math.cos(start + anglePer/2)}
                y={cy + (radius*0.6) * Math.sin(start + anglePer/2)}
                fontSize="10"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#222"
              >
                {f.name}
              </text>
            </g>
          );
        })}
        {/* center button showing selected count */}
        <circle cx={cx} cy={cy} r={radius*0.28} fill="#fff" stroke="#ddd" />
        <text x={cx} y={cy} fontSize="12" textAnchor="middle" dominantBaseline="middle" fill="#333">
          {selection.length ? `${selection.length} selected` : "Tap flavors"}
        </text>
      </svg>
      
    </div>
  );
}
