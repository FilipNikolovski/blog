import React from 'react'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faGithub from '@fortawesome/fontawesome-free-brands/faGithub'
import faTwitter from '@fortawesome/fontawesome-free-brands/faTwitter'
import faRss from '@fortawesome/fontawesome-free-solid/faRss'

const linkStyle = {
    textDecoration: "none",
    color: "#999",
    marginRight: "1rem"
}

const AboutLinks = () => (
    <div
      style={{
        width: "100%",
        color: "#999",
        fontWeight: "bold",
        fontSize: "18px",
        textAlign: "center",
        marginBottom: '2.5rem',
      }}
    >
      <a style={linkStyle} href="https://github.com/FilipNikolovski"><FontAwesomeIcon icon={faGithub} /></a>
      <a style={linkStyle} href="https://twitter.com/fffiiicc"><FontAwesomeIcon icon={faTwitter} /></a>
      <a style={linkStyle} href="https://filipnikolovski.com/rss.xml"><FontAwesomeIcon icon={faRss} /></a>
    </div>
)

export default AboutLinks
