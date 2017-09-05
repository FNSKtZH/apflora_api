'use strict'

module.exports = str => {
  if (str && typeof str === `string`) {
    // eslint-disable-line valid-typeof
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%/]/g, char => {
      // eslint-disable-line no-useless-escape
      switch (char) { // eslint-disable-line default-case
        case `\0`:
          return `\\0`
        case `\x08`:
          return `\\b`
        case `\x09`:
          return `\\t`
        case `\x1a`:
          return `\\z`
        case `\n`:
          return `\\n`
        case `\r`:
          return `\\r`
        case `"`: // seems to work in payload
        case `'`: // seems to create error
        case `\\`:
        case `%`: // seems to work in payload
          return `\\${char}` // prepends a backslash to backslash, percent and double/single quotes
        case `/`: // seems to work in payload
          return `|`
      }
    })
  }
  return str
}
