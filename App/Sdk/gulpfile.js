'use strict'

var gulp = require('gulp')
var webpack = require('webpack-stream')
var mocha = require('gulp-mocha')   // for unit testing
var babel = require('gulp-babel')   // for translate ES6 to ES5
// var browserify = require('browserify');
// var source = require('vinyl-source-stream');
// var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify')
var rename = require('gulp-rename')
var sourcemaps = require('gulp-sourcemaps')
var gutil = require('gulp-util')

// websdk.js
// websdk.min.js
// websdk.min.js.map
gulp.task('sdk', ['sdk:umd', 'sdk:umd:min'])

// websdk.js
gulp.task('sdk:umd', function () {
  return gulp.src('./index.js')
        .pipe(webpack({
          output: {
            filename: 'websdk.browser.js',
            library: 'WebIM',
            libraryTarget: 'umd'
          }
        })
        )
        .pipe(gulp.dest('dist/'))
})

// websdk.min.js
// websdk.min.js.map
gulp.task('sdk:umd:min', ['sdk:umd'], function () {
  return gulp.src('./dist/websdk.browser.js')
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(rename('websdk.browser.min.js'))
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/'))
})

gulp.task('default', ['sdk'])

//
// gulp.task('watch', function() {
//     livereload.listen();
//     gulp.watch('less/*.less', ['less']);
// });
