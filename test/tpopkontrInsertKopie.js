'use strict'

// load modules
const Code = require(`code`)
const Lab = require(`lab`)

// shortcuts
const lab = Lab.script()
exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

// get server
const server = require(`../server.js`)

// test
describe(`/tpopkontrInsertKopie`, () => {
  it(`should insert 1 row for tpopId = 2146453453 and tpopKontrId = 5541`, (done) => {
    server.injectThen({
      method: `POST`,
      url: `/tpopkontrInsertKopie/tpopId=2146453453/tpopKontrId=5541/user=test`,
    })
      .then((res) => {
        const tpopKontrId = res.result
        expect(res.statusCode).to.equal(200)
        expect(tpopKontrId).to.be.above(0)
        // remove inserted row
        const method = `DELETE`
        const url = `/apflora/tabelle=tpopkontr/tabelleIdFeld=TPopKontrId/tabelleId=${tpopKontrId}`
        return server.inject({ method, url })
      })
      .then(() => done())
  })
})
