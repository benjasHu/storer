import * as utils from './utils'
import StorerStorage from './storer-storage'
import EventEmitter from 'eventemitter2';

if(!StorerStorage.browserSupportsStorage())
	throw new Error('It seems that your browser doesn\'t support both LocalStorage & SessionStorage. Try to use a modern browser!')

window._storer_expireds_ = {}

class ClassToExtend {};
const _EventEmitter = typeof EventEmitter !== 'undefined' ? EventEmitter : ClassToExtend

const REGEX = {
	isPath     : /[(\[\d+\])(\.)]+/,
	arrayIndex : /(?:\[(\d+)?\])/,
	arrayPush  : /\[\]$/,
	firstDot   : /^\./,
	expiration : /^_storer_expiration_(.+)/
}

function clearExpireds( type='local' ) {
	const storage = window[`${type}Storage`]

	for(const key in storage) {

		let item = storage.getItem(key)

		if(typeof item !== 'undefined') { 
			item = JSON.parse(item)
			
			if(REGEX.expiration.test(key)) {
				
				if(utils.isExpired(item.timestamp, item.expiration)) {
					storage.removeItem(key)

					const namespace = REGEX.expiration.exec(key)[1]

					if(namespace in storage) {
						storage.removeItem(namespace)

						const ref = `_storer_expiration_${namespace}`

						if(window._storer_expireds_ && ref in window._storer_expireds_) {
							clearTimeout(window._storer_expireds_[ref])
							delete window._storer_expireds_[ref]
						}
					}
				}
			}
		}
	}
}

class Storer extends _EventEmitter {

	/**
	 * Storer constructor
	 * @param  {String|Object} args Namespace or Options
	 * @return {this}
	 */
	constructor( ...args ) {
		super(...args);
		this._create(...args);
		return this;
	}

	/**
	 * Create Storage's mirror cache to manage all storage
	 * @param  {Object|String} args Namespace or Options
	 * @return {this}
	 */
	_create( args ) {

		this.options = {
			expiration: undefined,
			namespace: 'storage',
			type: 'local' // local || session
		};

		if(utils.isString(args)) {
			this.options.namespace = args

		} else if(utils.isObject(args)) {
			utils.merge(this.options, args)
		} else {
			throw new Error(`[Storer::constructor()] There were an error setting Storer's constructor`)
		}

		this.namespace = this.options.namespace
		this.type = this.options.type

		this.time = {
			timestamp: new Date().getTime()
		}

		if(!!this.options.expiration) {
			this.time['expiration'] = parseInt(this.options.expiration, 10)

			this.setExpired(this.time.expiration, false)
		}

		this.store = new StorerStorage(this.options);

		/*if(utils.isUndefined(storageCache[this.namespace])) {
			storageCache[this.namespace] = {};
		}*/

		if(this.store.has(this.namespace)) {
			this.cache = this.store.getContent()
		} else {
			this.cache = {}
		}

		this.store.set(this.cache)

		return this;
	}

	/**
	 * Override EventEmitter's on method
	 * @param  {...args} args
	 * @return {void}
	 */
	on( ...args ) {
		if(typeof EventEmitter !== 'undefined') {
			super.on(...args)
		} else {
			console.warn(`[Storer::on()] To use this method, you need to import EventEmitter`)
		}
	}

	/**
	 * Override EventEmitter's emit method
	 * @param  {...args} args
	 * @return {void}
	 */
	emit( ...args ) {
		if(typeof EventEmitter !== 'undefined')
			super.emit(...args)
	}

	/**
	 * Set new entry into namespaced storage object
	 * @param {object|string pair} args
	 *
	 * storage.set('foo')
	 * storage.set({ foo:bar })
	 * storage.set('foo.hello[0].bye', 'bar')
	 * storage.set('foo.hello[]', 'bar') // This way you can push a value into an array
	 */
	set( ...args ) {

		let path = args[0],
			value = !!args[1] && typeof args[1] !== 'function' ? args[1] : undefined,
			callback = null

		callback = this._parseCallback(...args)

		if(!value) {

			const error = `[Storer::set()] There were a problem setting the value: ${JSON.stringify(path)}`

			try{
				if(!path) {
					return this._resolve({ error }, callback)
				}

				if(utils.isObject(path)) {
					utils.merge(this.cache, path);
				} else {
					this.cache = path
				}

				this.store.set(this.cache)

				this.emit('set', path)

				return this._resolve({ value:path }, callback)

			} catch( e ) {
				return this._resolve({ error }, callback)
			}

		} else {

			let found = false

			if(this._isPath(path)) {
				const _path = this._splitPath(path)
				_path.reduce(( prev, curr ) => {
					if(!prev) return undefined
					if(_path[_path.length-1] === curr) {

						if(utils.isArray(prev)) {

							// When curr === '' --> We have to push the value
							if(utils.isNumeric(curr)) {
								curr > prev.length-1 ? prev.push(value) : prev[Math.min(curr, _path.length-1)] = value
							} else {
								prev.push(value)
							}
							
						} else {
							prev[curr] = value
						}

						found = true
					} else {
						return prev[curr]
					}
					
				}, this.cache)
			} else {

				function deepSet( obj, key ) {
					if (utils.isObject(obj) || utils.isArray(obj)) {

						utils.each(obj, ( v, k ) => {

							if(k === key) {
								found = true
								obj[k] = value
							} else {
								deepSet(obj[k], key)
							}
						})
					}
				}

				deepSet(this.cache, path)

				if(!found) {
					utils.merge(this.cache, { [path]: value })
					found = true
				}
			}

			this._sanitizeArrays(this.cache)

			found && this.store.set(this.cache)

			let result = { value:this.all() }

			if(!found) {
				const _error = `[Storer::set()] There were a problem setting the value: ${JSON.stringify(value)}`
				result = utils.merge(result, { error:_error })
			} else {
				this.emit('set', value)
			}

			return this._resolve(result, callback)
		}		
	}

	/**
	 * Get values only by keys (if a path is given, find it by path)
	 * @param  {string|rest params|array} args could be multiple params ('foo', 'bar', 'xxx')
	 * @return {string|array}
	 */
	get( ...args ) {

		args = utils.flatten(args)


		if(!args[0].length) return this.all()

		let result = []
		const collection = this._toCollection()

		args.forEach(( arg, i ) => {

			const found = this._isPath(arg) ? this._findByPath(arg) : this._findInCollection(arg)

			if(found) {
				if(utils.isArray(found)) {
					result.push(found.map(f => f[Object.keys(f)[0]]))
				} else {
					const key = Object.keys(found)[0]
					const value = found[key]
					result.push(utils.isArray(value) ? [value] : value)
				}
			} else {
				result.push(undefined)
			}
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

		if(!args[0]) return this.all()

		let result = []

		const collection = this._toCollection()

		args.forEach(( arg, argKey ) => {
			const found = this._isPath(arg) ? this._findByPath(arg) : this._findInCollection(arg)
			found ? result.push(found) : result.push(undefined)
		})

		return this._prepareResult(result)
	}

	/**
	 * Check if the values exists in storage
	 * @param  {string|rest params|array} args could be multiple params ('foo', 'bar', 'xxx')
	 * @return {boolean}
	 */
	has( ...args ) {

		args = utils.flatten(args)
		return args.every(arg => {
			const found = this._isPath(arg) ? this._findByPath(arg) : this._findInCollection(arg)
			return !!found
		})
	}

	/**
	 * Get the keys in storage
	 * @return {Object}
	 */
	keys() {

		let result = [];

		const collection = this._toCollection()

		if(collection.length) {
			result = collection.map(obj => utils.keys(obj)[0])

			result = utils.uniq(result)

			return this._prepareResult(result)
		} else {
			throw new Error(`[Storer::keys()] Keys not found`)
		}
	}

	/**
	 * Iterate through storage
	 * @param  {Function} iteratorCallback Each iteration function
	 * @param  {Function} resultCallback  To be executed if everything went right
	 * @return {Function|Promise}
	 */
	loop( iteratorCallback, resultCallback ) {

		let count = 0

		function showError( error ) {
			!!resultCallback && typeof resultCallback === 'function' && resultCallback.call(null, new Error(error))
			return Promise.reject(new Error(error))
		}

		const errorObjectArray = `[Storer::loop()] Storer entry have to be an object or array to be iterated`

		if(!utils.isObject(this.cache) && !utils.isArray(this.cache)) {
			return showError(errorObjectArray)

		} else if(!this.cache || utils.isEmpty(this.cache)) {
			return showError(errorObjectArray)
		}

		function iterate( obj=this.cache ) {
			utils.each(obj, ( value, key ) => {
				try {
					
					iteratorCallback.call(null, value, key, count)
					count++

					if(utils.isObject(value) || utils.isArray(value)) {
						iterate(value)
					}
				} catch(e) {
					const error = `[Storer::loop()] There were a problem looping through: ${value}`
					return showError(error)
				}
			})
		}

		iterate(this.cache)

		if(count > 0) {
			!!resultCallback && typeof resultCallback === 'function' && resultCallback.call(null, count)

			return Promise.resolve(count)
		} else {
			const error = `[Storer::loop()] There were a problem looping`
			return showError(error)
		}
	}

	/**
	 * Remove any entry (by key) into namespaced storage object (could be a path)
	 * @param  {string}
	 * @return {boolean}
	 *
	 * storage.remove('foo')
	 * storage.remove('foo.bar[0].xxx')
	 */
	remove( arg, callback=null ) {

		let error, found = false

		if(this._isPath(arg)) {
			const path = this._splitPath(arg)
			path.reduce(( prev, curr ) => {
				if(!prev) return undefined

				curr = utils.isArray(prev) ? Math.min(parseInt(curr, 10), prev.length-1) : curr

				if(parseInt(path[path.length-1], 10) === curr) {

					if(!!prev[curr]) {

						found = true


						if(utils.isArray(prev)) {
							prev.splice(curr, 1)
						} else {
							delete prev[curr]
						}
					}

				} else if(path[path.length-1] === curr) {
					delete prev[curr]

				} else {
					return prev[curr]
				}
				
			}, this.cache)
		} else {

			function deepDelete( obj, key ) {
				if (utils.isObject(obj) || utils.isArray(obj)) {

					utils.each(obj, ( value, k ) => {

						if(k === key) {
							found = true
							delete obj[k]
						} else {
							deepDelete(obj[k], key)
						}
					})
				}
			}

			deepDelete(this.cache, arg)	
		}

		this._sanitizeArrays(this.cache)

		if(found) {
			this.store.set(this.cache)
		}

		let result = { value:this.all() }

		if(!found) {
			const _error = `[Storer::remove()] There were a problem removing the path: ${arg}`
			result = { error:_error }
		} else {
			this.emit('remove', arg, this.all())
		}


		return this._resolve(result, callback)
	}

	/**
	 * Reset namespaced entry of storage, choosing between "local" & "session"
	 * @param  {String} type "local" | "session" | undefined=both
	 * @return {void}
	 */
	reset( args={}, type=this.type ) {

		try {
			
			if(type !== this.type) {
				this.switchStore(type)
			}

			this.cache = args;

			this.store.set(this.cache);

			this.emit('reset', type, this.all())
		} catch(e) {
			throw new Error(`${this.namespace} not found in Storage`);
		}

		return this;
	}

	/**
	 * Remove namespaced entry of storage, choosing between "local" & "session"
	 * @param  {String} type "local" | "session" | undefined=both
	 * @return {void}
	 */
	clear( type=this.type ) {

		try {
			this.cache = {};

			if(type === 'both') {
				this.store.remove(this.namespace)
				this.switchStore(type === 'local' ? 'session' : 'local')
				this.store.remove(this.namespace)
			} else {
				this.switchStore(type)
				this.store.remove(this.namespace);
			}

			this.emit('clear', type, this.all())
		} catch(e) {
			throw new Error(`${this.namespace} not found in Storage`);
		}

		return this;
	}

	/**
	 * Set expired time to the entry. It will be created a new reference entry to manage it.
	 * @param {Number}  expiration
	 * @param {Function|Promise}  callback
	 */
	setExpired( expiration=0, callback ) {

		const _expiredNamespace = `_storer_expiration_${this.namespace}`
		const _expiredStore = new StorerStorage({ namespace:_expiredNamespace })

		if(_expiredStore.has(_expiredNamespace)) {

			const content = _expiredStore.getContent()

			if(content && utils.isObject(content)) {
				this.time = utils.merge(content, { expiration })
				_expiredStore.set(this.time)
			} else {
				_expiredStore.set(utils.merge(this.time, { expiration }))
			}
		} else {
			_expiredStore.set(utils.merge(this.time, { expiration }))
		}

		this.time['timestamp'] = 'timestamp' in this.time ? this.time.timestamp : new Date().getTime()
		_expiredStore.set(this.time)

		if(window._storer_expireds_) {

			if(_expiredNamespace in window._storer_expireds_)
				return

			window._storer_expireds_[_expiredNamespace] = setTimeout(() => {
				//this.time = { timestamp: new Date().getTime() }
				clearExpireds(this.type)
				//this.destroy()
			}, expiration)
		}

		let result = {}

		if(_expiredStore.has(_expiredNamespace)) {
			result = { value:_expiredStore.getContent(_expiredNamespace) }
			this.emit('set.expired', _expiredStore.getContent(_expiredNamespace))
		} else {
			result = { error:`[Storer::expiration] Expiration namespace not found in storage: [${_expiredNamespace}]` }
		}

		return this._resolve(result, callback)
	}

	/**
	 * Remove expired time for the entry. ALso, will be removed the reference entry.
	 * @return {Function|Promise} callback
	 */
	removeExpired( callback ) {
		let result = {}
		const _expiredNamespace = `_storer_expiration_${this.namespace}`
		const _expiredStore = new StorerStorage({ namespace:_expiredNamespace })

		if(_expiredStore.has(_expiredNamespace)) {
			_expiredStore.remove(_expiredNamespace)

			this.time = { timestamp: new Date().getTime() }
			clearExpireds(this.type)

			result = { value:_expiredNamespace }
			this.emit('remove.expired', _expiredStore.getContent(_expiredNamespace))
		} else {
			result = { error:`[Storer::expiration] Expiration namespace not found in storage: [${_expiredNamespace}]` }
		}

		return this._resolve(result, callback)
	}

	clearExpireds( type='local' ) { clearExpireds(type) }

	/**
	 * Check if expiration time is exceeded
	 * @return {Boolean}
	 */
	isExpired() {
		const _expiredNamespace = `_storer_expiration_${this.namespace}`
		const _expiredStore = new StorerStorage({ namespace:_expiredNamespace })

		if(!_expiredStore.has(_expiredNamespace)) {
			return true
		}

		if('expiration' in this.time) {
			const { timestamp, expiration } = this.time
			const now = new Date().getTime()
			return (now - timestamp) > expiration
		} else {
			return false
		}
	}

	/**
	 * Switch store type
	 * @param  {String} type
	 * @return {void}
	 */
	switchStore( type='local' ) {

		//if(this.type === type)
			//type = type === 'local' ? 'session' : 'local'

		this.type = type;
		this.options.type = this.type;
		this.store.switchStore(this.type);

		this.cache = this._getCache()

		this.emit('switch', this.type, this.all())

		return this;
	}

	/**
	 * Switch store to session
	 * @return {void}
	 */
	toSession() { return this.switchStore('session'); }

	/**
	 * Switch store to local
	 * @return {void}
	 */
	toLocal() { return this.switchStore('local'); }

	/**
	 * Get all entries in storage
	 * @return {Object|String}
	 */
	all() {
		return this.store.getContent();
	}

	/**
	 * Destroy namespaced storage from Storage and clear all vars
	 * @return {void}
	 */
	destroy() {

		this.emit('before.destroy', this.all())

		if(this.store.has(this.namespace)) {
			this.clear('local')
			this.clear('session')
		}
		
		delete this.store;
		delete this.options;
		delete this.namespace;
		delete this.type;
		delete this.cache;
	}

	/**
	 * Get actual cache depending on storage type
	 * @return {Object}
	 */
	_getCache() {
		return this.store.has(this.namespace) ?
			utils.isObject(this.store.getContent(this.namespace)) ? this.store.getContent(this.namespace) : {} : {};
	}

	/**
	 * 	Sanitize empty array entries
	 * @return {Array} 
	 */
	_sanitizeArrays() {
		function deepSanitizeArray( obj ) {

			utils.each(obj, ( value, k ) => {

				if(utils.isArray(value)) {
					obj[k] = utils.compact(value)
				}

				if (utils.isObject(value) || utils.isArray(value)) {
					deepSanitizeArray(value)
				}
			})
		}

		deepSanitizeArray(this.cache)
	}

	/**
	 * Returns valid callback or thor an error
	 * @param  {Array} args
	 * @return {Function|Error}
	 */
	_parseCallback( ...args ) {
		if(args.length <= 2 && typeof args[1] === 'function') return args[1]
		if(args.length <= 3 && typeof args[2] === 'function') return args[2]

		if(args.length > 2) {
			if(typeof args[2] !== 'function')
				throw new Error(`[Storer::set()] Only 2 params are allowed at the most`)
		}
	}

	/**
	 * Test if passed string is a path
	 * @param  {String}  str
	 * @return {Boolean}
	 */
	_isPath( str ) {
		return utils.isString(str) && REGEX.isPath.test(str)
	}

	/**
	 * Find a value searching by a path and pick its key/value pair
	 * @param  {String}
	 * @return {Object} key/value object
	 */
	_findByPath( arg ) {
		const path = this._splitPath(arg)
		const result = path.reduce(( prev, curr ) => {
			if(!prev) return undefined
			if(path[path.length-1] === curr) {
				if(!!prev[curr]) {
					return utils.isArray(prev) ? prev[curr] : { [curr]: prev[curr] }
				} else {
					return undefined
				}
			} else {
				return prev[curr]
			}
		}, this.cache)

		return this._prepareResult(result)
	}

	/**
	 * Find a value searching in the collection and pick its key/value pair
	 * @param  {String}
	 * @return {Object} key/value object
	 */
	_findInCollection( arg ) {
		let result = []
		const collection = this._toCollection()

		if(!collection) return undefined

		if(!collection.length) return undefined

		result = collection.reduce((prev, curr) => {
			const key = Object.keys(curr)[0]
			
			if(utils.contains(key, arg)) {
				return prev.concat(utils.isArray(curr[ key ]) ? { [key]: [curr[ key ]]} : { [key]: curr[ key ] } )
			} else {
				return prev
			}
		}, result)

		return this._prepareResult(result)
	}

	/**
	 * Handle resolving method to return a callback or promise
	 * @param  {Object}   ({      value,        error })
	 * @param  {Function} callback
	 * @return {Function|Promise}
	 */
	_resolve( { value, error }, callback ) {
		if(callback && typeof callback === 'function') {
			return callback.call(null, !!error ? new Error(error) : undefined, value)
		} else {

			if(!!value) {
				return Promise.resolve(value)
			} else {
				return Promise.reject(!!error ? new Error(error) : '[Storer] Something went wrong...')
			}
		}
	}

	/**
	 * Create an array of a path splitted
	 * @param  {String} path
	 * @return {Array}
	 */
	_splitPath( path ) {
		path = path.replace(REGEX.arrayIndex, '.$1')
		path = path.replace(REGEX.firstDot, '')
		return path.split('.')
	}

	/**
	 * Prepare the result to be returned
	 * @param  {Object|String|Array} result
	 * @return {Object|String|Array}
	 */
	_prepareResult( result ) {
		if(!result) return undefined
		if(utils.isArray(result) && result.length === 1 && utils.isUndefined(result[0])) return undefined

		if(utils.isArray(result) && result.length) {
			result = utils.flatten(utils.compact(result))
			return result.length === 1 ? result[0] : result
		} else {
			return utils.isObject(result) ? result : undefined
		}
	}

	/**
	 * Prepare all nested entries into a collection
	 * @param  {Object} objects
	 * @return {Object}
	 */
	_toCollection( objects=this.cache ) {

		if(utils.isEmpty(objects)) return

		let collection = []

		function recursive( objects ) {
			utils.each(objects, (value, key) => {
				let obj = {}
				obj[key] = value
				collection.push(obj)

				if(utils.isArray(value)) {
					value.forEach(arrayValue => recursive(arrayValue))
				}

				if(utils.isObject(value)) {
					recursive(value)
				}
			})
		}

		recursive(objects)

		return collection
	}

	/*==================================*/
	/* STATIC METHODS */
	/**
	 * This methods can be invoked without creating a new instance of Storer
	 *
	 * Storer.set(...args)
	 * Storer.remove(...args)
	 */
	/*==================================*/
	static set( ...args ) {
		const [ key, value ] = args
		const storage = new Storer(key)
		storage.set(value)
	}

	static remove( ...args ) {
		const storage = new Storer(args[0])
		args.shift()
		storage.remove(args)
	}

	static create( ...args ) {
		return new Storer(...args)
	}

	static clearExpireds( type='local' ) { clearExpireds(type) }
}


// check for expired items in storage
window.onload = () => {
	clearExpireds('local')
	clearExpireds('session')
}

window.onbeforeunload = () => {
	clearExpireds('local')
	clearExpireds('session')
}

window.Storer = window.Storer || Storer

export { Storer as default, clearExpireds }
