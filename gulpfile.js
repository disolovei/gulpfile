'use strict';
const gulp = require('gulp');
const sass = require('gulp-sass');

const autoprefixer  = require('gulp-autoprefixer');
const cleanCSS      = require('gulp-clean-css');
const sourcemaps    = require('gulp-sourcemaps');
const browserSync   = require('browser-sync').create();

sass.compiler = require('node-sass');

gulp.task('css-build', () => {
    return gulp.src('./css/*.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
        .pipe(gulp.dest('./css'));
    }
);

gulp.task('sass-build', () => {
    return gulp.src('./sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./css'));
});

gulp.task('build', gulp.series('sass-build', 'css-build'));

gulp.task('sass-dev', () => {
    return gulp.src('./sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream());
});

gulp.task('dev', () => {
    browserSync.init({
        server: './',
    });

    gulp.watch('./sass/**/*.scss', gulp.series('sass-dev')).on('change', browserSync.reload);
    gulp.watch('./*.html').on('change', browserSync.reload);
});
