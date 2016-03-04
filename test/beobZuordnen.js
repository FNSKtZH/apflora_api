'use strict'

// Load modules

const Code = require('code')
const Hapi = require('hapi')
const Lab = require('lab')
const beobZuordnenGet = require('../routes/beobZuordnenGet.js')

// test shortcuts

const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

// start server

const server = new Hapi.Server({ debug: false })
server.connection()
server.route(beobZuordnenGet)
server.start()

// test

describe.skip('/beobZuordnen', () => {
  it('should return more than 300 rows for ApId 206200', (done) => {
    const method = 'GET'
    const url = '/beobZuordnen/apId=206200'
    server.inject({ method, url }, (res) => {
      expect(res.result.length).to.be.above(300)
      done()
    })
  })
})
