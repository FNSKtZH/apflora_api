'use strict'

// Load modules

const Code = require(`code`)
const Lab = require(`lab`)

// test shortcuts

const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

// start server

const server = require(`../server.js`)

// test

describe(`/schema/{schema}/table/{table}/field/{field}/value/{value}`, () => {
  it(`should return more than 300 rows for table ap, field ProjId and value 1`, (done) => {
    const method = `GET`
    const url = `/schema/apflora/table/ap/field/ProjId/value/1`
    server.injectThen({ method, url })
      .then((res) => {
        expect(res.result.length).to.be.above(300)
        done()
      })
  })
  it(`should return more than 300 rows for table tpopkontr, field TPopKontrTyp and value Freiwilligen-Erfolgskontrolle`, (done) => {
    const method = `GET`
    const url = `/schema/apflora/table/tpopkontr/field/TPopKontrTyp/value/Freiwilligen-Erfolgskontrolle`
    server.injectThen({ method, url })
      .then((res) => {
        expect(res.result.length).to.be.above(10)
        done()
      })
  })
})
