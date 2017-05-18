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

describe(`/ap`, () => {
  it(`should return 1 row with ApArtId 900`, (done) => {
    const method = `GET`
    const url = `/ap=900`
    server.injectThen({ method, url }).then((res) => {
      expect(res.result.length).to.equal(1)
      expect(res.result[0].ApArtId).to.equal(900)
      done()
    })
  })
})
