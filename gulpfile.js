var gulp 			= require( 'gulp' ),
		// GULP PLUGINS
		gutil 			= require( 'gulp-util' ),
		compass 		= require( 'gulp-compass' ),
		connect 		= require( 'gulp-connect' ),
		deploy 			= require( 'gulp-gh-pages' ),
		fileinclude	= require( 'gulp-file-include' ),
		rename			= require( 'gulp-rename' ),
		notify			= require( 'gulp-notify' ),

		// SOURCES
		jsSources 	= ['js/app.js'],
		sassSources = ['sass/style.scss'],
		htmlSources = ['*.html'],
		templates		= [ './templates/' ];

gulp.task('js', function(){
	gulp.src(jsSources)
		.pipe(connect.reload())
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

gulp.task( 'html', function(){
	gulp.src( htmlSources )
		.pipe( connect.reload())
});

gulp.task( 'fileinclude', function(){
	gulp.src( templates + '*.tpl.html' )
		.pipe( fileinclude())
		.pipe( rename({ extname: "" }))
		.pipe( rename({ extname: ".html"}))
		.pipe( gulp.dest( './' ))
		.pipe( connect.reload() )
		.pipe( notify({ message: 'Includes: included' }));

} )

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


gulp.task('default', ['fileinclude','html', 'js', 'compass', 'connect', 'watch']);
