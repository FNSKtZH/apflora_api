'use strict'

var gulp = require('gulp'),
  requireDir = require('require-dir'),
  notifier = require('node-notifier')

requireDir('../gulp-tasks', {recurse: true})

gulp.task('prod_notify', function () {
  notifier.notify({
    'title': 'finished',
    'message': 'prod code built and copied to ./dist'
  })
})
