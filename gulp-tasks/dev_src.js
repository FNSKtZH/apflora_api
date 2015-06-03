'use strict'

var gulp = require('gulp'),
  concat = require('gulp-concat-sourcemap')

gulp.task('dev_src', function () {
  return gulp.src([])
    .pipe(concat('apflora_built.js'))
    .pipe(gulp.dest('./src'))
})
