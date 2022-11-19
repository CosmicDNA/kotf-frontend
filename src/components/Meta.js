import React from 'react'
import App from '../App'
import MetaTags from 'react-meta-tags'
import PropTypes from 'prop-types'

const meta = {
  title: 'King of The Fools Page',
  description: 'King of The Fools Page',
  canonical: 'http://localhost:3000',
  meta: {
    charset: 'utf-8',
    name: {
      keywords: ''
    }
  }
}
const Meta = (props) => {
  const { app } = props
  return (
        <div className="wrapper">
        <MetaTags>
            <title>{meta.title}</title>
            <meta name="description" content={meta.description} />
            <meta name="canonical" content={meta.canonical} />
            <meta charSet={meta.meta.charset}/>
            <meta property="og:title" content={meta.title} />
            <meta property="og:image" content="logo512.png" />
        </MetaTags>
          <App {...app}/>
        </div>
  )
}

Meta.propTypes = {
  app: PropTypes.elementType.isRequired
}

export default Meta
