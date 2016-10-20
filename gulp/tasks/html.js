import gulp from 'gulp'
import config from '../config/html'
import changed from 'gulp-changed'
import preprocess from 'gulp-preprocess'
import rename from 'gulp-rename'

gulp.task('html:index', cb => {
	return gulp.src(config.files.config)
		.pipe(preprocess({
			context: Object.assign(config.preprocess, {
				state: process.env.NODE_ENV || 'development'
			})
		}))
		.pipe(rename('index.php'))
		.pipe(gulp.dest(config.paths.dist));
})
