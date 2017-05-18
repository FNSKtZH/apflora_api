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

describe(`/insertMultiple/apflora`, () => {
  it(`should insert in table pop 1 row with {PopNr:1,PopName:"test",MutWer:"test"}`, done => {
    const felderObject = {
      PopNr: 1,
      PopName: `test`,
      MutWer: `test`,
    }
    const felder = JSON.stringify(felderObject)
    server
      .injectThen({
        method: `POST`,
        url: `/insertMultiple/apflora/tabelle=pop/felder=${felder}`,
      })
      .then(res => {
        const popId = res.result
        expect(res.statusCode).to.equal(200)
        expect(popId).to.be.above(0)
        // remove inserted row
        const method = `DELETE`
        const url = `/apflora/tabelle=pop/tabelleIdFeld=PopId/tabelleId=${popId}`
        return server.injectThen({ method, url })
      })
      .then(() => done())
  })
})
