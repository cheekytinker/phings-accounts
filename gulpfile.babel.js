'use strict';

require('babel-core/register');
import fs from 'fs';
import promisify from 'es6-promisify';
import reporter from 'cucumber-html-reporter';
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

const srcFiles = 'src/**/*.js';
const jsonFiles = 'src/**/*.json';
const buildFiles = 'build/**/*.*';
const yamlFiles = 'src/config/**/*.yaml';
const stat = promisify(fs.stat);

gulp.task('copyconfig', () => {
  gulp.src([yamlFiles], { base: 'src' })
    .pipe(gulp.dest('build'));
});

gulp.task('copymisc', ['copyconfig'], () => {
  gulp.src([jsonFiles], { base: 'src' })
    .pipe(gulp.dest('build'));
});

gulp.task('transpileSource', ['copymisc'], () => {
  gulp.src([srcFiles], { base: 'src' })
    .pipe(plumber(function (error) {
      console.log('Error transpiling', error.message);
      this.emit('end');
    }))
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['latest-minimal'],
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build'));
});

gulp.task('cleanbuildfiles', () => {
  gulp.src(buildFiles, { read: false })
    .pipe(clean());
});

gulp.task('cucumberreport', async () => {
  const reportJsonPath = './testoutput/cucumber_report.json';
  if (!await stat(reportJsonPath)) {
    return;
  }
  const options = {
    theme: 'bootstrap',
    jsonFile: reportJsonPath,
    output: './testoutput/cucumber_report.html',
    reportSuiteAsScenarios: true,
    launchReport: false,
    metadata: {
      'App Version': '0.3.2',
      'Test Environment': 'STAGING',
      Browser: 'Chrome  54.0.2840.98',
      Platform: 'Windows 10',
      Parallel: 'Scenarios',
      Executed: 'Remote',
    },
  };
  reporter.generate(options);
});



