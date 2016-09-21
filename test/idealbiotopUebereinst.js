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

describe(`/idealbiotopUebereinst`, () => {
  it(`should get 5 rows`, (done) => {
    const method = `GET`
    const url = `/idealbiotopUebereinst`
    server.inject({ method, url }, (res) => {
      expect(res.statusCode).to.equal(200)
      expect(res.result.length).to.equal(5)
      done()
    })
  })
})
