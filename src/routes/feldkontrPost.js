'use strict'

const queryFeldkontrInsert = require('../../queries/feldkontrInsert.js')

module.exports = [
  {
    method: 'POST',
    path: '/insert/feldkontr/tpopId={tpopId}/tpopKontrtyp={tpopKontrtyp?}/user={user}',
    handler: queryFeldkontrInsert
  }
]
