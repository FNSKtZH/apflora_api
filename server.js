/**
 * startet die Anwendung, indem der Server gestartet wird
 */

'use strict'

const json2csv = require('json2csv')
// wird nur in Entwicklung genutzt
const serverOptionsDevelopment = {
  debug: {
    log: ['error'],
    request: ['error']
  }
}
const Hapi = require('hapi')
const Inert = require('inert')
const server = new Hapi.Server(serverOptionsDevelopment)
const mysql = require('mysql')
const config = require('./configuration.js')
const connectionApflora = mysql.createConnection({
  host: 'localhost',
  user: config.db.userName,
  password: config.db.passWord,
  database: 'apflora'
})
const queryGemeinden = require('./queries/gemeinden.js')
const queryArtliste = require('./queries/artliste.js')
const queryApliste = require('./queries/apliste.js')
const queryQkView = require('./queries/qkView.js')
const queryQkPopOhnePopber = require('./queries/qkPopOhnePopber.js')
const queryQkPopOhnePopmassnber = require('./queries/qkPopOhnePopmassnber.js')
const queryQkTpopOhneTpopber = require('./queries/qkTpopOhneTpopber.js')
const queryQkTpopOhneMassnber = require('./queries/qkTpopOhneMassnber.js')
const adressenGet = require('./routes/adressen_get.js')
const queryLrDelarze = require('./queries/lrDelarze.js')
const queryTpopMassnTypen = require('./queries/tpopMassnTypen.js')
const queryAp = require('./queries/ap.js')
const queryApInsert = require('./queries/apInsert.js')
const queryFeldkontrZaehleinheit = require('./queries/feldkontrZaehleinheit.js')
const queryIdealbiotopUebereinst = require('./queries/idealbiotopUebereinst.js')
const queryTabelleSelectApfloraNumber = require('./queries/tabelleSelectApfloraNumber.js')
const queryTabelleSelectApfloraString = require('./queries/tabelleSelectApfloraString.js')
const queryTabelleSelectBeobNumber = require('./queries/tabelleSelectBeobNumber.js')
const queryTabelleSelectBeobString = require('./queries/tabelleSelectBeobString.js')
const queryTabelleInsertApflora = require('./queries/tabelleInsertApflora.js')
const queryTabelleInsertMultipleApflora = require('./queries/tabelleInsertMultipleApflora.js')
const queryTpopmassnInsertKopie = require('./queries/tpopmassnInsertKopie.js')
const queryTpopkontrInsertKopie = require('./queries/tpopkontrInsertKopie.js')
const queryTpopInsertKopie = require('./queries/tpopInsertKopie.js')
const queryTpopKoordFuerProgramm = require('./queries/tpopKoordFuerProgramm.js')
const queryPopInsertKopie = require('./queries/popInsertKopie.js')
const queryFeldkontrInsert = require('./queries/feldkontrInsert.js')
const queryTabelleUpdateApflora = require('./queries/tabelleUpdateApflora.js')
const queryTabelleUpdateMultipleApflora = require('./queries/tabelleUpdateMultipleApflora.js')
const queryTabelleUpdateBeob = require('./queries/tabelleUpdateBeob.js')
const queryTabelleDeleteApflora = require('./queries/tabelleDeleteApflora.js')
const queryAnmeldung = require('./queries/anmeldung.js')
const treeQualitaetskontrollen = require('./queries/tree/qualitaetskontrollen.js')
const treeAssozarten = require('./queries/tree/assozarten.js')
const treeIdealbiotop = require('./queries/tree/idealbiotop.js')
const treeBeobNichtZuzuordnen = require('./queries/tree/beobNichtZuzuordnen.js')
const treeBeobNichtBeurteilt = require('./queries/tree/beobNichtBeurteilt.js')
const treeBer = require('./queries/tree/ber.js')
const treeJBer = require('./queries/tree/jber.js')
const treeErfkrit = require('./queries/tree/erfkrit.js')
const treeApziel = require('./queries/tree/apziel.js')
const treePop = require('./queries/tree/pop.js')
const queryBeobDistzutpopEvab = require('./queries/beobDistzutpopEvab.js')
const queryBeobNaechsteTpop = require('./queries/beobNaechsteTpop.js')
const queryBeobDistzutpopInfospezies = require('./queries/beobDistzutpopInfospezies.js')
const queryBeobKarte = require('./queries/beobKarte.js')
const queryBeobZuordnen = require('./queries/beobZuordnen.js')
const queryApKarte = require('./queries/apKarte.js')
const queryPopKarte = require('./queries/popKarte.js')
const queryPopKarteAlle = require('./queries/popKarteAlle.js')
const queryPopChKarte = require('./queries/popChKarte.js')
const queryPopsChKarte = require('./queries/popsChKarte.js')
const queryTPopKarte = require('./queries/tpopKarte.js')
const queryTPopsKarte = require('./queries/tpopsKarte.js')
const queryTPopKarteAlle = require('./queries/tpopKarteAlle.js')
const exportView = require('./queries/exportView.js')
const exportViewWhereIdIn = require('./queries/exportViewWhereIdIn.js')
const getKmlForPop = require('./src/getKmlForPop.js')
const getKmlForTpop = require('./src/getKmlForTpop.js')
const aktualisiereArteigenschaften = require('./queries/aktualisiereArteigenschaften.js')
const escapeStringForSql = require('./queries/escapeStringForSql.js')

connectionApflora.connect()

server.register(Inert, function () {
  server.connection({
    host: '0.0.0.0',
    port: 4001,
    routes: {
      cors: true
    }
  })

  server.route({
    method: 'GET',
    path: '/{path*}',
    handler (request, reply) {
      reply.file('index.html')
    }
  })

  server.route({
    method: 'GET',
    path: '/src/{param*}',
    handler: {
      directory: {
        path: 'src'
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/style/images/{param*}',
    handler: {
      directory: {
        path: 'style/images'
      }
    }
  })

  /* Versuch, funktioniert nicht*/
  server.route({
    method: 'GET',
    path: '/etc/{param*}',
    handler: {
      directory: {
        path: 'etc'
      }
    }
  })

  /*server.route({
      method: 'GET',
      path: '/etc/beziehungen.png',
      // vhost: ['api.apflora.ch', 'api.localhost'],
    handler (request, reply) {
          reply.file('etc/beziehungen.png')
      }
  });*/

  server.route({
    method: 'GET',
    path: '/style/{param*}',
    handler: {
      directory: {
        path: 'style'
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/kml/{param*}',
    handler: {
      directory: {
        path: 'kml'
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/geojson/{param*}',
    handler: {
      directory: {
        path: 'geojson'
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/img/{param*}',
    handler: {
      directory: {
        path: 'img'
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/gemeinden',
    handler: queryGemeinden
  })

  server.route({
    method: 'GET',
    path: '/artliste',
    handler: queryArtliste
  })

  server.route({
    method: 'GET',
    path: '/apliste/programm={programm}',
    handler: queryApliste
  })

  server.route({
    method: 'GET',
    path: '/qkView/{viewName}/{apId}/{berichtjahr?}',
    handler: queryQkView
  })

  server.route({
    method: 'GET',
    path: '/qkPopOhnePopber/{apId}/{berichtjahr}',
    handler: queryQkPopOhnePopber
  })

  server.route({
    method: 'GET',
    path: '/qkPopOhnePopmassnber/{apId}/{berichtjahr}',
    handler: queryQkPopOhnePopmassnber
  })

  server.route({
    method: 'GET',
    path: '/qkTpopOhneTpopber/{apId}/{berichtjahr}',
    handler: queryQkTpopOhneTpopber
  })

  server.route({
    method: 'GET',
    path: '/qkTpopOhneMassnber/{apId}/{berichtjahr}',
    handler: queryQkTpopOhneMassnber
  })

  server.route({
    method: 'GET',
    path: '/anmeldung/name={name}/pwd={pwd}',
    handler: queryAnmeldung
  })

  server.route(adressenGet)

  server.route({
    method: 'GET',
    path: '/apflora/tabelle={tabelle}/feld={feld}/wertNumber={wert}',
    handler: queryTabelleSelectApfloraNumber
  })

  server.route({
    method: 'GET',
    path: '/beob/tabelle={tabelle}/feld={feld}/wertNumber={wert}',
    handler: queryTabelleSelectBeobNumber
  })

  server.route({
    method: 'GET',
    path: '/apflora/tabelle={tabelle}/feld={feld}/wertString={wert}',
    handler: queryTabelleSelectApfloraString
  })

  server.route({
    method: 'GET',
    path: '/beob/tabelle={tabelle}/feld={feld}/wertString={wert}',
    handler: queryTabelleSelectBeobString
  })

  server.route({
    method: 'POST',
    path: '/update/apflora/tabelle={tabelle}/tabelleIdFeld={tabelleIdFeld}/tabelleId={tabelleId}/feld={feld}/wert={wert?}/user={user}',
    handler: queryTabelleUpdateApflora
  })

  server.route({
    method: 'POST',
    path: '/updateMultiple/apflora/tabelle={tabelle}/felder={felder}',
    handler: queryTabelleUpdateMultipleApflora
  })

  server.route({
    method: 'POST',
    path: '/update/beob/tabelle={tabelle}/tabelleIdFeld={tabelleIdFeld}/tabelleId={tabelleId}/feld={feld}/wert={wert?}/user={user}',
    handler: queryTabelleUpdateBeob
  })

  server.route({
    method: 'POST',
    path: '/insert/apflora/tabelle={tabelle}/feld={feld}/wert={wert}/user={user}',
    handler: queryTabelleInsertApflora
  })

  server.route({
    method: 'POST',
    path: '/insertMultiple/apflora/tabelle={tabelle}/felder={felder}',
    handler: queryTabelleInsertMultipleApflora
  })

  server.route({
    method: 'POST',
    path: '/tpopmassnInsertKopie/tpopId={tpopId}/tpopMassnId={tpopMassnId}/user={user}',
    handler: queryTpopmassnInsertKopie
  })

  server.route({
    method: 'POST',
    path: '/tpopkontrInsertKopie/tpopId={tpopId}/tpopKontrId={tpopKontrId}/user={user}',
    handler: queryTpopkontrInsertKopie
  })

  server.route({
    method: 'POST',
    path: '/tpopInsertKopie/popId={popId}/tpopId={tpopId}/user={user}',
    handler: queryTpopInsertKopie
  })

  server.route({
    method: 'GET',
    path: '/tpopKoordFuerProgramm/apId={apId}',
    handler: queryTpopKoordFuerProgramm
  })

  server.route({
    method: 'POST',
    path: '/popInsertKopie/apId={apId}/popId={popId}/user={user}',
    handler: queryPopInsertKopie
  })

  server.route({
    method: 'POST',
    path: '/insert/feldkontr/tpopId={tpopId}/tpopKontrtyp={tpopKontrtyp?}/user={user}',
    handler: queryFeldkontrInsert
  })

  server.route({
    method: 'DELETE',
    path: '/apflora/tabelle={tabelle}/tabelleIdFeld={tabelleIdFeld}/tabelleId={tabelleId}',
    handler: queryTabelleDeleteApflora
  })

  server.route({
    method: 'GET',
    path: '/lrDelarze',
    handler: queryLrDelarze
  })

  server.route({
    method: 'GET',
    path: '/tpopMassnTypen',
    handler: queryTpopMassnTypen
  })

  server.route({
    method: 'GET',
    path: '/ap={apId}',
    handler: queryAp
  })

  server.route({
    method: 'POST',
    path: '/apInsert/apId={apId}/user={user}',
    handler: queryApInsert
  })

  server.route({
    method: 'GET',
    path: '/feldkontrZaehleinheit',
    handler: queryFeldkontrZaehleinheit
  })

  server.route({
    method: 'GET',
    path: '/idealbiotopUebereinst',
    handler: queryIdealbiotopUebereinst
  })

  /**
   * Wenn mehrere DB-Aufrufe nötig sind, können sie parallel getätigt werden:
   * pre: ... (siehe http://blog.andyet.com/tag/node bei 20min)
   * und im reply zu einem Objekt zusammengefasst werden
   * Beispiel: BeoListe, FeldListe, tree
   */

  server.route({
    method: 'GET',
    path: '/tree/apId={apId}',
    config: {
      pre: [
        [
          { method: treeAssozarten, assign: 'assozarten' },
          { method: treeIdealbiotop, assign: 'idealbiotop' },
          { method: treeBeobNichtZuzuordnen, assign: 'beobNichtZuzuordnen' },
          { method: treeBeobNichtBeurteilt, assign: 'beobNichtBeurteilt' },
          { method: treeBer, assign: 'ber' },
          { method: treeJBer, assign: 'jber' },
          { method: treeErfkrit, assign: 'erfkrit' },
          { method: treeApziel, assign: 'apziel' },
          { method: treePop, assign: 'pop' },
          { method: treeQualitaetskontrollen, assign: 'qualitaetskontrollen' }
        ]

      ],
      handler (request, reply) {
        reply([
          request.pre.qualitaetskontrollen,
          request.pre.pop,
          request.pre.apziel,
          request.pre.erfkrit,
          request.pre.jber,
          request.pre.ber,
          request.pre.beobNichtBeurteilt,
          request.pre.beobNichtZuzuordnen,
          request.pre.idealbiotop,
          request.pre.assozarten
        ])
      }
    }

  })

  server.route({
    method: 'GET',
    path: '/beobDistzutpopEvab/beobId={beobId}',
    handler: queryBeobDistzutpopEvab
  })

  server.route({
    method: 'GET',
    path: '/beobDistzutpopInfospezies/beobId={beobId}',
    handler: queryBeobDistzutpopInfospezies
  })

  server.route({
    method: 'GET',
    path: '/beobNaechsteTpop/apId={apId}/X={X}/Y={Y}',
    handler: queryBeobNaechsteTpop
  })

  server.route({
    method: 'GET',
    path: '/beobKarte/apId={apId?}/tpopId={tpopId?}/beobId={beobId?}/nichtZuzuordnen={nichtZuzuordnen?}',
    handler: queryBeobKarte
  })

  server.route({
    method: 'GET',
    path: '/beobZuordnen/apId={apId}',
    handler: queryBeobZuordnen
  })

  server.route({
    method: 'GET',
    path: '/apKarte/apId={apId}',
    handler: queryApKarte
  })

  server.route({
    method: 'GET',
    path: '/popKarte/popId={popId}',
    handler: queryPopKarte
  })

  server.route({
    method: 'GET',
    path: '/popKarteAlle/apId={apId}',
    handler: queryPopKarteAlle
  })

  server.route({
    method: 'GET',
    path: '/popChKarte/popId={popId}',
    handler: queryPopChKarte
  })

  server.route({
    method: 'GET',
    path: '/popsChKarte/apId={apId}',
    handler: queryPopsChKarte
  })

  server.route({
    method: 'GET',
    path: '/tpopKarte/tpopId={tpopId}',
    handler: queryTPopKarte
  })

  server.route({
    method: 'GET',
    path: '/tpopsKarte/popId={popId}',
    handler: queryTPopsKarte
  })

  server.route({
    method: 'GET',
    path: '/tpopKarteAlle/apId={apId}',
    handler: queryTPopKarteAlle
  })

  server.route({
    method: 'GET',
    path: '/exportView/xslx/view={view}',
    // handler: exportView
    handler (request, reply) {
      exportView(request, (err, data) => {
        if (err) return reply(err)
        reply(data)
          .header('Content-Type', 'application/json;')
          .header('Accept', 'application/json;')
          // .header('Content-disposition', 'attachment; filename=' + filename + '.csv')
          .header('Pragma', 'no-cache')
      // .header('Set-Cookie', 'fileDownload=true; path=/')
      })
    }
  })

  server.route({
    method: 'GET',
    path: '/exportView/csv/view={view}/filename={filename}',
    handler (request, reply) {
      const filename = escapeStringForSql(request.params.filename)
      exportView(request, (err, data) => {
        const fields = Object.keys(data[0])
        if (err) return reply(err)
        json2csv(
          { data, fields },
          (err, csv) => {
            if (err) return reply(err)
            reply(csv)
              .header('Content-Type', 'text/x-csv; charset=utf-8')
              .header('Content-disposition', `attachment; filename=${filename}.csv`)
              .header('Pragma', 'no-cache')
              .header('Set-Cookie', 'fileDownload=true; path=/')
          }
        )
      })
    }
  })

  server.route({
    method: 'GET',
    path: '/exportView/csv/view={view}/filename={filename}/{apId}',
    handler (request, reply) {
      const filename = escapeStringForSql(request.params.filename)
      exportView(request, (err, data) => {
        const fields = Object.keys(data[0])
        if (err) return reply(err)
        json2csv(
          { data, fields },
          (err, csv) => {
            if (err) return reply(err)
            reply(csv)
              .header('Content-Type', 'text/x-csv; charset=utf-8')
              .header('Content-disposition', `attachment; filename=${filename}.csv`)
              .header('Pragma', 'no-cache')
              .header('Set-Cookie', 'fileDownload=true; path=/')
          }
        )
      })
    }
  })

  server.route({
    method: 'GET',
    path: '/exportViewWhereIdIn/csv/view={view}/idName={idName}/idListe={idListe}/filename={filename}',
    handler (request, reply) {
      const filename = request.params.filename
      exportViewWhereIdIn(request, (err, data) => {
        if (err) return reply(err)
        const fields = Object.keys(data[0])
        json2csv(
          { data, fields },
          (err, csv) => {
            if (err) return reply(err)
            reply(csv)
              .header('Content-Type', 'text/x-csv; charset=utf-8')
              .header('Content-disposition', `attachment; filename=${filename}.csv`)
              .header('Pragma', 'no-cache')
              .header('Set-Cookie', 'fileDownload=true; path=/')
          }
        )
      })
    }
  })

  server.route({
    method: 'GET',
    path: '/exportView/kml/view={view}/filename={filename}',
    handler (request, reply) {
      const filename = request.params.filename
      const view = request.params.view
      let kml

      exportView(request, (err, data) => {
        if (err) return reply(err)
        switch (view) {
          case 'v_pop_kml':
          case 'v_pop_kmlnamen':
            kml = getKmlForPop(data)
            break
          case 'v_tpop_kml':
          case 'v_tpop_kmlnamen':
            kml = getKmlForTpop(data)
            break
        }
        if (kml) {
          reply(kml)
            .header('Content-Type', 'application/vnd.google-earth.kml+xml kml; charset=utf-8')
            .header('Content-disposition', `attachment; filename=${filename}.kml`)
            .header('Pragma', 'no-cache')
            .header('Set-Cookie', 'fileDownload=true; path=/')
        }
      })
    }
  })

  server.route({
    method: 'GET',
    path: '/aktualisiereArteigenschaften',
    handler (request, reply) {
      aktualisiereArteigenschaften(request, reply)
    }
  })
})

server.start(function (err) {
  if (err) throw err
  console.log('Server running at:', server.info.uri)
})

module.exports = server
