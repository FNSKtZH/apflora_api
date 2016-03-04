'use strict'

// Load modules

const Code = require('code')
const Lab = require('lab')

// test shortcuts

const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

// start server
const server = require('../server.js')

// test
// takes about 33 seconds!
// dont test every time because of duration

describe.skip('/aktualisiereArteigenschaften', { timeout: 100000 }, () => {
  it('should update Arteigenschaften', (done) => {
    const method = 'GET'
    const url = '/aktualisiereArteigenschaften'
    server.inject({ method, url }, (res) => {
      expect(res.result).to.equal('Arteigenschaften hinzugefügt')
      expect(res.statusCode).to.equal(200)
      done()
    })
  })
})
