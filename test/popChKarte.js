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

describe(`/popChKarte`, () => {
  it(`should get 1 row for popId -2141970766`, (done) => {
    const method = `GET`
    const url = `/popChKarte/popId=-2141970766`
    server.injectThen({ method, url })
      .then((res) => {
        expect(res.statusCode).to.equal(200)
        expect(res.result.length).to.equal(1)
        done()
      })
  })
})
