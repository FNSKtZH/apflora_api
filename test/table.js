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

describe(`/schema/apflora/table/ap`, () => {
  it(`should return more than 300 rows`, (done) => {
    const method = `GET`
    const url = `/schema/apflora/table/ap`
    server.injectThen({ method, url })
      .then((res) => {
        expect(res.result.length).to.be.above(300)
        done()
      })
  })
})
