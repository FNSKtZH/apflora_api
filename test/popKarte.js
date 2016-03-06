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
describe('/popKarte', () => {
  it('should get 1 row for PopId = 5430', (done) => {
    const method = 'GET'
    const url = '/popKarte/popId=5430'
    server.inject({ method, url }, (res) => {
      expect(res.statusCode).to.equal(200)
      expect(res.result.length).to.be.equal(1)
      done()
    })
  })
})