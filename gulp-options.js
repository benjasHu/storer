export default {
	host         : 'localhost',
	hostBases    : ['www', 'htdocs'],
	port         : 3000,
	root         : __dirname,
	development  : 'dev',
	distribution : 'dist',	
	debug        : true,
	excludeCopy  :  [
		'config/**',
		'js/**'
	]
}