var browserify = require('browserify'),
  gulp = require('gulp'),
  source = require('vinyl-source-stream')

gulp.task('browserify', function () {
  return browserify('./src/apflora.js')
    .bundle()
    // Pass desired output filename to vinyl-source-stream
    .pipe(source('apflora_browserified.js'))
    // Start piping stream to tasks!
    .pipe(gulp.dest('./src'))
})
