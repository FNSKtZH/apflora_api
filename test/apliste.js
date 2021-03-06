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

describe(`/apliste`, () => {
  it(`should return more than 50 rows for programmAp`, (done) => {
    const method = `GET`
    const url = `/apliste/programm=programmAp`
    server.injectThen({ method, url }).then((res) => {
      expect(res.result.length).to.be.above(50)
      done()
    })
  })
  it(`should return more than 520 rows for programmAlle`, (done) => {
    const method = `GET`
    const url = `/apliste/programm=programmAlle`
    server.injectThen({ method, url }).then((res) => {
      expect(res.result.length).to.be.above(520)
      done()
    })
  })
  it(`should return more than 7400 rows for programmNeu`, (done) => {
    const method = `GET`
    const url = `/apliste/programm=programmNeu`
    server.injectThen({ method, url }).then((res) => {
      expect(res.result.length).to.be.above(7400)
      done()
    })
  })
})
