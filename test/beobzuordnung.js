'use strict'

// Load modules

const Code = require(`code`)
const Lab = require(`lab`)

// test shortcuts

const lab = Lab.script()
exports.lab = lab
const describe = lab.describe
const it = lab.it
const expect = Code.expect

// start server

const server = require(`../server.js`)

// test

describe(`/beobzuordnung`, () => {
  it(`should return more than 50 rows for ApId 206200`, (done) => {
    const method = `GET`
    const url = `/beobzuordnung/206200`
    server.injectThen({ method, url })
      .then((res) => {
        expect(res.result.length).to.be.above(50)
        done()
      })
  })
})
