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
const jsonFiles = 'src/**/*.json';
const buildFiles = 'build/**/*.*';
const yamlFiles = 'src/config/**/*.yaml';
const featureFiles = 'test/acceptance/**/*.feature';
const featureSupportFiles = 'test/acceptance/features/**/*.js';
const featureReportHelpers = 'test/helpers/reporting/**/*.js';

gulp.task('copyfeaturereporthelpers', () => {
  gulp.src([featureReportHelpers])
    .pipe(plumber(function (error) {
      console.log('Error transpiling', error.message);
      this.emit('end');
    }))
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['latest-minimal'],
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/test/helpers/reporting'));
});

gulp.task('copyfeaturesupportfiles', ['copyfeaturereporthelpers'], () => {
  gulp.src([featureSupportFiles])
    .pipe(plumber(function (error) {
      console.log('Error transpiling', error.message);
      this.emit('end');
    }))
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['latest-minimal'],
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/test/acceptance/features'));
});

gulp.task('copyfeatures', ['copyfeaturesupportfiles'], () => {
  gulp.src([featureFiles])
    .pipe(gulp.dest('build/test/acceptance'));
});

gulp.task('copyconfig', ['copyfeatures'], () => {
  gulp.src([yamlFiles])
    .pipe(gulp.dest('build/src/config'));
});

gulp.task('copymisc', ['copyconfig'], () => {
  gulp.src([jsonFiles])
    .pipe(gulp.dest('build/src/'));
});

gulp.task('transpileSource', ['copymisc'], () => {
  gulp.src([srcFiles])
    .pipe(plumber(function (error) {
      console.log('Error transpiling', error.message);
      this.emit('end');
    }))
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['latest-minimal'],
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./build/src/'));
});

gulp.task('runtests', ['transpileSource'], () => {
  return gulp.src([testFiles])
    .pipe(babel({presets: ['latest-minimal']}))
    .pipe(gulp.dest('./build/test/'))
    .pipe(mocha());
});

gulp.task('watchSource', ['transpileSource'], () => {
  gulp.watch([srcFiles,jsonFiles,yamlFiles], ['transpileSource']);
});

gulp.task('cleanbuildfiles', () => {
  gulp.src(buildFiles, { read: false })
    .pipe(clean());
});


