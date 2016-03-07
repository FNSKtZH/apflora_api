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
describe('/tree', () => {
  it('should get more than 1 row for popId = 5495', (done) => {
    const method = 'GET'
    const url = '/tree/apId=900'
    server.inject({ method, url }, (res) => {
      expect(res.statusCode).to.equal(200)
      done()
    })
  })
})
