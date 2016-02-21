'use strict'

const supertest = require('supertest')
const should = require('should')

const server = supertest.agent('http://0.0.0.0:4001')

describe('/adressen', () => {
  it('should return more than 140 rows', (done) => {
    server
      .get('/adressen')
      .end((err, res) => {
        res.body.length.should.be.above(140)
        done()
      })
  })
})
