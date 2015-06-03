'use strict'

var gulp = require('gulp'),
  del = require('del')

gulp.task('prod_clean_dist', function (cb) {
  del(['dist'], cb)
})
