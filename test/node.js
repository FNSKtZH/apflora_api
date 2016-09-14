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
const method = 'GET'

describe('/node', () => {
  it('should return more than 0 rows for table = "projekt"', (done) => {
    const url = '/node?table=projekt'
    server.inject({ method, url }, (res) => {
      expect(res.result.length).to.be.above(0)
      expect(res.result[0].expanded).to.equal(false)
      done()
    })
  })
  it('When "?table=projekt&id=1", id 1 should be expanded', (done) => {
    const url = '/node?table=projekt&id=1'
    server.inject({ method, url }, (res) => {
      expect(res.result.length).to.be.above(0)
      const resultForId1 = res.result.find(r => r.datasetId === 1)
      expect(resultForId1.expanded).to.equal(true)
      done()
    })
  })
})
