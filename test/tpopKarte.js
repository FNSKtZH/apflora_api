'use strict'

// load modules
const Code = require(`code`)
const Lab = require(`lab`)

// shortcuts
const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

// get server
const server = require(`../server.js`)

// test
describe(`/tpopKarte`, () => {
  it(`should get 0 or one rows for TPopId = 13542`, (done) => {
    const method = `GET`
    const url = `/tpopKarte/tpopId=13542`
    server.injectThen({ method, url })
      .then((res) => {
        expect(res.statusCode).to.equal(200)
        expect(res.result.length).to.be.at.least(0)
        done()
      })
  })
})
