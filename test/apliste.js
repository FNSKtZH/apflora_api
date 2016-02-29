'use strict'

// Load modules

const Code = require('code')
const Hapi = require('hapi')
const Lab = require('lab')
const queryApliste = require('../queries/apliste.js')

// test shortcuts

const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

// start server

const server = new Hapi.Server({ debug: false })
server.connection()
server.route({
  method: 'GET',
  path: '/apliste/programm={programm}',
  handler: queryApliste
})
server.start()

// test

describe('/adressen', () => {
  it('should return more than 50 rows for programmAp', (done) => {
    server.inject('/apliste/programm=programmAp', (res) => {
      expect(res.result.length).to.be.above(50)
      done()
    })
  })
  it('should return more than 520 rows for programmAlle', (done) => {
    server.inject('/apliste/programm=programmAlle', (res) => {
      expect(res.result.length).to.be.above(520)
      done()
    })
  })
  it('should return more than 7400 rows for programmNeu', (done) => {
    server.inject('/apliste/programm=programmNeu', (res) => {
      expect(res.result.length).to.be.above(7400)
      done()
    })
  })
})
