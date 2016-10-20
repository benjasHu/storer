import gulp from 'gulp'
import gutil from 'gulp-util'
import logger from '../lib/compileLogger'
import webpack from 'webpack'
import browserSync from 'browser-sync'

gulp.task('webpack', callback => {

	const config = require('../config/webpack')()

	let built = false;
	webpack(config, (err, stats) => {
		logger(err, stats);
		browserSync.reload();
		// On the initial compile, let gulp know the task is done
		if(!built) { built = true; callback() }
	})

});

gulp.task('webpack:server', ['server', 'webpack']);

gulp.task('webpack:dist', callback => {

	const config = require('../config/webpack')()

	webpack(config, (err, stats) => {
		logger(err, stats);
		callback();
	});
});
