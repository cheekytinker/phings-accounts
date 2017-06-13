'use strict';

require('babel-core/register');
const gulp = require('gulp');
const watch = require('gulp-watch');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const mocha = require('gulp-mocha');
const clean = require('gulp-clean');
const istanbul = require('gulp-istanbul');
const isparta = require('isparta');

const testFiles = 'test/**/*.js';
const srcFiles = 'src/**/*.js';

gulp.task('copyyaml', () => {
  gulp.src('src/config/**/*.yaml')
    .pipe(gulp.dest('build/src/config/'));
});

gulp.task('transpileSource', ['copyyaml'], () => {
  gulp.src(srcFiles)
    .pipe(plumber(function (error) {
      console.log('Error transpiling', error.message);
      this.emit('end');
    }))
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015'],
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./build/src/'));
});

gulp.task('runtests', ['transpileSource'], () => {
  return gulp.src([testFiles])
    .pipe(babel({presets: ['es2015']}))
    .pipe(gulp.dest('./build/test/'))
    .pipe(mocha());
});


gulp.task('watch', ['transpileSource'], () => {
  return watch(srcFiles);
});


