'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

/**
 * Push build to gh-pages
 */
gulp.task('deploy', ['replace'], function() {
  return gulp.src('./dist/**/*')
    .pipe($.ghPages());
});

gulp.task('replace', ['default'], function() {
  return gulp.src('./dist/**/*.{html,css,js}')
    .pipe($.replace('src="/', 'src="/copay-website/'))
    .pipe($.replace('href="/', 'href="/copay-website/'))
    .pipe($.replace('url(\'/', 'url(\'/copay-website/'))
    .pipe(gulp.dest('dist'));
});
