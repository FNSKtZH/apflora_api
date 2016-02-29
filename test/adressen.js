'use strict'

// Load modules

const Code = require('code')
const Hapi = require('hapi')
const Lab = require('lab')
const queryAdressen = require('../queries/adressen.js')

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
  path: '/adressen',
  handler: queryAdressen
})
server.start()

// test

describe('/adressen', () => {
  it('should return more than 140 rows', (done) => {
    server.inject('/adressen', (res) => {
      expect(res.result.length).to.be.above(140)
      done()
    })
  })
})
