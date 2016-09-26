// erhält die höchste PopNr der Liste und die aktuelle
// stellt der aktuellen PopNr soviele Nullen voran, dass
// alle Nummern dieselbe Anzahl stellen haben
module.exports = (popNrMaxPassed, popNrPassed) => {
  /* jslint white: true, plusplus: true */
  if (!popNrPassed && popNrPassed !== 0) return null
  if (!popNrMaxPassed && popNrMaxPassed !== 0) return null

  // Nummern in Strings umwandeln
  const popNrMax = popNrMaxPassed.toString()
  let popNr = popNrPassed.toString()

  let stellendifferenz = popNrMax.length - popNr.length

  // Voranzustellende Nullen generieren
  while (stellendifferenz > 0) {
    popNr = `0${popNr}`
    stellendifferenz -= 1
  }

  return popNr
}
