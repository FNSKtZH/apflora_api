/**
 * baut das kml für Populationen
 * bekommt die Daten der Populationen
 * retourniert das kml
 */

'use strict'

var removeKmlNogoStrings = require('./removeKmlNogoStrings')
var getHeaderForKml = require('./getHeaderForKml')
var getFooterForKml = require('./getFooterForKml')
var getTimestamp = require('./getTimestamp')

module.exports = function (pops) {
  var filename = 'Teilpopulationen_' + getTimestamp()
  var kml
  var art
  var zeile

  // header schreiben
  kml = getHeaderForKml(filename)
  // folder beginnen
  kml += '<Folder>'

  // Zeilen schreiben
  pops.forEach(function (tpop) {
    zeile = ''
    if (art && art !== tpop.Art) {
      // neue Art: Folder abschliessen und neuen beginnen
      zeile += '</Folder><Folder>'
    }
    zeile += '<name>'
    zeile += removeKmlNogoStrings(tpop.Art)
    zeile += '</name>'
    zeile += '<Placemark><name>'
    zeile += removeKmlNogoStrings(tpop.Label)
    zeile += '</name>'
    // html in xml muss in cdata gewickelt werden
    zeile += '<description><![CDATA['
    zeile += removeKmlNogoStrings(tpop.Inhalte)
    zeile += "<br><a href='"
    zeile += tpop.URL
    zeile += "'>Formular öffnen</a>"
    zeile += ']]></description>'
    zeile += '<styleUrl>#default+nicon=http://maps.google.com/mapfiles/kml/pal3/icon63.png+hicon=http://maps.google.com/mapfiles/kml/pal3/icon55.png</styleUrl>'
    zeile += '<Point><coordinates>'
    zeile += tpop.Laengengrad
    zeile += ','
    zeile += tpop.Breitengrad
    zeile += ',0</coordinates></Point>'
    zeile += '</Placemark>'
    // art zwischenspeichern, um zu merken, wenn sie ändert
    art = tpop.Art
    kml += zeile + '\n'
  })

  // folder abschliessen
  kml += '</Folder>'

  // footer schreiben
  kml += getFooterForKml()

  // kml zurück geben
  return kml
}
