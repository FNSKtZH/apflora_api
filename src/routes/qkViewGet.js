'use strict'

const queryQkView = require(`../../queries/qkView.js`)

module.exports = [
  {
    method: `GET`,
    path: `/qkView/{viewName}/{apId}/{berichtjahr?}`,
    handler: queryQkView
  }
]
