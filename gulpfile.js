let gulp = require("gulp");
let babel = require("gulp-babel")
let concat = require("gulp-concat")
let watch = require('gulp-watch');
// let rename = require("gulp-rename")
let minify = require("gulp-minify")
let cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');

gulp.task('watch', function () {
  return watch("src/js/**/*.js")
    // .pipe(concat('main.js'))
    .pipe(babel({
      presets: ["env"]
    }))
    .pipe(gulp.dest("dist/js"))
})

gulp.task('minify-js', function () {
  return gulp.src("src/js/**/*.js")
    // .pipe(concat('main.js'))
    .pipe(babel({
      presets: ["env"]
    }))
    .pipe(minify())
    .pipe(gulp.dest("dist/js"))
})

gulp.task('minify-css', function () {
  return gulp.src("src/css/*.css")
    .pipe(cleanCSS({debug: true}, (details) => {
      console.log(`${details.name}: ${details.stats.originalSize}`);
      console.log(`${details.name}: ${details.stats.minifiedSize}`);
    }))
    .pipe(gulp.dest("dist/css"))
})

gulp.task('minify-html', () => {
  return gulp.src('src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', [ 'minify-html', 'minify-css', 'minify-js' ]);