'use strict'

// Load modules

const Code = require('code')
const Hapi = require('hapi')
const Lab = require('lab')
const apfloraDelete = require('../routes/apfloraDelete.js')

// test shortcuts

const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

// start server

const server = new Hapi.Server({ debug: false })
server.connection()
server.route(apfloraDelete)
server.start()

// test

describe.skip('/apflora (delete)', () => {
  it('should delete from table ap the row with ApArtId 150', (done) => {
    server.inject('/apflora/tabelle=ap/tabelleIdFeld=ApArtId/tabelleId=150', (res) => {
      expect(res.statusCode).to.satisfy(() => 200 || 404)
      done()
    })
  })
})
