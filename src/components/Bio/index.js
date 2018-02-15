import React from 'react'

import profilePic from './profilePic.jpg'

class Bio extends React.Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          marginBottom: '2.5rem',
          maxWidth: 850,
          margin: '0 auto'
        }}
      >
        <img
        src={profilePic}
          alt={`Filip Nikolovski`}
          style={{
            marginRight: '0.9rem',
            marginBottom: 0,
            width: '3.5rem',
            height: '3.5rem',
            borderRadius: '50%'
          }}
        />
        <p>
          Hi, my name is Filip and I am a software engineer, currently working at <a href="https://inplayer.com/">inplayer</a>. This blog is mostly about 
          programming, technology and open-source stuff.
        </p>
      </div>
    )
  }
}

export default Bio