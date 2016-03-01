'use strict'

// Load modules

const Code = require('code')
const Hapi = require('hapi')
const Lab = require('lab')
const queryBeobZuordnen = require('../queries/beobZuordnen.js')

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
  path: '/beobZuordnen/apId={apId}',
  handler: queryBeobZuordnen
})
server.start()

// test

describe('/beobZuordnen', () => {
  it('should return more than 300 rows for ApId 206200', (done) => {
    server.inject('/beobZuordnen/apId=206200', (res) => {
      expect(res.result.length).to.be.above(300)
      done()
    })
  })
})
