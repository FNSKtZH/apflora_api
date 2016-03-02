'use strict'

// Load modules

const Code = require('code')
const Hapi = require('hapi')
const Lab = require('lab')
const artlisteGet = require('../routes/artlisteGet.js')

// test shortcuts

const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

// start server

const server = new Hapi.Server({ debug: false })
server.connection()
server.route(artlisteGet)
server.start()

// test

describe.skip('/artliste', () => {
  it('should return more than 8000 rows for programmAp', (done) => {
    server.inject('/artliste', (res) => {
      expect(res.result.length).to.be.above(8000)
      done()
    })
  })
})
