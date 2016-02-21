'use strict'

const supertest = require('supertest')
const should = require('should')

const server = supertest.agent('http://0.0.0.0:4001')

global.describe('/adressen', () => {
  global.it('should return more than 140 rows', (done) => {
    server
      .get('/adressen')
      .end((err, res) => {
        if (err) throw err
        res.body.length.should.be.above(140)
        done()
      })
  })
})

global.describe('/ap=900', () => {
  global.it('should return 1 row with ApArtId 900', (done) => {
    server
      .get('/ap=900')
      .end((err, res) => {
        if (err) throw err
        res.body.length.should.equal(1)
        res.body[0].ApArtId.should.equal(900)
        done()
      })
  })
})

global.describe('/apKarte/apId=900', () => {
  global.it('should return more than 100 rows with ApArtId 900', (done) => {
    server
      .get('/apKarte/apId=900')
      .end((err, res) => {
        if (err) throw err
        res.body.length.should.be.above(100)
        res.body[0].ApArtId.should.equal(900)
        done()
      })
  })
})