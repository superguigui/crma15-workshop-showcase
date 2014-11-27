var gulp = require('gulp'),
    uglify = require('gulp-uglify')

gulp.task('compress', function() {
  gulp.src('build/build.js')
    .pipe(uglify())
    .pipe(gulp.dest('./build/'))
});
