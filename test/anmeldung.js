'use strict'

// Load modules

const Code = require('code')
const Hapi = require('hapi')
const Lab = require('lab')
const anmeldungGet = require('../routes/anmeldungGet.js')
const appPassFile = require('../appPass.json')

// test shortcuts

const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

// start server

const server = new Hapi.Server({ debug: false })
server.connection()
server.route(anmeldungGet)
server.start()

// test

describe.skip('/anmeldung', () => {
  it('should accept known user', (done) => {
    const name = appPassFile.user
    const pwd = appPassFile.pass
    server.inject(`/anmeldung/name=${name}/pwd=${pwd}`, (res) => {
      expect(res.statusCode).to.equal(200)
      expect(res.result.length).to.equal(1)
      done()
    })
  })
  it('should not accept unknown user', (done) => {
    server.inject('/anmeldung/name=whoami/pwd=dontknow', (res) => {
      expect(res.statusCode).to.equal(200)
      expect(res.result.length).to.equal(0)
      done()
    })
  })
})
