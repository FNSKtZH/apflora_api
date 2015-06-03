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
    'templates',
    ['browserify', 'prod_clean_dist'],
    ['prod_build_src', 'prod_build_html'],
    'prod_copy',
    'prod_notify'
  )
})
