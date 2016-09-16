'use strict'

module.exports = [
  {
    method: `GET`,
    path: `/{path*}`,
    handler(request, reply) {
      reply.file(`index.html`)
    }
  },
  {
    method: `GET`,
    path: `/geojson/{param*}`,
    handler: {
      directory: {
        path: `geojson`
      }
    }
  },
  {
    method: `GET`,
    path: `/img/{param*}`,
    handler: {
      directory: {
        path: `img`
      }
    }
  },
  {
    method: `GET`,
    path: `/kml/{param*}`,
    handler: {
      directory: {
        path: `kml`
      }
    }
  },
  {
    method: `GET`,
    path: `/src/{param*}`,
    handler: {
      directory: {
        path: `src`
      }
    }
  },
  {
    method: `GET`,
    path: `/style/{param*}`,
    handler: {
      directory: {
        path: `style`
      }
    }
  },
  {
    method: `GET`,
    path: `/style/images/{param*}`,
    handler: {
      directory: {
        path: `style/images`
      }
    }
  }
]
