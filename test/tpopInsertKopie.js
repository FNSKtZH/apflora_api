'use strict'

// load modules
const Code = require(`code`)
const Lab = require(`lab`)

// shortcuts
const lab = Lab.script()
exports.lab = lab
const describe = lab.describe
const it = lab.it
const expect = Code.expect

// get server
const server = require(`../server.js`)

// test
describe(`/tpopInsertKopie`, () => {
  it(`should insert 1 row for apId = 900, PopId = 5430 and TPopId = 13542`, (done) => {
    server.injectThen({
      method: `POST`,
      url: `/tpopInsertKopie/popId=5430/tpopId=13542/user=test`,
    })
      .then((res) => {
        const tPopId = res.result
        expect(res.statusCode).to.equal(200)
        expect(tPopId).to.be.above(0)
        // remove inserted row
        const method = `DELETE`
        const url = `/apflora/tabelle=tpop/tabelleIdFeld=TPopId/tabelleId=${tPopId}`
        return server.injectThen({ method, url })
      })
      .then(() => done())
  })
})
