'use strict'

// Load modules
const Code = require(`code`)
const Lab = require(`lab`)

// test shortcuts
const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

// get server
const server = require(`../server.js`)

// test
describe(`/apflora`, () => {
  const user = `test`
  it(`should delete from table ap the row with ApArtId 150`, (done) => {
    server.injectThen({
      method: `POST`,
      url: `/apInsert/apId=150/user=${user}`
    })
      .then(() => {
        const method = `DELETE`
        const url = `/apflora/tabelle=ap/tabelleIdFeld=ApArtId/tabelleId=150`
        return server.injectThen({ method, url })
      })
      .then((res) => {
        expect(res.statusCode).to.equal(200)
        done()
      })
  })
  it(`should insert table ap the row with ApArtId 150`, (done) => {
    server.injectThen({
      method: `POST`,
      url: `/insert/apflora/tabelle=ap/feld=ApArtId/wert=150/user=${user}`
    })
    .then((res) => {
      expect(res.statusCode).to.equal(200)
      expect(res.result).to.be.at.least(0)
      // remove this row again
      const method = `DELETE`
      const url = `/apflora/tabelle=ap/tabelleIdFeld=ApArtId/tabelleId=150`
      return server.injectThen({ method, url })
    })
    .then(() => done())
  })
  it(`should insert table ap the row with ApArtId 150`, (done) => {
    server.injectThen({
      method: `POST`,
      url: `/apflora/ap/ApArtId/150`
    })
    .then((res) => {
      expect(res.statusCode).to.equal(200)
      expect(res.result).to.be.at.least(0)
      // remove this row again
      const method = `DELETE`
      const url = `/apflora/tabelle=ap/tabelleIdFeld=ApArtId/tabelleId=150`
      return server.injectThen({ method, url })
    })
    .then(() => done())
  })
  it(`should insert table projekt a new row`, (done) => {
    server.injectThen({
      method: `POST`,
      url: `/insert/apflora/tabelle=projekt/user=${user}`
    })
    .then((res) => {
      expect(res.statusCode).to.equal(200)
      expect(res.result).to.be.at.least(0)
      // remove this row again
      const method = `DELETE`
      const url = `/apflora/tabelle=projekt/tabelleIdFeld=ProjId/tabelleId=${res.result}`
      return server.injectThen({ method, url })
    })
    .then(() => done())
  })
  it(`should update Name of Pop with Id -871888542`, (done) => {
    const method = `PUT`
    const url = `/update/apflora/tabelle=pop/tabelleIdFeld=PopId/tabelleId=-871888542/feld=PopName/wert=testName/user=${user}`
    server.injectThen({ method, url })
      .then((res) => {
        expect(res.statusCode).to.equal(200)
        done()
      })
  })
  it(`should not accept non existing table`, (done) => {
    const method = `PUT`
    const url = `/update/apflora/tabelle=popp/tabelleIdFeld=PopId/tabelleId=-871888542/feld=PopName/wert=testName/user=${user}`
    server.injectThen({ method, url })
      .then((res) => {
        expect(res.statusCode).to.equal(404)
        done()
      })
  })
  it(`should not accept non existing table id field`, (done) => {
    const method = `PUT`
    const url = `/update/apflora/tabelle=pop/tabelleIdFeld=PopIdXX/tabelleId=-871888542/feld=PopName/wert=testName/user=${user}`
    server.injectThen({ method, url })
      .then((res) => {
        expect(res.statusCode).to.equal(404)
        done()
      })
  })
  it(`should not accept non existing field`, (done) => {
    const method = `PUT`
    const url = `/update/apflora/tabelle=pop/tabelleIdFeld=PopId/tabelleId=-871888542/feld=PopNameXX/wert=testName/user=${user}`
    server.injectThen({ method, url })
      .then((res) => {
        expect(res.statusCode).to.equal(404)
        done()
      })
  })
  it(`should not accept value of wrong type`, (done) => {
    const method = `PUT`
    const url = `/update/apflora/tabelle=pop/tabelleIdFeld=PopId/tabelleId=-871888542/feld=PopNr/wert=text/user=${user}`
    server.injectThen({ method, url })
      .then((res) => {
        expect(res.statusCode).to.equal(400)
        done()
      })
  })
  it(`should not accept too big value for field of type integer`, (done) => {
    const method = `PUT`
    const url = `/update/apflora/tabelle=pop/tabelleIdFeld=PopId/tabelleId=-871888542/feld=PopNr/wert=2147483648/user=${user}`
    server.injectThen({ method, url })
      .then((res) => {
        expect(res.statusCode).to.equal(400)
        done()
      })
  })
  it(`should not accept too small value for field of type integer`, (done) => {
    const method = `PUT`
    const url = `/update/apflora/tabelle=pop/tabelleIdFeld=PopId/tabelleId=-871888542/feld=PopNr/wert=-2147483649/user=${user}`
    server.injectThen({ method, url })
      .then((res) => {
        expect(res.statusCode).to.equal(400)
        done()
      })
  })
  it(`should not accept too big value for field of type smallint`, (done) => {
    const method = `PUT`
    const url = `/update/apflora/tabelle=ap/tabelleIdFeld=ApArtId/tabelleId=100/feld=ApJahr/wert=32768/user=${user}`
    server.injectThen({ method, url })
      .then((res) => {
        expect(res.statusCode).to.equal(400)
        done()
      })
  })
  it(`should not accept too small value for field of type smallint`, (done) => {
    const method = `PUT`
    const url = `/update/apflora/tabelle=ap/tabelleIdFeld=ApArtId/tabelleId=100/feld=ApJahr/wert=-32770/user=${user}`
    server.injectThen({ method, url })
      .then((res) => {
        expect(res.statusCode).to.equal(400)
        done()
      })
  })
  it(`should not accept too long value for field of type character varying`, (done) => {
    const method = `PUT`
    const url = `/update/apflora/tabelle=pop/tabelleIdFeld=PopId/tabelleId=-871888542/feld=MutWer/wert=d2345678911234567892z/user=${user}`
    server.injectThen({ method, url })
      .then((res) => {
        expect(res.statusCode).to.equal(400)
        done()
      })
  })
  it(`should get more than 500 rows of Pops with PopNr 1`, (done) => {
    const method = `GET`
    const url = `/apflora/tabelle=pop/feld=PopNr/wertNumber=1`
    server.injectThen({ method, url })
      .then((res) => {
        expect(res.statusCode).to.equal(200)
        expect(res.result.length).to.be.above(500)
        done()
      })
  })
  it(`should get more than 90 rows of Pops with PopName "Eglisau, Chüehalden"`, (done) => {
    const method = `GET`
    const url = `/apflora/tabelle=pop/feld=PopName/wertString=Eglisau, Chüehalden`
    server.injectThen({ method, url })
      .then((res) => {
        expect(res.statusCode).to.equal(200)
        expect(res.result.length).to.be.above(90)
        done()
      })
  })
})
