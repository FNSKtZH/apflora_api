'use strict'

// Load modules

const Code = require('code')
const Hapi = require('hapi')
const Lab = require('lab')
const exportViewWhereIdInGet = require('../routes/exportViewWhereIdInGet.js')

// test shortcuts

const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

// start server

const server = new Hapi.Server({ debug: false })
server.connection()
server.route(exportViewWhereIdInGet)
server.start()

// test

describe('/exportViewWhereIdIn', () => {
  it('should return text/x-csv for view v_ap and ApId 900 and 206200', (done) => {
    server.inject('/exportViewWhereIdIn/csv/view=v_ap/idName=ApArtId/idListe=900,206200/filename=test', (res) => {
      expect(res.statusCode).to.equal(200)
      expect(res.headers['content-type']).to.equal('text/x-csv; charset=utf-8')
      done()
    })
  })
})
