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
  var filename = 'Populationen_' + getTimestamp()
  var kml
  var art
  var zeile

  // header schreiben
  kml = getHeaderForKml(filename)
  // folder beginnen
  kml += '<Folder>'

  // Zeilen schreiben
  pops.forEach(function (pop) {
    zeile = ''
    if (art && art !== pop.Art) {
      // neue Art: Folder abschliessen und neuen beginnen
      zeile += '</Folder><Folder>'
    }
    zeile += '<name>'
    zeile += removeKmlNogoStrings(pop.Art)
    zeile += '</name>'
    zeile += '<Placemark><name>'
    zeile += removeKmlNogoStrings(pop.Label)
    zeile += '</name>'
    // html in xml muss in cdata gewickelt werden
    zeile += '<description><![CDATA['
    zeile += removeKmlNogoStrings(pop.Inhalte)
    zeile += "<br><a href='"
    zeile += pop.URL
    zeile += "'>Formular öffnen</a>"
    zeile += ']]></description>'
    zeile += '<styleUrl>#MyStyle</styleUrl>'
    zeile += '<Point><coordinates>'
    zeile += pop.Laengengrad
    zeile += ','
    zeile += pop.Breitengrad
    zeile += ',0</coordinates></Point>'
    zeile += '</Placemark>'
    // art zwischenspeichern, um zu merken, wenn sie ändert
    art = pop.Art
    kml += zeile + '\n'
  })

  // folder abschliessen
  kml += '</Folder>'

  // footer schreiben
  kml += getFooterForKml()

  // kml zurück geben
  return kml
}
