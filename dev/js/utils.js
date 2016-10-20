export function size( obj ) {
	if(!is('object', obj)) return obj
	return Object.keys(obj).length
}

export function is( type, obj ) {
	if(type.toLowerCase() === 'string') {
		return Object.prototype.toString.call(obj) === '[object String]'

	} else if(type.toLowerCase() === 'object') {
		return obj.toString() === "[object Object]"

	} else if(type.toLowerCase() === 'array') {
		return Object.prototype.toString.call(obj) === '[object Array]'

	} else if(type.toLowerCase() === 'undefined') {
		return typeof obj === 'undefined'

	} else if(type.toLowerCase() === 'empty') {
		return size(obj) === 0
	}
}

export function isString( obj ) { return is('string', obj) }
export function isObject( obj ) { return is('object', obj) }
export function isArray( obj ) { return is('array', obj) }
export function isUndefined( obj ) { return is('undefined', obj) }
export function isEmpty( obj ) { return is('empty', obj) }
export function isNumeric( obj ) { return !isArray( obj ) && (obj - parseFloat( obj ) + 1) >= 0; }

export function isCollection( obj ) { return isArray(obj) && obj.length > 0 && obj.every(v => isObject(v)) }

export function each( collection, iterator ) {
	if(isArray(collection)) {
		for(let key = 0; key < collection.length; key++) {
			iterator(collection[key], key, collection)
		}
	} else {
		for(let objKey in collection) {
			iterator(collection[objKey], objKey, collection)
		}
	}
}
/**
 * Merge multipe objects
 * @param  {Object} target
 * @param  {Object} source
 * @return {Object}
 *
 * From http://stackoverflow.com/questions/27936772/deep-object-merging-in-es6-es7
 */
export function merge( target, source ) {

	if (!isObject(source)) {
		return source;
	}

	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (isObject(source[key])) {
				if (!target[key]) Object.assign(target, { [key]: {} });
				merge(target[key], source[key]);
			} else {
				Object.assign(target, { [key]: source[key] });
			}
		}
	}

	return target;
}

/*export function contains( obj, value ) {
	let result = false
	value = isArray(value) ? value : [value]

	return value.some(val => {
		return JSON.stringify(obj).indexOf(JSON.stringify(val)) !== -1
	})
}*/

export function isExpired( timestamp, expiration ) {
	const now = new Date().getTime()
	return (now - timestamp) > expiration
}

export function contains( obj, value ) {
	return !!(~(JSON.stringify(obj)).indexOf(JSON.stringify(value)))
}

export function flatten( array ) {
	return [].concat.apply([], array)
}

export function compact( array ) {
	if(!isArray(array)) return array
	return array.filter(value => {
		if(value === undefined) return false
		if(isObject(value) && isEmpty(value)) return false

		return true
	})
}

export function uniq( array ) {
	if(!isArray(array)) return array
	let temp = []
	return array.filter(value => {
		const test = temp.toString().indexOf(value) === -1
		temp.push(value)
		return test
	})
}

export function keys( obj ) {
	if(!is('object', obj)) return obj
	return Object.keys(obj)
}

export function values( obj ) {
	if(!is('object', obj)) return obj
	return keys(obj).map(key => obj[key])
}
