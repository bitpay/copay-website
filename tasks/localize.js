'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('extract-locales', function() {
  return gulp.src('html/**/*.html')
    .pipe($.l10n.extract())
    .pipe(gulp.dest('locales'));
});

gulp.task('load-locales', ['extract-locales'], function() {
  return gulp.src('locales/*.json')
    .pipe($.l10n.setLocales({
      native: 'en',
      enforce: 'warn'
    }));
});

gulp.task('localize', ['load-locales'], function() {
  return gulp.src('html/**/*.html')
    .pipe($.l10n({
      hrefRewrite: function(href, locale) {
        if (href.indexOf(':') === -1 && href.charAt(0) === '/') {
          return '/' + locale + href;
        } else {
          return href;
        }
      }
    }))
    .pipe(gulp.dest('dist'));
});
