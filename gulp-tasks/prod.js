/**
 * Baut das Projekt für die Produktion
 */

'use strict'

var gulp = require('gulp'),
  requireDir = require('require-dir'),
  runSequence = require('run-sequence')

requireDir('../gulp-tasks', {recurse: true})

gulp.task('prod', function () {
  runSequence(
    'prod_clean_dist',
    'prod_copy',
    'prod_sftp'
  )
})
