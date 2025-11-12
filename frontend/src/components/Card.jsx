import React from 'react'

export default function Card({children, className = ''}){
  return (
    <div className={`card ${className}`} style={{overflow:'hidden'}}>
      {children}
    </div>
  )
}