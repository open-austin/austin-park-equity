var gulp = require('gulp');
var gprint = require('gulp-print');
var fileinclude = require('gulp-file-include');
var rename = require('gulp-rename');

gulp.task('fileinclude', function() {
    gulp.src('./templates/*.tpl.html')
        .pipe(fileinclude())
        .pipe(rename({extname: ''}))
        .pipe(rename({extname: '.html'}))
        .pipe(gulp.dest('./dist/'))
        .pipe(gprint());
});

gulp.start('fileinclude');
