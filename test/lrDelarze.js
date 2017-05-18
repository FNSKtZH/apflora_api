'use strict'

// Load modules

const Code = require(`code`)
const Lab = require(`lab`)

// test shortcuts

const lab = Lab.script()
exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

// start server

const server = require(`../server.js`)

// test

describe(`/lrDelarze`, () => {
  it(`should get more than 250 rows`, (done) => {
    const method = `GET`
    const url = `/lrDelarze`
    server.injectThen({ method, url })
      .then((res) => {
        expect(res.statusCode).to.equal(200)
        expect(res.result.length).to.be.above(250)
        done()
      })
  })
})
