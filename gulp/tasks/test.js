import gulp from 'gulp'
import babel from 'gulp-babel'
import mocha from 'gulp-mocha'
import config from '../config/test.js'

gulp.task('babel', () => {
	return gulp.src(config.files.index)
		.pipe(babel())
		.pipe(gulp.dest('target'));
});

gulp.task('test', ['babel'], () => {
	return gulp.src(config.files.test, { read:false })
		.pipe(mocha({
			reporter: 'spec',
			compilers: {
				js: babel
			}
		}))
		.on('error', () => {
			gulp.emit('end');
		});
});

gulp.task('watch:test', () => {
	return gulp.watch([config.files.js, config.files.test], ['test']);
});
