'use strict'

// load modules
const Code = require(`code`)
const Lab = require(`lab`)

// shortcuts
const lab = Lab.script()
exports.lab = lab
const describe = lab.describe
const it = lab.it
const expect = Code.expect

// get server
const server = require(`../server.js`)

// test
describe(`/popsChKarte`, () => {
  it(`should get more than 50 rows for apId = 900`, (done) => {
    const method = `GET`
    const url = `/popsChKarte/apId=900`
    server.injectThen({ method, url })
      .then((res) => {
        expect(res.statusCode).to.equal(200)
        expect(res.result.length).to.be.above(50)
        done()
      })
  })
})
