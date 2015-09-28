var gulp = require('gulp');
var gprint = require('gulp-print');
var ghPages = require('gulp-gh-pages');

gulp.task('deploy', function() {
    // gulp 3 breaks on symlinks, so we have to avoid them
    // hence the copy:data, copy:img tasks
    return gulp.src(['./dist/**/*'])
        .pipe(ghPages())
        .pipe(gprint());
});

gulp.start('deploy');
