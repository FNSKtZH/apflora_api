'use strict'

// this is a hack to get rid of the ECONNRESET errors
// but it does not work :-(
const http = require('http')
http.globalAgent.maxSockets = Infinity

const supertest = require('supertest')
const should = require('should')
const appPassFile = require('../appPass.json')

const app = require('../server.js')

global.describe('hooks', function () {
  global.before(function () {
    app.inject({ url: '127.0.0.1:4001' }, function (err) {
      if (err) throw err
      console.log('Server running at:', app.info.uri)
    })
  })
})

// does not work: error
// Uncaught TypeError: Cannot read property 'should' of undefined
// const server = supertest(app)

// const server = supertest.agent('http://127.0.0.1:4001')
const server = supertest('http://127.0.0.1:4001')

global.describe.skip('/adressen', function () {
  global.it('should return more than 140 rows', function (done) {
    server
      .get('/adressen')
      .end((err, res) => {
        if (err) throw err
        res.body.length.should.be.above(140)
        done()
      })
  })
})

// dont test every time because of length
global.describe.skip('/aktualisiereArteigenschaften', function () {
  // takes about 33 seconds!
  this.timeout(100000)
  global.it('should update Arteigenschaften', function (done) {
    server
      .get('/aktualisiereArteigenschaften')
      .end((err, res) => {
        if (err) throw err
        res.status.should.equal(200)
        res.error.should.equal(false)
        done()
      })
  })
})

global.describe.skip('/anmeldung', function () {
  global.it('should accept known user', function (done) {
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
  global.it('should not accept unknown user', function (done) {
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

global.describe.skip('/ap', function () {
  global.it('should return 1 row with ApArtId 900', function (done) {
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

global.describe.skip('/apflora (delete)', function () {
  global.it('should delete from table ap the row with ApArtId 150', function (done) {
    server
      .delete('/apflora/tabelle=ap/tabelleIdFeld=ApArtId/tabelleId=150')
      .end((err, res) => {
        if (err) throw err
        res.status.should.be.oneOf(200, 404)
        done()
      })
  })
})

global.describe.skip('/apInsert', function () {
  global.it('should insert in table ap 1 row with ApArtId 150', function (done) {
    const name = appPassFile.user
    server
      .post(`/apInsert/apId=150/user=${name}`)
      .end((err, res) => {
        if (err) throw err
        res.status.should.equal(200)
        done()
      })
  })
})

global.describe.skip('/apKarte', function () {
  global.it('should return more than 100 rows with ApArtId 900', function (done) {
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

// skipping because if not, ECONNRESET happens ???!!!
global.describe.skip('/apliste', function () {
  global.it('should return more than 50 rows for programmAp', function (done) {
    server
      .get('/apliste/programm=programmAp')
      .end((err, res) => {
        if (err) throw err
        res.body.length.should.be.above(50)
        done()
      })
  })
  global.it('should return more than 520 rows for programmAlle', function (done) {
    server
      .get('/apliste/programm=programmAlle')
      .end((err, res) => {
        if (err) throw err
        res.body.length.should.be.above(520)
        done()
      })
  })
  global.it('should return more than 7400 rows for programmNeu', function (done) {
    server
      .get('/apliste/programm=programmNeu')
      .end((err, res) => {
        if (err) throw err
        res.body.length.should.be.above(7400)
        done()
      })
  })
})

global.describe.skip('/beobDistzutpopEvab', function () {
  global.it('should return more than 100 rows for a sighting of Aceras anthropophorum', function (done) {
    server
      .get('/beobDistzutpopEvab/beobId=9CAD7177-BDD6-4E94-BC3B-F18CDE7EEA58')
      .end((err, res) => {
        if (err) throw err
        res.body.length.should.be.above(100)
        done()
      })
  })
})

global.describe('/beobKarte', function () {
  global.it('should return 1 row for beob_infospezies with NO_NOTE 214510', function (done) {
    server
      .get('/beobKarte/apId=/tpopId=/beobId=214510/nichtZuzuordnen=')
      .end((err, res) => {
        if (err) throw err
        res.body.length.should.equal(1)
        done()
      })
  })
  global.it('should return more than 10 rows for beobzuordnung with tpopId 1373951429', function (done) {
    server
      .get('/beobKarte/apId=/tpopId=1373951429/beobId=/nichtZuzuordnen=')
      .end((err, res) => {
        if (err) throw err
        res.body.length.should.be.above(10)
        done()
      })
  })
  global.it('should return more than 5 rows for beobzuordnung with nichtZuzuordnen and apId 206200', function (done) {
    server
      .get('/beobKarte/apId=206200/tpopId=/beobId=/nichtZuzuordnen=1')
      .end((err, res) => {
        if (err) throw err
        res.body.length.should.be.above(5)
        done()
      })
  })
  global.it('should return more than 90 rows for beobzuordnung with apId 206200', function (done) {
    server
      .get('/beobKarte/apId=206200/tpopId=/beobId=/nichtZuzuordnen=')
      .end((err, res) => {
        if (err) throw err
        res.body.length.should.be.above(90)
        done()
      })
  })
})

global.describe('/beobNaechsteTpop', function () {
  global.it('should return one TPop for ApId 206200 and a set of koordinates', function (done) {
    server
      .get('/beobNaechsteTpop/apId=206200/X=682226/Y=268513')
      .end((err, res) => {
        if (err) throw err
        res.body.length.should.equal(1)
        done()
      })
  })
})

global.describe('/beobZuordnen', function () {
  global.it('should return more than 300 rows for ApId 206200', function (done) {
    server
      .get('/beobZuordnen/apId=206200')
      .end((err, res) => {
        if (err) throw err
        res.body.length.should.be.above(300)
        done()
      })
  })
})

global.describe('/exportView', function () {
  global.it('should return text/x-csv for view v_ap', function (done) {
    server
      .get('/exportView/csv/view=v_ap/filename=test')
      .end((err, res) => {
        if (err) throw err
        res.status.should.equal(200)
        res.type.should.equal('text/x-csv')
        done()
      })
  })
  global.it('should return text/x-csv for view v_ap and ApArtId 206200', function (done) {
    server
      .get('/exportView/csv/view=v_ap/filename=test/206200')
      .end((err, res) => {
        if (err) throw err
        res.status.should.equal(200)
        res.type.should.equal('text/x-csv')
        done()
      })
  })
})
