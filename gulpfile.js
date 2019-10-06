'use strict';
const gulp          = require('gulp');
const sass          = require('gulp-sass');
const browserSync   = require('browser-sync').create();

sass.compiler = require('node-sass');

gulp.task('sass', () => gulp.src('./sass/**/*.scss')
                            .pipe(sass().on('error', sass.logError))
                            .pipe(gulp.dest('./css'))
                            .pipe(browserSync.stream())
);

gulp.task('serve', gulp.series('sass', () => {
    browserSync.init({
        server: './',
        port: 3000
    });

    gulp.watch('./sass/**/*.scss', gulp.series('sass')).on('change', browserSync.reload);
    gulp.watch('./*.html').on('change', browserSync.reload);
}));
