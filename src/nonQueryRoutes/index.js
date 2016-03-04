'use strict'

/**
 * Module dependencies
 * from: http://stackoverflow.com/questions/27766623/how-to-store-routes-in-separate-files-when-using-hapi
 */
const fs = require('fs')
const path = require('path')
const basename = path.basename(__filename)

const arrayOfRouteArrays = fs.readdirSync(__dirname)
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename))
  .map((file) => require(path.join(__dirname, file)))

let routes = []
arrayOfRouteArrays.forEach((routeArray) => {
  routes = routes.concat(routeArray)
})

module.exports = routes
