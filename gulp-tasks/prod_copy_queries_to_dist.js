'use strict'

var gulp = require('gulp')

gulp.task('prod_copy_queries_to_dist', function () {
  return gulp.src('handler/**/*')
    .pipe(gulp.dest('dist/handler'))
})
