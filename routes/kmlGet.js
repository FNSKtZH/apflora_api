'use strict'

module.exports = {
  method: 'GET',
  path: '/kml/{param*}',
  handler: {
    directory: {
      path: 'kml'
    }
  }
}
