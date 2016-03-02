'use strict'

// Load modules

const Code = require('code')
const Hapi = require('hapi')
const Lab = require('lab')
const exportViewGetCsv = require('../routes/exportViewGetCsv.js')
const exportViewGetCsvForAp = require('../routes/exportViewGetCsvForAp.js')

// test shortcuts

const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

// start server

const server = new Hapi.Server({ debug: false })
server.connection()
server.route(exportViewGetCsv)
server.route(exportViewGetCsvForAp)
server.start()

// test

describe('/exportView', () => {
  it.skip('should return text/x-csv for view v_ap', (done) => {
    server.inject('/exportView/csv/view=v_ap/filename=test', (res) => {
      expect(res.statusCode).to.equal(200)
      expect(res.headers['content-type']).to.equal('text/x-csv; charset=utf-8')
      // how to check check number of rows?
      done()
    })
  })
  it('should return text/x-csv for view v_ap and ApArtId 206200', (done) => {
    server.inject('/exportView/csv/view=v_ap/filename=test/206200', (res) => {
      expect(res.statusCode).to.equal(200)
      expect(res.headers['content-type']).to.equal('text/x-csv; charset=utf-8')
      done()
    })
  })
})