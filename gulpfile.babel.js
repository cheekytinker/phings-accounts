'use strict';

require('babel-core/register');
var gulp = require('gulp');
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var mocha = require('gulp-mocha');
var clean = require('gulp-clean');
var istanbul = require('gulp-istanbul');
var runSequence = require('run-sequence');

var testFiles = 'test/**/*.js';
var srcFiles = 'src/**/*.js';

gulp.task('transpileSource', () => {
  gulp.src(srcFiles)
    .pipe(plumber(function (error) {
      console.log('Error transpiling', error.message)
      this.emit('end');
    }))
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015'],
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./build/lib/'));
});

gulp.task('runtests', ['transpileSource'], () => {
  return gulp.src([testFiles])
    .pipe(babel({presets: ['es2015']}))
    .pipe(gulp.dest('./build/tests/'))
    .pipe(mocha());
});

