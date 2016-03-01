'use strict'

// Load modules

const Code = require('code')
const Hapi = require('hapi')
const Lab = require('lab')
const queryTabelleDeleteApflora = require('../queries/tabelleDeleteApflora.js')

// test shortcuts

const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

// start server

const server = new Hapi.Server({ debug: false })
server.connection()
server.route({
  method: 'DELETE',
  path: '/apflora/tabelle={tabelle}/tabelleIdFeld={tabelleIdFeld}/tabelleId={tabelleId}',
  handler: queryTabelleDeleteApflora
})
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
