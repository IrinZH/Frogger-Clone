const  gulp = require('gulp');
const prettier = require('gulp-prettier');
const autoprefixer = require('gulp-autoprefixer');

var browserSync = require('browser-sync').create();

function browserPrefixer(){
    return gulp.src('css/**/*.css')
    .pipe(autoprefixer({
        browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.reload({
      stream: true
    }));
}


gulp.task('browserPrefixer', browserPrefixer);

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: './'
    },
    port: 8081,   //browser url port
    ui: {
        port: 8080
    },
  })
})

gulp.task('watch', ['browserPrefixer', 'browserSync'], function (){
  gulp.watch('css/**/*.css', ['browserPrefixer']);
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('*.html', browserSync.reload);
  gulp.watch('js/**/*.js', browserSync.reload);
});

gulp.task('prettier', () => {
  return gulp.src('js/**/*.js')
    .pipe(prettier({ singleQuote: true }))
    .pipe(gulp.dest('./js'));
});