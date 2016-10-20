import gulp from 'gulp'
import config from '../config/copy'
import changed from 'gulp-changed'
import browserSync from 'browser-sync'

gulp.task('copy', () => {

	return gulp.src(config.files.dev, {
			base: config.dev
		})
		.pipe(changed(config.paths.dist))
		.pipe(gulp.dest(config.paths.dist))
		.pipe(browserSync.reload({stream:true}))
})
