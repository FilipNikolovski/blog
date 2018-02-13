import React from 'react'

// import profilePic from './profile-pic.jpg'

class Bio extends React.Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          marginBottom: '1rem',
        }}
      >
        <img
          // src={profilePic}
          alt={`Filip Nikolovski`}
          style={{
            marginRight: '0.2rem',
            marginBottom: 0,
            width: '0.5rem',
            height: '0.5rem',
          }}
        />
        <p>
          Programmer
        </p>
      </div>
    )
  }
}

export default Bio