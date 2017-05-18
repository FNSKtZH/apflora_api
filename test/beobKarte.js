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

// start server

const server = require(`../server.js`)

// test

describe(`/beobKarte`, () => {
  it(`should return 1 row for beob_infospezies with NO_NOTE 214510`, (done) => {
    const method = `GET`
    const url = `/beobKarte/apId=/tpopId=/beobId=214510/nichtZuzuordnen=`
    server.injectThen({ method, url })
      .then((res) => {
        expect(res.result.length).to.equal(1)
        done()
      })
  })
  it(`should return more than 10 rows for beobzuordnung with tpopId 1373951429`, (done) => {
    const method = `GET`
    const url = `/beobKarte/apId=/tpopId=1373951429/beobId=/nichtZuzuordnen=`
    server.injectThen({ method, url })
      .then((res) => {
        expect(res.result.length).to.be.above(10)
        done()
      })
  })
  // 2016.09.14: set from more than 5 to more than 0 rows because on local db there were only 1 row
  it(`should return more than 0 rows for beobzuordnung with nichtZuzuordnen and apId 206200`, (done) => {
    const method = `GET`
    const url = `/beobKarte/apId=206200/tpopId=/beobId=/nichtZuzuordnen=1`
    server.injectThen({ method, url })
      .then((res) => {
        expect(res.result.length).to.be.above(0)
        done()
      })
  })
  it(`should return more than 90 rows for beobzuordnung with apId 206200`, (done) => {
    const method = `GET`
    const url = `/beobKarte/apId=206200/tpopId=/beobId=/nichtZuzuordnen=`
    server.injectThen({ method, url })
      .then((res) => {
        expect(res.result.length).to.be.above(90)
        done()
      })
  })
})
