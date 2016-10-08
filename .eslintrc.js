module.exports = {
  "parser": "babel-eslint",
  "extends": "airbnb",
  "env": {
    "node": true
  },
  "globals": {
    "emit": true,
    "doc": true
  },
  "rules": {
    "react/require-extension": "off",
    // "linebreak-style": ["error", "windows"],
    "react/jsx-sort-props": 0,
    "react/jsx-no-bind": 0,
    "comma-dangle": 0,
    "no-use-before-define": 0,
    "consistent-return": 0,
    "semi": [2, "never"],
    "quotes": ["error", "backtick"],
    "strict": 0,
    "max-len": [
      "error",
      120,
      2,
      {
        "ignoreUrls": true,
        "ignoreStrings": true,
        "ignoreTemplateLiterals": true,
        "ignoreTrailingComments": true
      }
    ],
    "no-param-reassign": ["error", { "props": false }]
  }
}
