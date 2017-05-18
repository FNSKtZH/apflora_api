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
describe(`/tree`, () => {
  it(`should get status code 200 for apId 100`, (done) => {
    const method = `GET`
    const url = `/tree/apId=100`
    server.injectThen({ method, url })
      .then((res) => {
        expect(res.statusCode).to.equal(200)
        done()
      })
  })
})
