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
describe(`/tpopsKarte`, () => {
  it(`should get more than 1 row for popId = 5495`, (done) => {
    const method = `GET`
    const url = `/tpopsKarte/popId=5495`
    server.injectThen({ method, url })
      .then((res) => {
        expect(res.statusCode).to.equal(200)
        expect(res.result.length).to.be.above(1)
        done()
      })
  })
})
