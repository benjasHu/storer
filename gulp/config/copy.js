import config from './'
import _ from 'lodash'

const paths = {
	dev: config.dev,
	dist: config.dist
};

const files = {
	dev: [`${config.dev}/**/*.*`, `${config.dev}/.htaccess`]
};

/**
 * Exclude files/folders from gulp-options.js
 */
if(config.options.excludeCopy.length) {
	config.options.excludeCopy.forEach(value => {
		files.dev.push(`!${paths.dev}/${value}`);
	})
}

export default { paths, files }
