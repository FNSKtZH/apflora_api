'use strict'

var gulp = require('gulp'),
  handlebars = require('gulp-handlebars'),
  defineModule = require('gulp-define-module')

gulp.task('templates', function () {
  return gulp.src('src/templatesDev/**/*')
    .pipe(handlebars())
    .pipe(defineModule('node'))
    .pipe(gulp.dest('./src/templates'))
})
