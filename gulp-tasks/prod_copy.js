'use strict'

var gulp = require('gulp')
var requireDir = require('require-dir')

requireDir('../gulp-tasks', {recurse: true})

gulp.task(
  'prod_copy',
  function () {
    gulp.start([
      'prod_copy_geojson_to_dist',
      'prod_copy_src_to_dist',
      'prod_copy_queries_to_dist',
      'prod_copy_img_to_dist',
      'prod_copy_kml_to_dist',
      'prod_copy_etc_to_dist',
      'prod_copy_root_to_dist'
    ])
  }
)
