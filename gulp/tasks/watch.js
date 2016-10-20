import gulp from 'gulp'
import config from '../config/'
import utils from '../lib/utils'
import del from 'del'
import gulpif from 'gulp-if'
import watch from 'gulp-watch'
import copy from '../config/copy'
import browserSync from 'browser-sync'

gulp.task('watch', ['server'], () => {

	const copyWatch = watch(copy.files.dev, { persistent: true });
	copyWatch.on('add', file => gulp.start('copy'))
	copyWatch.on('change', file => gulp.start('copy'))

	// if a file is deleted in dev, delete the same file in dist
	copyWatch.on('unlink', file => {
		del([utils.getFileInDist(file)])
		gulp.start('copy');
	})
})
