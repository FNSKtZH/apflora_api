'use strict'

const supertest = require('supertest')
const should = require('should')
const appPassFile = require('../appPass.json')

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

/* dont test every time because of length
global.describe('/aktualisiereArteigenschaften', function () {
  // takes about 33 seconds!
  this.timeout(100000)
  global.it('should update Arteigenschaften', (done) => {
    server
      .get('/aktualisiereArteigenschaften')
      .end((err, res) => {
        if (err) throw err
        res.status.should.equal(200)
        res.error.should.equal(false)
        done()
      })
  })
})*/

global.describe('/anmeldung', () => {
  global.it('should accept known user', (done) => {
    const name = appPassFile.user
    const pwd = appPassFile.pass
    server
      .get(`/anmeldung/name=${name}/pwd=${pwd}`)
      .end((err, res) => {
        if (err) throw err
        res.status.should.equal(200)
        res.body.length.should.equal(1)
        done()
      })
  })
  global.it('should not accept unknown user', (done) => {
    server
      .get('/anmeldung/name=whoami/pwd=dontknow')
      .end((err, res) => {
        if (err) throw err
        res.status.should.equal(200)
        res.body.length.should.equal(0)
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

global.describe('/apliste/programm=programmAp', () => {
  global.it('should return more than 50 rows', (done) => {
    server
      .get('/apliste/programm=programmAp')
      .end((err, res) => {
        if (err) throw err
        res.body.length.should.be.above(50)
        done()
      })
  })
})

global.describe('/apliste/programm=programmNeu', () => {
  global.it('should return more than 7400 rows', (done) => {
    server
      .get('/apliste/programm=programmNeu')
      .end((err, res) => {
        if (err) throw err
        res.body.length.should.be.above(7400)
        done()
      })
  })
})

global.describe('/apliste/programm=programmAlle', () => {
  global.it('should return more than 520 rows', (done) => {
    server
      .get('/apliste/programm=programmAlle')
      .end((err, res) => {
        if (err) throw err
        res.body.length.should.be.above(520)
        done()
      })
  })
})
