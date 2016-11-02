import config from './'

const files = {
	js: `${config.dev}/js/*.js`,
	index: `${config.dev}/js/index.js`,
	test: `${config.root}/test/*.test.js`
};

export default { files }
