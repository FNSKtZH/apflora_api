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

describe(`/beobDistzutpopEvab`, () => {
  it(`should return more than 100 rows for a sighting of Aceras anthropophorum`, (done) => {
    const method = `GET`
    const url = `/beobDistzutpopEvab/beobId=9CAD7177-BDD6-4E94-BC3B-F18CDE7EEA58`
    server.injectThen({ method, url })
      .then((res) => {
        expect(res.result.length).to.be.above(100)
        done()
      })
  })
})
