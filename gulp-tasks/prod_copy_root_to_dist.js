'use strict'

var gulp = require('gulp')

gulp.task('prod_copy_root_to_dist', function () {
  return gulp.src([
    'configuration.js',
    'server.js',
    'package.json',
    'License.md',
    'README.md',
    'dbConnection.js',
    'pgPlugin.js',
    'startServer.js'
  ])
    .pipe(gulp.dest('dist/'))
})
