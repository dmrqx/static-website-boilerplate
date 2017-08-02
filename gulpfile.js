var gulp       = require('gulp'),
    concat     = require('gulp-concat'),
    uglify     = require('gulp-uglify'),
    rename     = require('gulp-rename'),
    pug        = require('gulp-pug'),
    stylus     = require('gulp-stylus'),
    nib        = require('nib'),
    sourcemaps = require('gulp-sourcemaps'),
    del        = require('del');

var paths = {
    html: {
        src: 'src/html/*.pug',
        watch: 'src/html/**/*.pug',
        dest: 'dist/'
    },
    styles: {
        src: 'src/styles/*.styl',
        watch: 'src/styles/**/*.styl',
        dest: 'dist/css/'
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'dist/js/'
    },
    assets: {
        src: 'src/assets/',
        watch: 'src/assets/**',
        dest: 'dist/assets/'
    },
    images: {
        src: 'src/assets/img/*.{jpg, jpeg, png}',
        dest: 'dist/assets/img/'
    }
};


function clean() {
    return del([ 'dist' ]);
}

function html() {
    return gulp.src(paths.html.src)
        .pipe(pug())
        .pipe(gulp.dest(paths.html.dest));
}

function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(stylus({ use: nib(), compress: true }))
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.styles.dest));
}

function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.scripts.dest));
}

function assets() {
    return gulp.src(paths.assets.src + '/**', { base: paths.assets.src })
        .pipe(gulp.dest(paths.assets.dest));
}

function watchFiles() {
    gulp.watch(paths.html.watch, html);
    gulp.watch(paths.styles.watch, styles);
    gulp.watch(paths.scripts.watch, scripts);
    gulp.watch(paths.assets.watch + '/**', assets);
}


exports.clean   = clean;
exports.html    = html;
exports.styles  = styles;
exports.scripts = scripts;
exports.assets  = assets;
exports.watchFiles = watchFiles;


var build = gulp.series(clean, gulp.parallel(html, styles, scripts, assets));


gulp.task('serve', watchFiles);
gulp.task('build', build);
gulp.task('default', build);
