'use strict'

module.exports = [
  {
    method: 'GET',
    path: '/geojson/{param*}',
    handler: {
      directory: {
        path: 'geojson'
      }
    }
  }
]
