"use strict";
const gulp = require("gulp");
const sass = require("gulp-sass");

const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename");
const browserSync = require("browser-sync").create();

sass.compiler = require("node-sass");

const CSSDestFolder = "./css";
const SASSFilesPath = ["./sass/**/*.scss", "./sass/**/*.sass"];

const sassBuild = () => {
    return gulp
        .src(SASSFilesPath)
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest(CSSDestFolder));
};

const cssBuild = () => {
    return sassBuild()
        .pipe(gulp.src([CSSDestFolder + "/**/*.css", "!" + CSSDestFolder + "/**/*.min.css"]))
        .pipe(sourcemaps.init())
        .pipe(cleanCSS({ compatibility: "ie8" }))
        .pipe(autoprefixer("last 2 version", "safari 5", "ie 8", "ie 9"))
        .pipe(
            rename(path => {
                path.basename += ".min";
            })
        )
        .pipe(
            sourcemaps.write("./", {
                mapFile: mapFilePath => {
                    return mapFilePath.replace(".map");
                }
            })
        )
        .pipe(gulp.dest(CSSDestFolder));
};

const liveReload = () => {
    browserSync.init({
        server: "./"
    });

    gulp.watch(SASSFilesPath, sassBuild).on("change", browserSync.reload);
    gulp.watch("./*.html").on("change", browserSync.reload);
};

gulp.task("reload", liveReload);

gulp.task("dev", () => {
    gulp.watch(SASSFilesPath, sassBuild);
});

gulp.task("build", cssBuild);
