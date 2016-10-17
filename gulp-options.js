// ==========================================
// CAMBIAR AQUI LA CONFIGURACIÓN DEL PROYECTO
// ==========================================
export default {
	host         : 'localhost',
	hostBases    : ['www', 'htdocs'], // añadir al array el root que sea
	port         : 3000, // localhost:3000/etc
	root         : __dirname,
	development  : 'dev',
	distribution : 'dist',	
	debug        : true,
	excludeCopy  :  [ // exclude files/folders to copy
		'config/**',
		'js/**'
	]
}