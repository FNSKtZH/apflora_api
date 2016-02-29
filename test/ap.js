'use strict'

// Load modules

const Code = require('code')
const Hapi = require('hapi')
const Lab = require('lab')
const queryAp = require('../queries/ap.js')

// test shortcuts

const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

// start server

const server = new Hapi.Server({ debug: false })
server.connection()
server.route({
  method: 'GET',
  path: '/ap={apId}',
  handler: queryAp
})
server.start()

// test

describe('/ap', () => {
  it('should return 1 row with ApArtId 900', (done) => {
    server.inject('/ap=900', (res) => {
      expect(res.result.length).to.equal(1)
      expect(res.result[0].ApArtId).to.equal(900)
      done()
    })
  })
})
