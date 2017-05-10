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
const babelistanbul = require('gulp-babel-istanbul');
const injectModules = require('gulp-inject-modules');
const isparta = require('isparta');

const testFiles = 'test/**/*.js';
const srcFiles = 'src/**/*.js';

gulp.task('transpileSource', () => {
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

gulp.task('coverage', function (cb) {
  gulp.src('src/**/*.js')
    .pipe(babelistanbul({presets: ['es2015']}))
    .pipe(gulp.dest('./build/src/'))

    //.pipe(babelistanbul.hookRequire())
    .on('finish', function () {
      gulp.src('test/**/*.js')
        .pipe(injectModules())
        .pipe(babelistanbul({presets: ['es2015']}))
        .pipe(gulp.dest('./build/test/'))
        .pipe(mocha())
        .pipe(babelistanbul({
          instrumenter: isparta.Instrumenter,
        }))
        .pipe(babelistanbul.writeReports())
        .pipe(babelistanbul.enforceThresholds({ thresholds: { global: 90 } }))
        .on('end', cb);
    });
});

