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

describe('/apKarte', () => {
  it('should return more than 100 rows with ApArtId 900', (done) => {
    const method = 'GET'
    const url = '/apKarte/apId=900'
    server.inject({ method, url }, (res) => {
      expect(res.result.length).to.be.above(100)
      expect(res.result[0].ApArtId).to.equal(900)
      done()
    })
  })
})
