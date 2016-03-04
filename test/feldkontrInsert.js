'use strict'

// Load modules

const Code = require('code')
const Hapi = require('hapi')
const Lab = require('lab')
const feldkontrPost = require('../routes/feldkontrPost.js')

// test shortcuts

const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

// start server

const server = new Hapi.Server({ debug: false })
server.connection()
server.route(feldkontrPost)
server.start()

// test

describe.skip('/insert/feldkontr', () => {
  it('should insert a feldkontr for tpopId 72856123', (done) => {
    server.inject({
      method: 'post',
      url: '/insert/feldkontr/tpopId=72856123/tpopKontrtyp=/user=test'
    }, (res) => {
      expect(res.statusCode).to.equal(200)
      expect(res.result.rows.length).to.equal(1)
      done()
    })
  })
  it('should insert a freiwkontr for tpopId 72856123', (done) => {
    server.inject({
      method: 'post',
      url: '/insert/feldkontr/tpopId=72856123/tpopKontrtyp=Freiwilligen-Erfolgskontrolle/user=test'
    }, (res) => {
      expect(res.statusCode).to.equal(200)
      expect(res.result.rows.length).to.equal(1)
      done()
    })
  })
})
