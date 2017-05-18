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
describe(`/tpopMassnTypen`, () => {
  it(`should get more than 7 rows`, (done) => {
    const method = `GET`
    const url = `/tpopMassnTypen`
    server.injectThen({ method, url })
      .then((res) => {
        expect(res.statusCode).to.equal(200)
        expect(res.result.length).to.be.above(7)
        done()
      })
  })
})
