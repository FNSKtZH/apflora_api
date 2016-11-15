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

describe(`/tpopmassnTyp`, () => {
  it(`should return more than 3 rows`, (done) => {
    const method = `GET`
    const url = `/tpopmassnTyp`
    server.injectThen({ method, url })
      .then((res) => {
        expect(res.result.length).to.be.above(3)
        done()
      })
  })
})
