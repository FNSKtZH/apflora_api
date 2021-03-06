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
describe(`/qkView`, () => {
  it(`should get status o.k. for view v_qk_pop_ohnepopnr, apId = 900 and berichtjahr = 2015`, (done) => {
    const method = `GET`
    const url = `/qkView/v_qk_pop_ohnepopnr/900`
    server.injectThen({ method, url })
      .then((res) => {
        expect(res.statusCode).to.equal(200)
        expect(res.result.length).to.be.at.least(0)
        done()
      })
  })
})
