'use strict'

var gulp = require('gulp')

gulp.task('prod_copy_queries_to_dist', function () {
  return gulp.src('queries/**/*')
    .pipe(gulp.dest('dist/queries'))
})
