'use strict'

// Load modules

const Code = require(`code`)
const Lab = require(`lab`)
const appPassFile = require(`../appPass.json`)

// test shortcuts

const lab = Lab.script()
exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

// start server

const server = require(`../server.js`)

// test

describe(`/apInsert`, () => {
  it(`should insert in table ap 1 row with ApArtId 150`, (done) => {
    const name = appPassFile.user
    server
      .injectThen({
        method: `POST`,
        url: `/apInsert/apId=150/user=${name}`,
      })
      .then((res) => {
        expect(res.statusCode).to.equal(200)
        // remove row
        const method = `DELETE`
        const url = `/apflora/tabelle=ap/tabelleIdFeld=ApArtId/tabelleId=150`
        server.injectThen({ method, url })
      })
      .then(() => done())
  })
})
