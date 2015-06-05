/**
 * beamt die Dateien aus dem dist-Ordner nach apflora.ch
 */

'use strict'

var gulp = require('gulp'),
  sftp = require('gulp-sftp'),
  requireDir = require('require-dir'),
  sftpPass = require('../sftpPass.json')

requireDir('../gulp-tasks', {recurse: true})

gulp.task('prod_sftp', function () {
  return gulp.src('dist/**/*')
    .pipe(sftp({
      host: 'api.apflora.ch',
      port: 30000,
      remotePath: 'apflora',
      user: sftpPass.user,
      pass: sftpPass.pass
    }))
})
