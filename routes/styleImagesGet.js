'use strict'

module.exports = [
  {
    method: 'GET',
    path: '/style/images/{param*}',
    handler: {
      directory: {
        path: 'style/images'
      }
    }
  }
]
