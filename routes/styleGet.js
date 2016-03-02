'use strict'

module.exports = {
  method: 'GET',
  path: '/style/{param*}',
  handler: {
    directory: {
      path: 'style'
    }
  }
}
