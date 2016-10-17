import gulp from 'gulp'
import gulpSequence from 'gulp-sequence'
import colors from 'colors'
import del from 'del'
import config from '../config'

gulp.task('env:dev', () => process.env.NODE_ENV = 'development')
gulp.task('env:dist', () => process.env.NODE_ENV = 'distribution')

gulp.task('dev', cb => {
	gulpSequence(
		'env:dev',
		'clean',
		'webpack',
	cb)
})

gulp.task('dist', cb => {
	gulpSequence(
		'clean',
		'env:dev',
		'webpack',
		'env:dist',
		'webpack:dist',
	cb)
})
