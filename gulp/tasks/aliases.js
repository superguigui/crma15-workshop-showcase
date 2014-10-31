var gulp = require('gulp'),
browserSync = require('browser-sync'),
reload = browserSync.reload;

gulp.task('default', ['clean', 'styles', 'watch']);
// gulp.task('dist', ...

// Watch Files For Changes & Reload
gulp.task('serve', ['clean', 'styles', 'watch'], function () {
    browserSync.init(null, {
        watchTask: true,
        proxy: "crma2015-workshop.dev", //REMPLACE WITH YOUR VHOST
        notify: false
    });


    gulp.watch(['./build/**/*.*'], reload);



});