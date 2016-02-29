'use strict'

// Load modules

const Code = require('code')
const Hapi = require('hapi')
const Lab = require('lab')
const aktualisiereArteigenschaften = require('../queries/aktualisiereArteigenschaften.js')

// test shortcuts

const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

// start server

const server = new Hapi.Server({ debug: false })
server.connection()
server.route({
  method: 'GET',
  path: '/aktualisiereArteigenschaften',
  handler: aktualisiereArteigenschaften
})
server.start()

// test
// takes about 33 seconds!
// dont test every time because of duration

describe.skip('/aktualisiereArteigenschaften', { timeout: 100000 }, () => {
  it('should update Arteigenschaften', (done) => {
    server.inject('/aktualisiereArteigenschaften', (res) => {
      expect(res.result).to.equal('Arteigenschaften hinzugefügt')
      expect(res.statusCode).to.equal(200)
      done()
    })
  })
})
