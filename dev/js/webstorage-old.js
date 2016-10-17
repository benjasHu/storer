import * as utils from './utils'
import Storage from './storage'

let storageCache = storageCache || {};

export default class WebStorage {

	constructor( ...args ) {
		this._create(...args);
	}

	_create( ...args ) {

		this.options = {
			namespace: 'storage',
			type: 'local' // local || session
		};

		if(utils.isString(args[0])) {
			this.options.namespace = args[0];
			this.namespace = this.options.namespace;

		} else if(utils.isObject(args[0])) {
			Object.assign(this.options, args[0]);
			this.namespace = this.options.namespace;
			
		} else {
			this.options.namespace = null;
			this.namespace = null;
		}

		this.type = args[1] || this.options.type;
		this.options.type = this.type;

		this.store = new Storage(this.options);

		if(utils.isUndefined(storageCache[this.namespace]))
			storageCache[this.namespace] = {};

		this.cache = this.store.has(this.namespace) ?
			this.store.getContent(this.namespace) :
			storageCache[this.namespace];
	}

	/**
	 * Set new entry into namespaced object
	 * @param {object|string pair} args
	 *
	 * storage.set({ foo:bar })
	 * storage.set('foo', 'bar')
	 */
	set( ...args ) {
		let _value = null

		if(utils.isObject(...args)) {
			_value = args[0]
			Object.assign(this.cache, ...args);

		} else if(args.length) {

			const [ key, value ] = args

			return this._insert(key, value)
		}

		const error = `[WebStorage::set()] There were a problem setting the value: ${JSON.stringify(value)}`

		return this.store.set(this.cache)
			.then(storage => {
				return this._resolve({ value:_value }, null)
			}, err => {
				return this._resolve({ error }, null)
			})
	}

	_insert( path='', value, callback ) {
		let cache = this.cache
		let i = 0
		path = this._splitPath(path)

	    for (i = 0; i < path.length - 1; i++) {
	    	cache = {
	    		...cache,
	    		[path[i]]: cache[path[i]]
	    	} = cache[path[i]]
	    }

    	if(!cache.hasOwnProperty(path[i])) {
			const error = `[WebStorage::insert()] The key path ${path[i]} was not found`
    		return this._resolve({ error }, callback)
    	}

	    cache[path[i]] = value;

		const error = `[WebStorage::insert()] There were a problem inserting ${value}`

		return this.store.set(this.cache)
			.then(storage => {
				return this._resolve({ value }, callback)
			}, err => {
				return this._resolve({ error }, callback)
			})
	}

	/**
	 * Get values only by keys
	 * @param  {string|rest params|array} args could be multiple params ('foo', 'bar', 'xxx')
	 * @return {string|array}
	 */
	get( ...args ) {

		args = utils.flatten(args)

		let result = []
		const collection = this.toCollection()

		if(!args.length) {
			result = collection.reduce((memo, obj) => {
				const key = Object.keys(obj)[0]
				return this.cache[ key ] ? memo.concat(obj[key]) : memo
			}, [])
		} else {
			args.forEach(arg => {
				result = collection.reduce((memo, obj) => {
					const key = Object.keys(obj)[0]
					
					if(utils.contains(key, arg)) {
						return memo.concat(utils.isArray(obj[ key ]) ? [obj[ key ]] : obj[ key ])
					} else {
						return memo
					}
				}, result)
			})
		}

		return this._prepareResult(result)
	}

	find( ...paths ) {
		paths = utils.flatten(paths)
		let result = []
		result = paths.map(path => {
			return this._splitPath(path).reduce(( prev, curr ) => prev ? prev[curr] : undefined, this.cache)
		})

		return this._prepareResult(result)
	}

	/**
	 * Get key/value pair only by keys
	 * @param  {string|rest params|array} args could be multiple params ('foo', 'bar', 'xxx')
	 * @return {string|array}
	 */
	pick( ...args ) {

		args = utils.flatten(args)

		if(!args.length) return this.all()

		let result = {}

		this.loop(args, (arg, obj) => {
			const key = Object.keys(obj)[0]

			if(utils.contains(key, arg)) {
				result = { ...result, [key]:obj[key] }
			}
		})

		return this._prepareResult(result)
	}

	/**
	 * Check if the values exists in storage
	 * @param  {string|rest params|array} args could be multiple params ('foo', 'bar', 'xxx')
	 * @return {boolean}
	 */
	has( ...args ) {
		if(!args.length) throw new Error('[WebStorage::has()] Needed at least one value to search')
		args = utils.flatten(args)
		return args.every(arg => utils.contains(this.toCollection(), arg))
	}

	keys( ...args ) {

		if(!args.length) return Object.keys(this.cache)

		const collection = this.pick(...args)
		let _collection = !utils.isArray(collection) ? [collection] : collection

		let result = []
		utils.each(_collection, (obj, key) => {
			result.push(...Object.keys(obj))
		})

		return this._prepareResult(result)
	}

	values( ...args ) {
		return this.get(...args)
	}

	remove( ...args ) {
		args = utils.isArray(args) ? args[0] : args;
		if(utils.isEmpty(this.cache)) {
			console.warn(`${this.namespace} is empty`);
			return false;
		}

		_.each(this.toCollection(), (obj, key) => {
			if(JSON.stringify(obj).indexOf(JSON.stringify(args)) !== -1) {
				delete this.cache[this.getKey(obj)]
			}
		})

		/*_.each(this.cache, (value, key) => {
			//if(utils.contains(args.toString(), key.toString())) delete this.cache[key];
			//if(utils.contains(args.toString(), value.toString())) delete this.cache[_.findKey(this.cache, _.partial(_.isEqual, value))];
		});*/

		this.store.set(this.cache);
	}

	empty( type=undefined ) {
		if(!this.store.has(this.namespace)) {
			console.warn(`${this.namespace} doesn't exists in storage`);
			return false;
		}

		this.cache = {};
		this.store.set(this.cache, type);
	}

	clear( type=undefined ) {
		if(!this.store.has(this.namespace)) {
			console.warn(`${this.namespace} doesn't exists in storage`);
			return false;
		}

		this.cache = {};
		this.store.remove(this.namespace, type);
	}

	_resolve( { value, error }, callback ) {
		return callback && typeof callback === 'function' ?
			callback.call(null, error, value) :
			utils.isUndefined(error) ? Promise.resolve(value) : Promise.reject(error)
	}

	_splitPath( path ) {
		path = path.replace(/\[(\w+)\]/g, '.$1')
		path = path.replace(/^\./, '')
		return path.split('.')
	}

	_prepareResult( result ) {
		return !result.length ?
			utils.isObject(result) ? result : undefined :
			result.length === 1 ? result[0] : result
	}

	_switchStore( type='local' ) {

		if(this.type === type)
			return console.error(`You are already using ${this.type}Storage`);

		this.type = type;
		this.options.type = this.type;
		this.store.switchStore(this.type);
	}

	toSession() { this._switchStore('session'); }
	toLocal() { this._switchStore('local'); }

	all() {
		return this.store.getContent();
	}

	loop( args, callback ) {

		const collection = this.toCollection()

		utils.each(args, (arg, i) => {
			utils.each(collection, (obj, k) => {
				callback.call(null, arg, obj, i)
			})
		})
	}

	toCollection( objects=this.cache ) {

		if(utils.isEmpty(objects)) return

		let collection = []

		function recursive( objects ) {
			utils.each(objects, (value, key) => {
				let obj = {}
				obj[key] = value
				collection.push(obj)

				if(utils.isArray(value)) {
					if(!utils.isCollection(value))
						return recursive(value)
				}

				if(utils.isObject(value)) {
					recursive(value)
				}


			})
		}

		recursive(objects)

		return collection
	}

	getKey( value ) {
		value = JSON.stringify(value)
		let key = ''
		for(let i=0; i < value.indexOf(':'); i++) {
			key += value[i]
		}

		return key.replace(/("|\"|\:|\{|\})/g, '')
	}

	destroy() {
		storageCache[this.namespace] = {};
		delete this.store;
		delete this.options;
		delete this.namespace;
		delete this.type;
		delete this.cache;
	}

	static set( ...args ) {
		const [ key, value ] = args
		const storage = new WebStorage(key)
		storage.set(value)

	}
}
