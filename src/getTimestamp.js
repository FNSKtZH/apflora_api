'use strict'

const dateFormat = require(`dateformat`)

module.exports = () => {
  const now = new Date()
  return dateFormat(now, `yyyy-mm-dd_hh-MM:ss`)
}
