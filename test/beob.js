'use strict'

// Load modules
const Code = require(`code`)
const Lab = require(`lab`)

// test shortcuts
const lab = Lab.script()
exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

// get server
const server = require(`../server.js`)

// test
describe(`/apflora`, () => {
  it(`should get one row from adb_eigenschaften with TaxonomieId 100`, (done) => {
    const method = `GET`
    const url = `/beob/tabelle=adb_eigenschaften/feld=TaxonomieId/wertNumber=100`
    server.injectThen({ method, url }).then((res) => {
      expect(res.statusCode).to.equal(200)
      expect(res.result.length).to.equal(1)
      done()
    })
  })
  it(`should get one row from adb_eigenschaften with Artname "Affodill"`, (done) => {
    const method = `GET`
    const url = `/beob/tabelle=adb_eigenschaften/feld=NameDeutsch/wertString=Affodill`
    server.injectThen({ method, url }).then((res) => {
      expect(res.statusCode).to.equal(200)
      expect(res.result.length).to.equal(1)
      done()
    })
  })
})
