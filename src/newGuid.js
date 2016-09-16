// erstellt einen guid
// Quelle: http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript

'use strict'

module.exports = () =>
  `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0  // eslint-disable-line
    const v = c === 'x' ? r : (r & 0x3 | 0x8)  // eslint-disable-line
    return v.toString(16)
  })
