'use strict'

module.exports = () => {
  const isDev = process.env.NODE_ENV !== `production`
  }
  if (isDev) {
    options.routes = {
      cors: true,
    }
  }
  return options
}
