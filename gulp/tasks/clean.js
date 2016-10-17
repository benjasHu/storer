import gulp from 'gulp'
import config from '../config'
import del from 'del'

gulp.task('clean', cb => del([config.dist], cb))
