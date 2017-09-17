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

describe(`/message`, () => {
  it(`should return at least 1 row`, done => {
    const method = `GET`
    const url = `/message`
    server.injectThen({ method, url }).then(res => {
      expect(res.statusCode).to.equal(200)
      expect(res.result.length).to.be.above(0)
      done()
    })
  })
})
