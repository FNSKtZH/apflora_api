'use strict'

// Load modules

const Code = require('code')
const Hapi = require('hapi')
const Lab = require('lab')
const exportViewGetCsv = require('../routes/exportViewGetCsv.js')

// test shortcuts

const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

// start server

const server = new Hapi.Server({ debug: false })
server.connection()
server.route(exportViewGetCsv)
server.start()

// test

describe('/exportView', () => {
  it('should return text/x-csv for view v_ap', (done) => {
    server.inject('/exportView/csv/view=v_ap/filename=test', (res) => {
      // console.log('res', res)
      expect(res.statusCode).to.equal(200)
      // TODO: res.type.should.equal('text/x-csv')
      // or check number of rows
      done()
    })
  })
})
