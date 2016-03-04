'use strict'

// Load modules

const Code = require('code')
const Lab = require('lab')
const appPassFile = require('../appPass.json')

// test shortcuts

const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

// start server

const server = require('../server.js')

// test

describe('/anmeldung', () => {
  it('should accept known user', (done) => {
    const name = appPassFile.user
    const pwd = appPassFile.pass
    const method = 'GET'
    const url = `/anmeldung/name=${name}/pwd=${pwd}`
    server.inject({ method, url }, (res) => {
      expect(res.statusCode).to.equal(200)
      expect(res.result.length).to.equal(1)
      done()
    })
  })
  it('should not accept unknown user', (done) => {
    const method = 'GET'
    const url = '/anmeldung/name=whoami/pwd=dontknow'
    server.inject({ method, url }, (res) => {
      expect(res.statusCode).to.equal(200)
      expect(res.result.length).to.equal(0)
      done()
    })
  })
})
