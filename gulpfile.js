(function (require) {

    'use strict';

    var gulp            = require('gulp'),
        sass            = require('gulp-sass'),
        jade            = require('gulp-jade'),
        mainBowerFiles  = require('main-bower-files'),
        fs              = require('fs'),
        browserSync     = require('browser-sync'),
        uglify          = require('gulp-uglify'),
        sourcemaps      = require('gulp-sourcemaps'),
        cleanCss        = require('gulp-clean-css');

    var config = require('./config.json');

    var $ = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'del']
    });

    var tmpDir  = '.tmp/',
        distDir = 'dist/',
        srcDir  = 'app/';

    var sassDir     = 'styles/',
        cssDir      = 'css/',
        imagesDir   = 'images/',
        viewsDir    = 'views/',
        modulesDir  = 'modules/',
        vendorDir   = 'vendor/',
        scriptsDir  = 'scripts/',
        dataDir     = 'data/';

    var mainScript  = 'main.js';

    var filter = {
        "none"      : "*",
        "dir"       : "**/",
        "all"       : "**/*",
        "html"      : "*.html",
        "css"       : "*.css",
        "js"        : "*.js",
        "jade"      : "*.jade",
        "yml"       : "*.yml",
        "sass"      : "*.scss",
        "images"    : "*.{png|jpg|jpeg|gif}"
    };

    var isDev = true;

    gulp.task('jade', ['data'], function () {

        gulp.src(srcDir + scriptsDir + modulesDir + filter.dir + filter.jade)
            .pipe($.debug())
            .pipe(jade({pretty: true}))
            .pipe(gulp.dest(distDir + scriptsDir + modulesDir));

        return gulp.src(srcDir + viewsDir + filter.jade)
            .pipe(jade({pretty: true}))
            .pipe(gulp.dest(distDir));

    });

    gulp.task('data', function () {

        return gulp.src(srcDir + dataDir + filter.dir + filter.yml)
            .pipe($.yaml())
            .pipe(gulp.dest(distDir + dataDir));
    });

    gulp.task('sass', function () {

        return gulp.src(srcDir + sassDir + filter.dir + filter.sass)
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest(distDir + cssDir));
    });

    gulp.task('clean-css', ['sass'], function() {

        if (isDev) {
            return gulp.src(distDir + cssDir + filter.dir + filter.css)
                .pipe(gulp.dest(distDir + cssDir));
        }

        return gulp.src(distDir + cssDir + filter.dir + filter.css)
            .pipe(sourcemaps.init())
            .pipe(cleanCss())
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(distDir + cssDir));
    });

    gulp.task('images', function () {

        return gulp.src(srcDir + imagesDir + filter.none)
            .pipe($.debug())
            .pipe(gulp.dest(distDir + imagesDir));
    });

    gulp.task('vendor:scripts', function () {

        gulp.src(srcDir + scriptsDir + filter.dir + filter.js)
            .pipe(gulp.dest(distDir + scriptsDir));

        return gulp
            .src(mainBowerFiles())
            .pipe($.if(! isDev, uglify()))
            .pipe(gulp.dest(distDir + scriptsDir + vendorDir));
    });

    var _createMainScript = function () {

        var config = {
            'baseUrl': '/scripts',
            'paths': {},

            shim: {
            'angular': {
                exports: 'angular'
            }
        }
        };

        var filenameRegExp, file;
        var files = fs.readdirSync(distDir + scriptsDir + vendorDir);

        filenameRegExp = new RegExp('^(.+)\.js$');
        files.forEach(function (path) {
            file = path.match(filenameRegExp);

            if (file) {
                config.paths[file[1]] = "./" + vendorDir + file[1];
            }
        });

        return gulp.src([srcDir + scriptsDir + mainScript], {base: srcDir})
            .pipe($.insert.prepend('requirejs.config(' + JSON.stringify(config, null, 4) + ');' + "\r\n"))
            .pipe(gulp.dest(distDir));
    };

    gulp.task('compile:scripts', ['vendor:scripts'], _createMainScript);

    gulp.task('clean', function () {
        $.del.sync([tmpDir + '*', distDir + '*']);
    });

    gulp.task('server', ['dev'], function () {

        if (typeof config.browserSyncProxy != 'undefined') {
            browserSync.init({
                proxy: config.browserSyncProxy
            });
        } else {
            console.warn("Proxy URL for BrowserSync is not set. Check config.json file");
        }
    });

    gulp.task('dev', ['clean', 'images', 'clean-css', 'jade', 'compile:scripts']);

    gulp.task('update:jade', ['jade']);
    gulp.task('update:sass', ['sass']);
    gulp.task('update:scripts', ['compile:scripts']);

    gulp.task('default', ['server'], function () {

        gulp.watch(srcDir + filter.dir + filter.js, ['update:scripts']);
        gulp.watch(srcDir + filter.dir + filter.jade, ['update:jade']);
        gulp.watch(srcDir + filter.dir + filter.sass, ['update:sass']);
        gulp.watch(srcDir + filter.dir + filter.yml, ['data']);

        gulp.watch('app/styles/**/*.scss', ['sass']);

        /**
         * Watch dist dir
         */
        gulp.watch(distDir + filter.html)
            .on('change', browserSync.reload);

        gulp.watch(distDir + cssDir + filter.css)
            .on('change', browserSync.reload);

        gulp.watch(distDir + scriptsDir + filter.js)
            .on('change', browserSync.reload);

        gulp.watch(distDir + dataDir + "*.json")
            .on('change', browserSync.reload);
    });

}(require));