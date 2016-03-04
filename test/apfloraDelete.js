'use strict'

// Load modules

const Code = require('code')
const Hapi = require('hapi')
const Lab = require('lab')
const apfloraDelete = require('../routes/apfloraDelete.js')
const apPost = require('../routes/apPost.js')

// test shortcuts

const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

// start server

const server = new Hapi.Server({ debug: false })
server.connection()
server.route(apfloraDelete)
server.route(apPost)
server.start()

// test

describe.skip('/apflora (delete)', () => {
  it('should delete from table ap the row with ApArtId 150', (done) => {
    const name = 'test'
    const method = 'POST'
    const url = `/apInsert/apId=150/user=${name}`
    server.inject({ method, url }, (res) => {
      const method = 'DELETE'
      const url = '/apflora/tabelle=ap/tabelleIdFeld=ApArtId/tabelleId=150'
      server.inject({ method, url }, (res) => {
        expect(res.statusCode).to.equal(200)
        done()
      })
    })
  })
})
