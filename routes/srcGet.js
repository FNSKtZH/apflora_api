'use strict'

module.exports = [
  {
    method: 'GET',
    path: '/src/{param*}',
    handler: {
      directory: {
        path: 'src'
      }
    }
  }
]
