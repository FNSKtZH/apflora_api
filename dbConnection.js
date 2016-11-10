'use strict'

module.exports = () => {
  const isDev = process.env.NODE_ENV !== `production`
  const options = {
    host: `0.0.0.0`,
    port: 4001,
  }

  if (isDev) {
    options.routes = {
      cors: true,
    }
  }

  return options
}
