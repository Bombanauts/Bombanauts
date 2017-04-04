import React from 'react'

const Dead = () => {
  return (
    <div style={{ backgroundColor: '#700303',
            position: 'absolute',
            opacity: '0.7',
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none'}}>
      <span style={{
      fontSize: 50,
      margin: 'auto',
      textAlign: 'center',
      position: 'relative',
      display: 'table',
      top: 60}}>You died.</span>
    </div>
  )
}

export default Dead;
