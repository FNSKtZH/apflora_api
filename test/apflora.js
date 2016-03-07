'use strict'

// Load modules
const Code = require('code')
const Lab = require('lab')

// test shortcuts
const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

// get server
const server = require('../server.js')

// test
describe('/apflora', () => {
  const user = 'test'
  it('should delete from table ap the row with ApArtId 150', (done) => {
    const method = 'POST'
    const url = `/apInsert/apId=150/user=${user}`
    server.inject({ method, url }, (res) => {
      const method = 'DELETE'
      const url = '/apflora/tabelle=ap/tabelleIdFeld=ApArtId/tabelleId=150'
      server.inject({ method, url }, (res) => {
        expect(res.statusCode).to.equal(200)
        done()
      })
    })
  })
  it('should insert table ap the row with ApArtId 150', (done) => {
    const method = 'POST'
    const url = `/insert/apflora/tabelle=ap/feld=ApArtId/wert=150/user=${user}`
    server.inject({ method, url }, (res) => {
      expect(res.statusCode).to.equal(200)
      expect(res.result.rows.length).to.equal(1)
      // remove this row again
      const method = 'DELETE'
      const url = '/apflora/tabelle=ap/tabelleIdFeld=ApArtId/tabelleId=150'
      server.inject({ method, url }, (res) => done())
    })
  })
  it('should update Name of Pop with Id -871888542', (done) => {
    const method = 'PUT'
    const url = `/update/apflora/tabelle=pop/tabelleIdFeld=PopId/tabelleId=-871888542/feld=PopName/wert=testName/user=${user}`
    server.inject({ method, url }, (res) => {
      expect(res.statusCode).to.equal(200)
      done()
    })
  })
})
