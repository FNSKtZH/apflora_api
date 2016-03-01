'use strict'

// Load modules

const Code = require('code')
const Hapi = require('hapi')
const Lab = require('lab')
const beobDistzutpopEvabGet = require('../routes/beobDistzutpopEvabGet.js')

// test shortcuts

const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

// start server

const server = new Hapi.Server({ debug: false })
server.connection()
server.route(beobDistzutpopEvabGet)
server.start()

// test

describe.skip('/beobDistzutpopEvab', () => {
  it('should return more than 100 rows for a sighting of Aceras anthropophorum', (done) => {
    server.inject('/beobDistzutpopEvab/beobId=9CAD7177-BDD6-4E94-BC3B-F18CDE7EEA58', (res) => {
      expect(res.result.length).to.be.above(100)
      done()
    })
  })
})
