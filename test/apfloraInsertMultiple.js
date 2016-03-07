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

describe('/insertMultiple/apflora', () => {
  it('should insert in table pop 1 row with {PopNr:1,PopName:"test",MutWer:"test"}', (done) => {
    const felderObject = {
      PopNr: 1,
      PopName: 'test',
      MutWer: 'test'
    }
    const felder = JSON.stringify(felderObject)
    const method = 'POST'
    const url = `/insertMultiple/apflora/tabelle=pop/felder=${felder}`
    server.inject({ method, url }, (res) => {
      const popId = res.result.rows[0].PopId
      expect(res.statusCode).to.equal(200)
      expect(popId).to.be.above(0)
      // remove inserted row
      const method = 'DELETE'
      const url = `/apflora/tabelle=pop/tabelleIdFeld=PopId/tabelleId=${popId}`
      server.inject({ method, url }, (res) => done())
    })
  })
})