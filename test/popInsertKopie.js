'use strict'

// load modules
const Code = require(`code`)
const Lab = require(`lab`)

// shortcuts
const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

// get server
const server = require(`../server.js`)

// test
describe(`/popInsertKopie`, () => {
  it(`should insert 1 row for apId = 900 and PopId = 5430`, (done) => {
    server.inject(
      {
        method: `POST`,
        url: `/popInsertKopie/apId=900/popId=5430/user=test`,
      },
      (res) => {
        const popId = res.result
        expect(res.statusCode).to.equal(200)
        expect(popId).to.be.above(0)
        // remove inserted row
        const method = `DELETE`
        const url = `/apflora/tabelle=pop/tabelleIdFeld=PopId/tabelleId=${popId}`
        server.inject({ method, url }, () => done())
      }
    )
  })
})
