// "use strict"; 

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const removeComments = require('gulp-strip-css-comments');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const rigger = require('gulp-rigger');
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber');

const imagemin = require('gulp-imagemin');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');


const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');


var dest = './dest';
var src = './src';

/* ---      Server-------- */

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            
            baseDir: dest
        },
        port: 9000
    });


    gulp.watch(dest+'/**/*').on('change', browserSync.reload);
});



/*--------- Pug compile----------- */

gulp.task('templates:compile', function buildHTML() {
    return gulp.src(src+'/templates/index.pug')
        .pipe(pug({
            // Your options in here.
            pretty: true
        }))
        .pipe(gulp.dest(dest));
});




/* ---------------Style compile ---------*/

gulp.task('styles:compile', function () {
    return gulp.src(src+'/templates/main.scss')
        .pipe(sourcemaps.init())
        // .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
        .pipe(sass({
            errorLogToConsole: true,
            outputStyle: 'expanded'
        })
        .on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ["last 8 versions"],
            cascade: true
        }))
        .pipe(removeComments())
        .pipe(rename('main.min.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(dest+'/css'));
});



/* -------------JS--------------- */

gulp.task('js:compile', function () {
    return gulp.src(src+'/js/*.js')
        .pipe(plumber())
        .pipe(rigger())
        .pipe(gulp.dest(dest+'/js'))
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min",
            extname: ".js"
        }))
        .pipe(gulp.dest(dest+'/js/'));
       // .pipe( .stream());
});



/* ---------- Sprite---------- */

gulp.task('sprite', function (cb) {
    const spriteData = gulp.src(src+'/images/icons/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        imgPath: '../images/sprite.png',
        cssName: 'sprite.scss'
    }));

    spriteData.img.pipe(gulp.dest(dest+'/images/'));
    spriteData.css.pipe(gulp.dest(src+'/styles/global/'));
    cb();
});



/* ----------------Copy images----------------- */

gulp.task('copy:images', function () {
    return gulp.src(src+'/images/**/*.*')
        /* .pipe(debug({
            title: 'building img:',
            showFiles: true
        })) */
        .pipe(plumber())
        .pipe(gulp.dest(dest+'/images')) 
        .pipe(imagemin([
            imageminGifsicle({
                interlaced: true
            }),
            imageminJpegRecompress({
                progressive: true,
                max: 80,
                min: 70
            }),
            imageminPngquant({
                quality: [0.3, 0.8]
            }),
            imageminSvgo({
                plugins: [{
                    removeViewBox: true
                }]
            })
        ]))
        .pipe(gulp.dest(dest+'/images'));
});


/* ----------------Copy fonts----------------- */

gulp.task('copy:fonts', function () {
    return gulp.src(src + '/fonts/**/*.*')
        .pipe(gulp.dest(dest + '/fonts'));
});



/* ------------Copy-------------- */

gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));




/* -------------Delete------------- */

gulp.task('clean', function del(cb) {
    return rimraf(dest, cb);
});




/* ---------Watchers------------ */

gulp.task('watch', function () {
    gulp.watch(src+'/templates/**/*.pug', gulp.series('templates:compile'));
    gulp.watch(src+'/styles/**/*.scss', gulp.series('styles:compile'));
    gulp.watch(src+'/js/*.js', gulp.series('js:compile'));
    gulp.watch(src+'/images/**/*.*', gulp.series('copy:images'));
});




/* -------Default-------- */

gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('templates:compile', 'styles:compile', 'js:compile', 'sprite', 'copy'),
    gulp.parallel('watch', 'browser-sync')
));
