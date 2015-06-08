'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('extract-locales', function () {
  return gulp.src('dist/**/*.html')
    .pipe($.s18n.extract())
    .pipe(gulp.dest('locales'));
});

gulp.task('load-locales', ['extract-locales'], function () {
  return gulp.src('locales/*.json')
    .pipe($.s18n.setLocales({
      native: 'en',
      enforce: 'warn'
    }));
});

gulp.task('localize', ['load-locales'], function () {
  return gulp.src('dist/**/*.html')
    .pipe($.s18n())
    .pipe(gulp.dest('dist'));
});
