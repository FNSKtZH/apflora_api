'use strict'

// Load modules

const Code = require('code')
const Hapi = require('hapi')
const Lab = require('lab')
const beobKarteGet = require('../routes/beobKarteGet.js')

// test shortcuts

const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

// start server

const server = new Hapi.Server({ debug: false })
server.connection()
server.route(beobKarteGet)
server.start()

// test

describe.skip('/beobKarte', () => {
  it('should return 1 row for beob_infospezies with NO_NOTE 214510', (done) => {
    const method = 'GET'
    const url = '/beobKarte/apId=/tpopId=/beobId=214510/nichtZuzuordnen='
    server.inject({ method, url }, (res) => {
      expect(res.result.length).to.equal(1)
      done()
    })
  })
  it('should return more than 10 rows for beobzuordnung with tpopId 1373951429', (done) => {
    const method = 'GET'
    const url = '/beobKarte/apId=/tpopId=1373951429/beobId=/nichtZuzuordnen='
    server.inject({ method, url }, (res) => {
      expect(res.result.length).to.be.above(10)
      done()
    })
  })
  it('should return more than 5 rows for beobzuordnung with nichtZuzuordnen and apId 206200', (done) => {
    const method = 'GET'
    const url = '/beobKarte/apId=206200/tpopId=/beobId=/nichtZuzuordnen=1'
    server.inject({ method, url }, (res) => {
      expect(res.result.length).to.be.above(5)
      done()
    })
  })
  it('should return more than 90 rows for beobzuordnung with apId 206200', (done) => {
    const method = 'GET'
    const url = '/beobKarte/apId=206200/tpopId=/beobId=/nichtZuzuordnen='
    server.inject({ method, url }, (res) => {
      expect(res.result.length).to.be.above(90)
      done()
    })
  })
})
