'use strict'

var gulp = require('gulp')

gulp.task('prod_copy_etc_to_dist', function () {
  return gulp.src('etc/*')
    .pipe(gulp.dest('dist/etc'))
})
