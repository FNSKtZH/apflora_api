'use strict'

// Load modules

const Code = require('code')
const Hapi = require('hapi')
const Lab = require('lab')
const apPost = require('../routes/apPost.js')
const apfloraDelete = require('../routes/apfloraDelete.js')
const appPassFile = require('../appPass.json')

// test shortcuts

const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

// start server

const server = new Hapi.Server({ debug: false })
server.connection()
server.route(apPost)
server.route(apfloraDelete)
server.start()

// test

describe.skip('/apInsert', () => {
  it('should insert in table ap 1 row with ApArtId 150', (done) => {
    const name = appPassFile.user
    const method = 'POST'
    const url = `/apInsert/apId=150/user=${name}`
    server.inject({ method, url }, (res) => {
      expect(res.statusCode).to.equal(200)
      // remove row
      const method = 'DELETE'
      const url = '/apflora/tabelle=ap/tabelleIdFeld=ApArtId/tabelleId=150'
      server.inject({ method, url }, (res) => done())
    })
  })
})
