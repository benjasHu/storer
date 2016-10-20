import config from './'

const paths = {
	dev: config.dev,
	dist: config.dist
};

const files = {
	dev: `${paths.dev}/**/*.{html,php}`,
	dist: `${paths.dist}/**/*.{html,php}`,
	config: `${paths.dev}/config/config.html`
};

const preprocess = {
	//state    : process.env.NODE_ENV || 'development',
	name     : config.name,
	title    : config.title,
	baseRoot : config.options.base,
	devPath  : config.options.development,
	distPath : config.options.distribution,
	minFile  : `${config.name}.min`,
	scripts  : config.options.scripts
};

export default { paths, files, preprocess }
