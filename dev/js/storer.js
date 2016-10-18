import * as utils from './utils'
import StorerBase from './storer-base'
import EventEmitter from 'eventemitter2';

if(!StorerBase.browserSupportsStorage())
	throw new Error('It seems that your browser doesn\'t support both LocalStorage & SessionStorage. Try to use a modern browser!')

let storageCache = storageCache || {};

class ClassToExtend {};
const _EventEmitter = typeof EventEmitter !== 'undefined' ? EventEmitter : ClassToExtend

const REGEX = {
	isPath     : /[(\[\d+\])(\.)]+/,
	arrayIndex : /(?:\[(\d+)?\])/,
	arrayPush  : /\[\]$/,
	firstDot   : /^\./
}

export default class Storer extends _EventEmitter {

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
	 * @param  {String|Object} args Namespace or Options
	 * @return {this}
	 */
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

		this.store = new StorerBase(this.options);

		if(utils.isUndefined(storageCache[this.namespace])) {
			storageCache[this.namespace] = {};
		}

		this.cache = this._getCache();

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
			value = args[1],
			callback = null

		callback = this._parseCallback(...args)

		if(!value) {
			try{
				if(utils.isObject(path)) {
					utils.merge(this.cache, path);
				} else {
					this.cache = path
				}

				this.store.set(this.cache)

				this.emit('set', path)

				return this._resolve({ value:path }, callback)

			} catch( e ) {
				const error = `[Storer::set()] There were a problem setting the value: ${JSON.stringify(path)}`
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
	 * @param  {Function} successCallback  To be executed if everything went right
	 * @return {Function|Promise}
	 */
	loop( iteratorCallback, successCallback ) {
		let count = 0

		function iterate( obj=this.cache ) {
			utils.each(obj, ( value, key ) => {
				if(!utils.isUndefined(value)) {
					iteratorCallback.call(null, value, key, count)
					count++

					if(utils.isObject(value) || utils.isArray(value))
						iterate(value)
				} else {
					return Promise.reject(`[Storer::loop()] There were a problem looping`)
				}
			})
		}

		iterate(this.cache)

		if(count > 0) {
			!!successCallback && utils.isFunction(successCallback) && successCallback.call(null, this.cache)

			return Promise.resolve(this.cache)
		} else {
			return Promise.reject(`[Storer::loop()] There were a problem looping`)
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

		found && this.store.set(this.cache)

		let result = { value:this.all() }

		if(!found) {
			const _error = `[Storer::remove()] There were a problem removing the path: "${arg}"`
			result = utils.merge(result, { error:_error })
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
	reset( args={}, type=undefined ) {
		if(!this.store.has(this.namespace)) {
			throw new Error(`${this.namespace} not found in Storage`);
		}

		this.cache = args;
		this.store.set(this.cache, type);

		this.emit('reset', this.all())

		return this;
	}

	/**
	 * Remove namespaced entry of storage, choosing between "local" & "session"
	 * @param  {String} type "local" | "session" | undefined=both
	 * @return {void}
	 */
	clear( type=undefined ) {
		if(!this.store.has(this.namespace)) {
			throw new Error(`${this.namespace} not found in Storage`);
		}

		this.cache = {};
		this.store.remove(this.namespace, type);

		this.emit('clear', this.all())

		return this;
	}

	/**
	 * Switch store type
	 * @param  {String} type
	 * @return {void}
	 */
	switchStore( type='local' ) {

		if(this.type === type)
			type = type === 'local' ? 'session' : 'local'

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

		this.clear('local')
		this.clear('session')
		
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
			utils.isObject(this.store.getContent(this.namespace)) ? this.store.getContent(this.namespace) : {} :
			storageCache[this.namespace];
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

		if(!collection.length)
			throw new Error(`[Storer] Store is empty`)

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
			return callback.call(null, error, value)
		} else {
			if(!utils.isUndefined(error)) return Promise.reject(error)
			if(utils.isUndefined(value)) return Promise.reject('The value is undefined')

			return Promise.resolve(value)
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
}

window.Storer = window.Storer || Storer
