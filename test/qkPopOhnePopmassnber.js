'use strict'

// load modules
const Code = require('code')
const Lab = require('lab')

// shortcuts
const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

// get server
const server = require('../server.js')

// test
describe('/qkPopOhnePopmassnber', () => {
  it('should get status o.k. for apId = 900 and berichtjahr = 2015', (done) => {
    const method = 'GET'
    const url = '/qkPopOhnePopmassnber/900/2015'
    server.inject({ method, url }, (res) => {
      expect(res.statusCode).to.equal(200)
      expect(res.result.length).to.be.at.least(0)
      done()
    })
  })
})
