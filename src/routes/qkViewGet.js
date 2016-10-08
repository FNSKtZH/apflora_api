'use strict'

const queryQkView = require(`../../handler/qkView.js`)

module.exports = [
  {
    method: `GET`,
    path: `/qkView/{viewName}/{apId}/{berichtjahr?}`,
    handler: queryQkView
  }
]
