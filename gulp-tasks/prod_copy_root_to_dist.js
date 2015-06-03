'use strict'

var gulp = require('gulp')

gulp.task('prod_copy_root_to_dist', function () {
  return gulp.src([
    'configuration.js',
    'server.js',
    'dbPass.json',
    'package.json',
    'License.md',
    'README.md'
  ])
    .pipe(gulp.dest('dist/'))
})
