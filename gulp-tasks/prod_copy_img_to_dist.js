'use strict'

var gulp = require('gulp')

gulp.task('prod_copy_img_to_dist', function () {
  return gulp.src('img/*')
    .pipe(gulp.dest('dist/img'))
})
