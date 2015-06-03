'use strict'

var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat')

gulp.task('prod_build_src', function () {
  return gulp.src([])
    .pipe(concat('apflora_built.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./src'))
    .pipe(gulp.dest('./dist/src'))
})
