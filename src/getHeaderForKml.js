/**
 * baut den header für ein kml-file
 * bekommt den Filenamen
 * retourniert das kml für den Header
 */

'use strict'

module.exports = function (filename) {
  return "<?xml version='1.0' encoding='UTF-8'?><kml xmlns='http://earth.google.com/kml/2.1'><Document><name>" + filename + "</name><Style id='MyStyle'><IconStyle><Icon><href>http://maps.google.com/mapfiles/kml/pushpin/red-pushpin.png</href></Icon></IconStyle></Style>"
}
