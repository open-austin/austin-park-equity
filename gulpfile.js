var gulp = require('gulp');
var gutil = require('gulp-util');
var compass = require('gulp-compass');
var connect = require('gulp-connect');
var deploy = require('gulp-gh-pages');
var fileinclude = require('gulp-file-include');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var jsSources = ['js/app.js'];
var sassSources = ['sass/style.scss'];
var htmlTemplates = ['./html_templates/'];

gulp.task('js', function() {
  gulp.src(jsSources)
      .pipe(connect.reload());
});

gulp.task( 'compass', function(){
	gulp.src( sassSources)
		.pipe( compass({
			sass: 'sass',
			style: 'expanded'
		}))
		.on( 'error', gutil.log )
		.pipe( gulp.dest('css/'))
		.pipe( connect.reload())
});


gulp.task( 'fileinclude', function(){
	gulp.src( htmlTemplates + '*.tpl.html' )
		.pipe( fileinclude())
		.pipe( rename({ extname: "" }))
		.pipe( rename({ extname: ".html"}))
		.pipe( gulp.dest( './' ))
		.pipe( connect.reload() )
		.pipe( notify({ message: 'Includes: included' }));
});

gulp.task('watch', function(){
	gulp.watch( jsSources, ['js'] );
	gulp.watch( 'sass/*.scss', ['compass'] );
	gulp.watch( 'templates/*', ['fileinclude'] );
});

gulp.task('connect', function() {
  connect.server({
    livereload: true,
  });
});

gulp.task('deploy', function() {
  return gulp.src('**/*')
        .pipe(deploy());
});

gulp.task('default', ['fileinclude', 'js', 'compass', 'connect', 'watch']);
