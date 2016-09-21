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

describe(`/exportViewWhereIdIn`, () => {
  it(`should return text/x-csv for view v_ap and ApId 900 and 206200`, (done) => {
    const method = `GET`
    const url = `/exportViewWhereIdIn/csv/view=v_ap/idName=ApArtId/idListe=900,206200/filename=test`
    server.inject({ method, url }, (res) => {
      expect(res.statusCode).to.equal(200)
      expect(res.headers[`content-type`]).to.equal(`text/x-csv; charset=utf-8`)
      done()
    })
  })
})
