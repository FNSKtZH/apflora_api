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

describe('/insert/feldkontr', () => {
  it('should insert a feldkontr for tpopId 72856123', (done) => {
    const method = 'POST'
    const url = '/insert/feldkontr/tpopId=72856123/tpopKontrtyp=/user=test'
    server.inject({ method, url }, (res) => {
      expect(res.statusCode).to.equal(200)
      expect(res.result).to.be.at.least(0)
      // remove inserted row
      const method = 'DELETE'
      const url = `/apflora/tabelle=tpopkontr/tabelleIdFeld=TPopKontrId/tabelleId=${res.result}`
      server.inject({ method, url }, (res) => done())
    })
  })
  it('should insert a freiwkontr for tpopId 72856123', (done) => {
    const method = 'POST'
    const url = '/insert/feldkontr/tpopId=72856123/tpopKontrtyp=Freiwilligen-Erfolgskontrolle/user=test'
    server.inject({ method, url }, (res) => {
      expect(res.statusCode).to.equal(200)
      expect(res.result).to.be.at.least(0)
      // remove inserted row
      const method = 'DELETE'
      const url = `/apflora/tabelle=tpopkontr/tabelleIdFeld=TPopKontrId/tabelleId=${res.result}`
      server.inject({ method, url }, (res) => done())
    })
  })
})
