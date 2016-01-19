/**
 * baut das kml für Populationen
 * bekommt die Daten der Populationen
 * retourniert das kml
 */

'use strict'

const removeKmlNogoStrings = require('./removeKmlNogoStrings')
const getHeaderForKml = require('./getHeaderForKml')
const getFooterForKml = require('./getFooterForKml')
const getTimestamp = require('./getTimestamp')

module.exports = (pops) => {
  const filename = `Populationen_${getTimestamp()}`

  // header schreiben
  let kml = getHeaderForKml(filename)
  // folder beginnen
  kml += `\n    <Folder>\n  `

  // Zeilen schreiben
  pops.forEach((pop, index) => {
    let zeile = ''
    // neue Art: Folder abschliessen und neuen beginnen

    if (index > 0 && pops[index - 1].Art !== pop.Art) {
      zeile += `  </Folder>\n    <Folder>\n  `
    }
    // html in xml muss in cdata gewickelt werden
    zeile += `    <name>
        ${removeKmlNogoStrings(pop.Art)}
      </name>
      <Placemark>
        <name>
          ${removeKmlNogoStrings(pop.Label)}
        </name>
        <description>
          <![CDATA[${removeKmlNogoStrings(pop.Inhalte)}<br><a href='${pop.URL}'>Formular öffnen</a>]]>
        </description>
        <styleUrl>
          #MyStyle
        </styleUrl>
        <Point>
          <coordinates>
            ${pop.Laengengrad},${pop.Breitengrad},0
          </coordinates>
        </Point>
      </Placemark>\n  `
    kml += zeile
  })

  // folder abschliessen
  kml += `  </Folder>\n`

  // footer schreiben
  kml += getFooterForKml()

  return kml
}
