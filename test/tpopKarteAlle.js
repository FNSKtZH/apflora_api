'use strict'

// load modules
const Code = require(`code`)
const Lab = require(`lab`)

// shortcuts
const lab = Lab.script()
exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

// get server
const server = require(`../server.js`)

// test
describe(`/tpopKarteAlle`, () => {
  it(`should get more than 100 rows for apId = 900`, (done) => {
    const method = `GET`
    const url = `/tpopKarteAlle/apId=900`
    server.injectThen({ method, url })
      .then((res) => {
        expect(res.statusCode).to.equal(200)
        expect(res.result.length).to.be.above(100)
        done()
      })
  })
})
