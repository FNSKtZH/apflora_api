'use strict'

// from: http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric

module.exports = value =>
  Number.isNaN(value) && Number.isFinite(value)
