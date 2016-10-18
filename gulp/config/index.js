import path from 'path'
import pack from '../../package.json'
import options from '../../gulp-options.js'

function getHtdocsIndexOf( pathArray, regex ) {
	let num = -1
	pathArray.forEach((path, i) => {
		if(new RegExp(regex).test(path))
			num = i
	})

	return num
}

function getBasePath() {
	let pathArray = options.root.split(path.sep)
	let pathLength = pathArray.length
	let indexOf = getHtdocsIndexOf(pathArray, options.hostBases.join('|'))

	while(pathLength--) {
		if(pathLength <= indexOf)
			pathArray.splice(pathLength, 1)
	}

	return pathArray.join('/')
}

export default {
	pack   : pack,
	name   : pack.name,
	title  : pack.title,
	root   : options.root,
	gulp   : {
		index  : path.join(options.root, 'gulp'),
		config : path.join(options.root, 'gulp/config'),
		lib    : path.join(options.root, 'gulp/lib'),
		tasks  : path.join(options.root, 'gulp/tasks')
	},
	node   : path.join(options.root, 'node_modules'),
	bower  : path.join(options.root, 'bower_components'),
	dev    : options.development,
	dist   : options.distribution,
	options: Object.assign(options, {
		base: getBasePath()
	})
}
