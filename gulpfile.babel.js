import gulp from 'gulp';
import sass from 'gulp-sass';
import concat from 'gulp-concat';
import browserify from 'browserify';
import babelify from 'babelify';
import browserSync from 'browser-sync';
import source from 'vinyl-source-stream';
import rename from 'gulp-rename';


let reload = browserSync.reload;
var config = {
  stylesWatch: './src/scss/**/*.scss',
  stylesEntry: './src/scss/landio.scss',
  jsWatch: './src/**/*.js',
  jsEntry: './src/js/landio.js'
};

/**
 * Html
 */
gulp.task('html', () => {
  gulp.src('./src/index.html')
    .pipe(gulp.dest('./dist'));
});

/**
 * Html
 */
gulp.task('assets', () => {
  gulp.src([
      './src/assets/**'
    ])
    .pipe(gulp.dest('./dist'));
});

/**
 * Styles
 */
gulp.task('styles', ['assets'], () => {
  return gulp.src(config.stylesEntry)
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(rename('landio.min.css'))
    .pipe(gulp.dest('./dist/css'));
});

/**
 * Build
 */
gulp.task('build', ['html', 'styles'], () => {
  gulp.src('./src/sass/landio.scss')
    .pipe(sass())
    .pipe(gulp.dest('./dist/css'))
    .pipe(reload({stream: true}));
  
  browserify('./src/js/landio.js')
    .bundle()
    .on('error', (err) => {
      console.log(err);
    })
    .pipe(source('landio.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(reload({stream: true}));
});

/**
 * Watch
 */
gulp.task('watch', ['build'], () => {
  browserSync({
    server: './dist'
  });
  
  gulp.watch([config.stylesWatch, config.jsWatch], ['build']);
  gulp.watch(['./src/*.html']).on('change', reload);
});