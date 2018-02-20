import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import Header from '../components/Header'

import "@fortawesome/fontawesome/styles.css"
import './index.css'

const TemplateWrapper = ({ children }) => (
  <div>
    <Helmet
      title="Filip Nikolovski"
      meta={[
        { name: 'description', content: 'Blog about programming, open-source and other stuff' },
        { name: 'keywords', content: 'blog, programming, coding, tech, open-source' },
      ]}
    />
    <Header />
    <div
      style={{
        margin: '0 auto',
        maxWidth: 900,
        padding: '0px 1.0875rem 1.45rem',
        paddingTop: 0,
      }}
    >
      {children()}
    </div>
  </div>
)

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

export default TemplateWrapper
