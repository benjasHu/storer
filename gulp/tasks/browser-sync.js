import gulp from 'gulp'
import config from '../config'
import configBS from '../config/browser-sync'
import opn from 'opn'
import gutils from 'gulp-util'
import browserSync from 'browser-sync'

gulp.task('server', cb => {
	browserSync(configBS, cb);

	browserSync.emitter.on("service:running", data => {
		
		if(config.options.tunnel === true) {
			var shareURL = `${data.options.urls.tunnel}/${config.options.base}/${config.options.distribution}`
			gutil.log(`tunnel ---> ${gutil.colors.bgMagenta(shareURL)}`)
			opn(shareURL)
		}
	})
})
