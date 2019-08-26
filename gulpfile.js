var gulp = require('gulp');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
const terser = require('gulp-terser');
const imagemin = require('gulp-imagemin');
var jp2 = require('gulp-jpeg-2000');
var replace = require('gulp-replace');
var webp = require('gulp-webp');
var hash = require('gulp-hash');
var references = require('gulp-hash-references');

var del = require('del');
const htmlmin = require('gulp-htmlmin');

gulp.task('styles', function() {
    return gulp.src([
            'public/css/bulma/bulma.min.css',
            'public/css/bulma/bulma.timeline.min.css',
            'public/css/style.css'
        ])
        .pipe(concat("css/build.css"))
        .pipe(hash())
        .pipe(cleanCSS())
        .pipe(gulp.dest('public/dist/'))
        .pipe(hash.manifest('asset-manifest.json'))
        .pipe(gulp.dest('.'));

});

gulp.task('scripts', function() {
    return gulp.src([
            'public/js/jquery-3.4.1.min.js',
            'public/js/jquery.lazy.min.js',
            'public/js/jquery.scrollify.js',
            'public/js/scripts.js',
            'public/js/github.js'
        ])
        .pipe(concat("js/build.js"))
        .pipe(terser())
        .pipe(hash())
        .pipe(gulp.dest('public/dist/'))
        .pipe(hash.manifest('asset-manifest.json'))
        .pipe(gulp.dest('.'));
});

gulp.task('minify-html', () => {
    return gulp.src('public/**/*.html')
        .pipe(replace('jpg', 'webp'))
        .pipe(references('asset-manifest.json'))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('public'));
});

gulp.task('webp', function() {
    return gulp.src('public/img/*')
        .pipe(webp())
        .pipe(gulp.dest('public/img/'))
});


gulp.task('images', function() {
    return gulp.src('public/img/*')
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 9 }),
            imagemin.svgo({
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ]
            })
        ]))
        .pipe(gulp.dest('public/img/'))
});

gulp.task('clean', () => del(['public/dist/']));

gulp.task('default', gulp.series('styles', 'scripts', 'images', 'webp', 'minify-html'));