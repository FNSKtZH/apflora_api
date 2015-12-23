/**
 * Hier werden zentral alle Konfigurationsparameter gesammelt
 */

'use strict'

var config = {}
var dbPassfile = require('./dbPass.json')

config.db = {}
config.db.userName = dbPassfile.user
config.db.passWord = dbPassfile.pass

// für alle Formulare auflisten:
// Formularname, Name der entsprechenden Tabelle in der DB, Name der ID dieser Tabelle
// wird benutzt, um mit denselben Abfragen in diesen Tabelle durchzuführen: update, insert, delete
config.tables = [
  {
    database: 'apflora',
    tabelleInDb: 'ap',
    tabelleIdFeld: 'ApArtId',
    mutWannFeld: 'MutWann',
    mutWerFeld: 'MutWer',
    form: 'ap',
    initiiereFunktion: 'initiiereAp',
    treeTyp: 'gibt es nicht!'
  },
  {
    database: 'apflora',
    tabelleInDb: 'pop',
    tabelleIdFeld: 'PopId',
    mutWannFeld: 'MutWann',
    mutWerFeld: 'MutWer',
    form: 'pop',
    initiiereFunktion: 'initiierePop',
    treeTyp: 'pop'
  },
  {
    database: 'apflora',
    tabelleInDb: 'tpop',
    tabelleIdFeld: 'TPopId',
    mutWannFeld: 'MutWann',
    mutWerFeld: 'MutWer',
    form: 'tpop',
    initiiereFunktion: 'initiiereTPop',
    treeTyp: 'tpop'
  },
  {
    database: 'apflora',
    tabelleInDb: 'tpopkontr',
    tabelleIdFeld: 'TPopKontrId',
    mutWannFeld: 'MutWann',
    mutWerFeld: 'MutWer',
    form: 'tpopfeldkontr',
    initiiereFunktion: 'initiiereTPopKontr',
    treeTyp: 'tpopfeldkontr'
  },
  {
    database: 'apflora',
    tabelleInDb: 'tpopkontrzaehl',
    tabelleIdFeld: 'TPopKontrZaehlId',
    mutWannFeld: 'MutWann',
    mutWerFeld: 'MutWer',
    form: 'tpopkontrzaehl',
    initiiereFunktion: 'initiiereTPopKontr',
    treeTyp: 'tpopfeldkontr'
  },
  {
    database: 'apflora',
    tabelleInDb: 'tpopmassn',
    tabelleIdFeld: 'TPopMassnId',
    mutWannFeld: 'MutWann',
    mutWerFeld: 'MutWer',
    form: 'tpopmassn',
    initiiereFunktion: 'initiiereTPopMassn',
    treeTyp: 'tpopmassn'
  },
  {
    database: 'apflora',
    tabelleInDb: 'ziel',
    tabelleIdFeld: 'ZielId',
    mutWannFeld: 'MutWann',
    mutWerFeld: 'MutWer',
    form: 'apziel',
    initiiereFunktion: 'initiiereApziel',
    treeTyp: 'apziel'
  },
  {
    database: 'apflora',
    tabelleInDb: 'zielber',
    tabelleIdFeld: 'ZielBerId',
    mutWannFeld: 'MutWann',
    mutWerFeld: 'MutWer',
    form: 'zielber',
    initiiereFunktion: 'initiiereZielber',
    treeTyp: 'zielber'
  },
  {
    database: 'apflora',
    tabelleInDb: 'erfkrit',
    tabelleIdFeld: 'ErfkritId',
    mutWannFeld: 'MutWann',
    mutWerFeld: 'MutWer',
    form: 'erfkrit',
    initiiereFunktion: 'initiiereErfkrit',
    treeTyp: 'erfkrit'
  },
  {
    database: 'apflora',
    tabelleInDb: 'apber',
    tabelleIdFeld: 'JBerId',
    mutWannFeld: 'MutWann',
    mutWerFeld: 'MutWer',
    form: 'jber',
    initiiereFunktion: 'initiiereJber',
    treeTyp: 'jber'
  },
  {
    database: 'apflora',
    tabelleInDb: 'apberuebersicht',
    tabelleIdFeld: 'JbuJahr',
    mutWannFeld: 'MutWann',
    mutWerFeld: 'MutWer',
    form: 'jberUebersicht',
    initiiereFunktion: 'initiiereJberUebersicht',
    treeTyp: 'jberUebersicht'
  },
  {
    database: 'apflora',
    tabelleInDb: 'ber',
    tabelleIdFeld: 'BerId',
    mutWannFeld: 'MutWann',
    mutWerFeld: 'MutWer',
    form: 'ber',
    initiiereFunktion: 'initiiereBer',
    treeTyp: 'ber'
  },
  {
    database: 'apflora',
    tabelleInDb: 'idealbiotop',
    tabelleIdFeld: 'IbApArtId',
    mutWannFeld: 'MutWann',
    mutWerFeld: 'MutWer',
    form: 'idealbiotop',
    initiiereFunktion: 'initiiereIdealbiotop',
    treeTyp: 'idealbiotop'
  },
  {
    database: 'apflora',
    tabelleInDb: 'assozart',
    tabelleIdFeld: 'AaId',
    mutWannFeld: 'MutWann',
    mutWerFeld: 'MutWer',
    form: 'assozarten',
    initiiereFunktion: 'initiiereAssozart',
    treeTyp: 'assozarten'
  },
  {
    database: 'apflora',
    tabelleInDb: 'popber',
    tabelleIdFeld: 'PopBerId',
    mutWannFeld: 'MutWann',
    mutWerFeld: 'MutWer',
    form: 'popber',
    initiiereFunktion: 'initiierePopBer',
    treeTyp: 'popber'
  },
  {
    database: 'apflora',
    tabelleInDb: 'popmassnber',
    tabelleIdFeld: 'PopMassnBerId',
    mutWannFeld: 'MutWann',
    mutWerFeld: 'MutWer',
    form: 'popmassnber',
    initiiereFunktion: 'initiierePopMassnBer',
    treeTyp: 'popmassnber'
  },
  {
    database: 'apflora',
    tabelleInDb: 'tpopber',
    tabelleIdFeld: 'TPopBerId',
    mutWannFeld: 'MutWann',
    mutWerFeld: 'MutWer',
    form: 'tpopber',
    initiiereFunktion: 'initiiereTPopBer',
    treeTyp: 'tpopber'
  },
  {
    database: 'apflora',
    tabelleInDb: 'tpopmassnber',
    tabelleIdFeld: 'TPopMassnBerId',
    mutWannFeld: 'MutWann',
    mutWerFeld: 'MutWer',
    form: 'tpopmassnber',
    initiiereFunktion: 'initiiereTPopMassnBer',
    treeTyp: 'tpopmassnber'
  },
  {
    database: 'apflora',
    tabelleInDb: 'beobzuordnung',
    tabelleIdFeld: 'NO_NOTE',
    mutWannFeld: 'BeobMutWann',
    mutWerFeld: 'BeobMutWer',
    form: 'beob',
    initiiereFunktion: '',
    treeTyp: 'drei verschiedene!'
  }
]

module.exports = config
