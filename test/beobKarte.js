'use strict'

// Load modules

const Code = require('code')
const Hapi = require('hapi')
const Lab = require('lab')
const queryBeobKarte = require('../queries/beobKarte.js')

// test shortcuts

const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

// test

describe('/beobKarte', () => {
  const server = new Hapi.Server({ debug: false })
  server.connection()
  server.route({
    method: 'GET',
    path: '/beobKarte/apId={apId?}/tpopId={tpopId?}/beobId={beobId?}/nichtZuzuordnen={nichtZuzuordnen?}',
    handler: queryBeobKarte
  })
  it('should return 1 row for beob_infospezies with NO_NOTE 214510', (done) => {
    server.inject('/beobKarte/apId=/tpopId=/beobId=214510/nichtZuzuordnen=', (res) => {
      expect(res.result.length).to.equal(1)
      done()
    })
  })
})
