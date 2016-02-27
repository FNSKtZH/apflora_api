'use strict'

// Load modules

const Code = require('code')
const Hapi = require('hapi')
const Lab = require('lab')
const queryApInsert = require('../queries/apInsert.js')
const appPassFile = require('../appPass.json')

// test shortcuts

const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

// test

describe('/apInsert', () => {
  it('should insert in table ap 1 row with ApArtId 150', (done) => {
    const server = new Hapi.Server({ debug: false })
    server.connection()
    server.route({
      method: 'POST',
      path: '/apInsert/apId={apId}/user={user}',
      handler: queryApInsert
    })
    const name = appPassFile.user
    server.inject({
      method: 'post',
      url: `/apInsert/apId=150/user=${name}`
    }, (res) => {
      expect(res.statusCode).to.equal(200)
      done()
    })
  })
})
