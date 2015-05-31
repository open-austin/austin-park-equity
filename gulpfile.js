var gulp = require('gulp'),
	gutil = require('gulp-util'),
	compass = require('gulp-compass'),
	connect = require('gulp-connect'),
	deploy = require('gulp-gh-pages');

var jsSources = ['js/*.js'];
var sassSources = ['sass/style.scss'];
var htmlSources = ['*.html'];

gulp.task('js', function(){
	gulp.src(jsSources)
		.pipe(connect.reload())
});

gulp.task('compass', function(){
	gulp.src(sassSources)
		.pipe(compass({
			sass: 'sass',
			style: 'expanded'
		}))
		.on('error', gutil.log)
		.pipe(gulp.dest('css/'))
		.pipe(connect.reload())
});

gulp.task('html', function(){
	gulp.src(htmlSources)
		.pipe(connect.reload())
});

gulp.task('watch', function(){
	gulp.watch(jsSources, ['js']);
	gulp.watch('sass/*.scss', ['compass']);
	gulp.watch(htmlSources, ['html']);
});

gulp.task('connect', function(){
	connect.server({
		livereload: true
	});
});

gulp.task('deploy', function () {
    return gulp.src('**/*')
        .pipe(deploy());
});


gulp.task('default', ['html', 'js', 'compass', 'connect', 'watch']);
