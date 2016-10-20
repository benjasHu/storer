import config from './'

const {options} = config

export default {
	proxy  : `${options.host}/${options.base}/${options.distribution}`,
	port   : options.port,
	open   : !options.tunnel,
	tunnel : options.tunnel,
	browser: "google chrome",
	notify : true
};
