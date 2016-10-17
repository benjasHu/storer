import config from '../config/'

export default {

	getFileInDist( path ) {
		var path = path.split('\\').join('/'),
			deletedFile = path.split(config.options.development)[1],
			pathDist = config.options.distribution + deletedFile;

		if(pathDist) {
			return pathDist;
		} else {
			throw new Error('File doesn\'t exists');
		}
	}
}
