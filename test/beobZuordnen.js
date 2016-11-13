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

describe(`/beobZuordnen`, () => {
  it(`should return more than 300 rows for ApId 206200`, (done) => {
    const method = `GET`
    const url = `/beobZuordnen/apId=206200`
    server.injectThen({ method, url })
      .then((res) => {
        expect(res.result.length).to.be.above(300)
        done()
      })
  })
})
