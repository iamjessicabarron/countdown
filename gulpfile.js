let gulp = require("gulp");
let babel = require("gulp-babel")
let concat = require("gulp-concat")
let watch = require('gulp-watch');
// let rename = require("gulp-rename")
let minify = require("gulp-minify")

gulp.task('watch', function () {
  return watch("src/js/**/*.js")
    // .pipe(concat('main.js'))
    .pipe(babel({
      presets: ["env"]
    }))
    .pipe(gulp.dest("dist/js"))
})

