'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var path = require('path');
var runSequence = require('run-sequence');
var env = {};
var devDeps = {};

gulp.task('default', ['delete'], function(cb) {
  runSequence(
    ['sass', 'jade', 'images', 'copy'],
    ['styles', 'jademin'],
    'hash',
    'localize',
    cb);
});

// delete dist
gulp.task('delete', del.bind(null, ['dist']));

// Compile & autoprefix styles
gulp.task('sass', function() {
  var AUTOPREFIXER_BROWSERS = [
    'ie >= 8',
    'ff >= 30',
    'chrome >= 31',
    'safari >= 5.1',
    'opera >= 23',
    'ios >= 7',
    'android >= 4',
    '> 0.25%' //of global market share
  ];

  // For best performance, don't add partials to `gulp.src`
  return gulp.src([
      'src/styles/**/*.scss'
    ])
    .pipe($.if(env.development, $.sourcemaps.init()))
    .pipe($.sass({
      outputStyle: 'expanded',
      precision: 10,
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe($.if(env.development, $.sourcemaps.write()))
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('jade', function(cb) {
  if(env.development){
    runSequence('jade:dev', cb);
  } else {
    runSequence('jade:prod', cb);
  }
});

gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe($.cached('images'))
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size({
      title: 'images'
    }));
});

// Copy files at root level of 'src' to dist
gulp.task('copy', function() {
  return gulp.src(['src/*', '!src/_*', '!src/*.jade'], {
      dot: true
    })
    .pipe($.cached('copy'))
    .pipe(gulp.dest('dist'));
});

gulp.task('styles', function() {
  return gulp.src(['dist/**/*.css'])
    .pipe($.csso())
    .pipe(gulp.dest('dist'));
});

//add hashes to filenames to bust caches, write rev-manifest.json
gulp.task('hash', function() {
  $.revAllInstance = new $.revAll({
    dontRenameFile: [/^\/favicon.ico$/g, '.html'],
    fileNameVersion: 'version.json'
  });
  return gulp.src(['dist/**/*.html', 'dist/**/*.css', 'dist/**/*.js', 'dist/images/**/*'], {
      base: path.join(process.cwd(), 'dist')
    })
    .pipe($.revAllInstance.revision())
    .pipe(gulp.dest('dist'))
    .pipe($.revAllInstance.versionFile())
    .pipe(gulp.dest('dist'));
});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], function() {
  loadBrowserSync();
  devDeps.browserSync({
    notify: false,
    logPrefix: 'serve:dist',
    https: true,
    server: {
      baseDir: 'dist',
      serveStaticOptions: {
        extensions: 'html'
      }
    }
  });
});

// Watch for changes & reload
gulp.task('serve', ['build:dev'], function() {
  devDeps.browserSync({
    notify: false,
    logPrefix: 'serve',
    minify: false,
    snippetOptions: {
      rule: {
        fn: function(snippet, match) {
          snippet = snippet.replace('async', 'async data-no-instant');
          return snippet + match;
        }
      }
    },
    server: {
      //serve from dist, fall back to sources (for sourcemaps)
      baseDir: ['dist', 'components', 'src', '.'],
      serveStaticOptions: {
        extensions: 'html'
      }
    }
  });

  gulp.watch(['src/_**/*.jade'], ['uncached-rebuild-jade', devDeps.reload]);
  gulp.watch(['src/**/*.jade', '!src/_**/*.jade', 'src/**/*.html'], ['rebuild-jade', devDeps.reload]);
  gulp.watch(['src/{_styles,styles}/**/*.{scss,css}'], ['rebuild-styles', devDeps.reload]);
  gulp.watch(['*.js', 'tasks/*.js', 'src/**/*.js'], ['jshint']);
  gulp.watch(['src/**/*.js'], ['rebuild-jade', devDeps.reload]);
  gulp.watch(['src/images/**/*'], ['images', devDeps.reload]);
});

function loadBrowserSync(){
  devDeps.browserSync = require('browser-sync');
  devDeps.reload = devDeps.browserSync.reload;
}

gulp.task('build:dev', function(cb) {
  env.development = true;
  loadBrowserSync();
  runSequence('default', cb);
});

gulp.task('jshint', function() {
  return gulp.src(['*.js', 'tasks/*.js', 'src/**/*.js'])
    .pipe($.cached('jshint'))
    .pipe(devDeps.reload({
      stream: true,
      once: true
    }))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!(devDeps.browserSync && devDeps.browserSync.active), $.jshint.reporter('fail')));
});

gulp.task('rebuild-jade', function(cb) {
  runSequence(['sass', 'jade:dev'], ['jademin', 'styles', 'localize'], cb);
});

gulp.task('rebuild-styles', function(cb) {
  runSequence('sass', 'styles', cb);
});


// Load custom tasks from the `tasks` directory
var tasks;
try {
  tasks = require('require-dir')('tasks');
} catch (err) {
  console.error(err);
}
