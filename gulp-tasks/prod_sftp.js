/**
 * beamt die Dateien aus dem dist-Ordner nach apflora.ch
 */

'use strict'

var gulp = require('gulp')
var sftp = require('gulp-sftp')
var requireDir = require('require-dir')
var sftpPass = require('../sftpPass.json')

requireDir('../gulp-tasks', {recurse: true})

gulp.task('prod_sftp', function () {
  return gulp.src('dist/**/*')
    .pipe(sftp({
      // host: 'api.apflora.ch',
      host: '46.101.153.44',
      port: 30000,
      remotePath: 'apflora',
      user: sftpPass.user,
      pass: sftpPass.pass
    }))
})
