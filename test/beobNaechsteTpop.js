'use strict'

// Load modules

const Code = require('code')
const Hapi = require('hapi')
const Lab = require('lab')
const beobNaechsteTpopGet = require('../routes/beobNaechsteTpopGet.js')

// test shortcuts

const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

// start server

const server = new Hapi.Server({ debug: false })
server.connection()
server.route(beobNaechsteTpopGet)
server.start()

// test

describe.skip('/beobNaechsteTpop', () => {
  it('should return one TPop for ApId 206200 and a set of koordinates', (done) => {
    const method = 'GET'
    const url = '/beobNaechsteTpop/apId=206200/X=682226/Y=268513'
    server.inject({ method, url }, (res) => {
      expect(res.result.length).to.equal(1)
      done()
    })
  })
})
