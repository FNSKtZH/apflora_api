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
describe(`/tpopmassnInsertKopie`, () => {
  it(`should insert 1 row for tpopId = 2146453453 and tpopMassnId = 5446`, (done) => {
    server.inject(
      {
        method: `POST`,
        url: `/tpopmassnInsertKopie/tpopId=2146453453/tpopMassnId=5446/user=test`,
      },
      (res) => {
        const tpopMassnId = res.result
        expect(res.statusCode).to.equal(200)
        expect(tpopMassnId).to.be.above(0)
        // remove inserted row
        const method = `DELETE`
        const url = `/apflora/tabelle=tpopmassn/tabelleIdFeld=TPopMassnId/tabelleId=${tpopMassnId}`
        server.inject({ method, url }, () => done())
      }
    )
  })
})
