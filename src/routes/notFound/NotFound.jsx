import React, { PropTypes } from 'react'

function NotFound({ title }) {
  return (
    <div>
      <h1>{title}</h1>
      <p>Sorry, the page you were trying to view does not exist.</p>
    </div>
  )
}

NotFound.propTypes = { title: PropTypes.string.isRequired }

export default NotFound
