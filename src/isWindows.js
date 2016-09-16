/**
 * testet, of die Anwendung auf windows läuft
 */

'use strict'

module.exports = () =>
  /^win/.test(process.platform)
