'use strict';

const { watch, src, dest, series, parallel } = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const sass = require('gulp-sass')(require('sass'));
const del = require('del');

function scssCompile () {
  return src('app/scss/main.scss')
        .pipe(sass({ noCache: true, style: 'compressed' }).on('error', sass.logError))
        .pipe(concat('main.css'))
        .pipe(dest('dist/css'))
}

function htmlMoving () {
  return src('app/index.html')
        .pipe(dest('dist'))

}

function jsCompile () {
  return src('app/js/main.js')
        .pipe(concat('main.js'))
        .pipe(dest('dist/js'))
}

function syncBrowsers () {
  browserSync.init({
    server: {
      baseDir: 'dist/'
    },
    notify: false,
    port: 3000,
    open: false
  });
}

function watchFiles () {
  syncBrowsers();

  /* WATCH HTML */
  watch('app/index.html').on('change', htmlMoving);
  watch('dist/index.html').on('change', browserSync.reload);

  /* WATCH STYLES */
  watch('app/scss/**/*.scss').on('change', scssCompile);
  watch('dist/css/main.css').on('change', browserSync.reload);

  /* WATCH JS */
  watch('app/js/main.js').on('change', jsCompile);
}

exports.watch = series(parallel(scssCompile, jsCompile, htmlMoving), watchFiles);
