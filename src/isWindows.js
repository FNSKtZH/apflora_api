/**
 * testet, of die Anwendung auf windows läuft
 */

'use strict'

module.exports = function () {
  return /^win/.test(process.platform)
}
