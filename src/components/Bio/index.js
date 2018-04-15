import React from 'react'

import profilePic from './profilePic.jpg'


import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faGithub from '@fortawesome/fontawesome-free-brands/faGithub'
import faTwitter from '@fortawesome/fontawesome-free-brands/faTwitter'

const linkStyle = {
  textDecoration: "none",
  color: "#999"
}

class Bio extends React.Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          margin: '0 auto',
          maxWidth: 850,
          //padding: '1rem'
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
          Hi, my name is Filip and I am a software engineer, currently working at <a style={{textDecoration: "none", color: "rgba(82,206,176,0.9)"}} href="https://inplayer.com/">InPlayer</a>. This blog is mostly about 
          programming, technology and open-source stuff. Opinions are my own, not necessarily those of my employer.
        </p>
      </div>
    )
  }
}

export default Bio
