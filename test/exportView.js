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

describe(`/exportView`, () => {
  it(`should return text/x-csv for view v_ap`, (done) => {
    const method = `GET`
    const url = `/exportView/csv/view=v_ap/filename=test`
    server.injectThen({ method, url })
      .then((res) => {
        expect(res.statusCode).to.equal(200)
        expect(res.headers[`content-type`]).to.equal(`text/x-csv; charset=utf-8`)
        // how to check check number of rows?
        done()
      })
  })
  it(`should return text/x-csv for view v_ap and ApArtId 206200`, (done) => {
    const method = `GET`
    const url = `/exportView/csv/view=v_ap/filename=test/206200`
    server.injectThen({ method, url })
      .then((res) => {
        expect(res.statusCode).to.equal(200)
        expect(res.headers[`content-type`]).to.equal(`text/x-csv; charset=utf-8`)
        done()
      })
  })
  it(`should return 200 for view v_ap and json`, (done) => {
    const method = `GET`
    const url = `/exportView/json/view=v_ap`
    server.injectThen({ method, url })
      .then((res) => {
        expect(res.statusCode).to.equal(200)
        // how to check check number of rows?
        done()
      })
  })
  it(`should return 200 for view v_ap and ApArtId 206200 and json`, (done) => {
    const method = `GET`
    const url = `/exportView/json/view=v_ap/206200`
    server.injectThen({ method, url })
      .then((res) => {
        expect(res.statusCode).to.equal(200)
        done()
      })
  })
})
