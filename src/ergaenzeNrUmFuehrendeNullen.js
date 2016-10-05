// erhält die höchste Nr der Liste und die aktuelle
// stellt der aktuellen Nr soviele Nullen voran, dass
// alle Nummern dieselbe Anzahl stellen haben
module.exports = (nrMaxPassed, nrPassed) => {
  /* jslint white: true, plusplus: true */
  if (!nrPassed && nrPassed !== 0) return null
  if (!nrMaxPassed && nrMaxPassed !== 0) return null

  // Nummern in Strings umwandeln
  const nrMax = nrMaxPassed.toString()
  let nr = nrPassed.toString()

  let stellendifferenz = nrMax.length - nr.length

  // Voranzustellende Nullen generieren
  while (stellendifferenz > 0) {
    nr = `0${nr}`
    stellendifferenz -= 1
  }

  return nr
}
