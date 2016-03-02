'use strict'

// Load modules

const Code = require('code')
const Hapi = require('hapi')
const Lab = require('lab')
const beobDistzutpopInfospeziesGet = require('../routes/beobDistzutpopInfospeziesGet.js')

// test shortcuts

const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

// start server

const server = new Hapi.Server({ debug: false })
server.connection()
server.route(beobDistzutpopInfospeziesGet)
server.start()

// test

describe.skip('/beobDistzutpopInfospezies', () => {
  it('should return more than 100 rows for a sighting of Aceras anthropophorum', (done) => {
    server.inject('/beobDistzutpopInfospezies/beobId=214510', (res) => {
      expect(res.result.length).to.be.above(100)
      done()
    })
  })
})
