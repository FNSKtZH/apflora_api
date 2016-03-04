'use strict'

// Load modules

const Code = require('code')
const Hapi = require('hapi')
const Lab = require('lab')
const apKarteGet = require('../routes/apKarteGet.js')

// test shortcuts

const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

// start server

const server = new Hapi.Server({ debug: false })
server.connection()
server.route(apKarteGet)
server.start()

// test

describe.skip('/apKarte', () => {
  it('should return more than 100 rows with ApArtId 900', (done) => {
    const method = 'GET'
    const url = '/apKarte/apId=900'
    server.inject({ method, url }, (res) => {
      expect(res.result.length).to.be.above(100)
      expect(res.result[0].ApArtId).to.equal(900)
      done()
    })
  })
})
