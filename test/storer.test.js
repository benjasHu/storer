require('./setup.js')();

import jsdom from 'mocha-jsdom'
import { expect } from 'chai'

describe('Storer', function() { 

	jsdom({ skipWindowCheck: true })
	
	var Storer = require('../dev/js/storer.js').default;
	var clearExpireds = require('../dev/js/storer.js').clearExpireds;

	describe('#constructor()', function() { 

		var storer;

		before(function() {
			storer = new Storer('myStore')
		})

		it('Return namespace', function() {
			expect(storer.namespace).to.equal('myStore')
		})

		it('Return type', function() {
			expect(storer.type).to.equal('local')
		})

		it('Time is an object', function() {
			expect(storer.time).to.be.a('object')
		})
	 
		it('Expiration is undefined', function() {
			expect(storer.time.expiration).to.be.a('undefined')
		})
	})

	describe('#set()', function() {

		var storer;

		beforeEach(function() {
			storer = new Storer('myStore')
		})

		afterEach(function() { storer.destroy() })

		it('Setting a single value', function() {
			storer.set('bar')
			var result = storer.cache
			expect(result).to.equal('bar')
		})

		it('Setting a single object', function() {
			storer.set({
				foo: 'bar',
				a: 'b'
			})
			var result = storer.cache
			expect(result).to.eql({
				foo: 'bar',
				a: 'b'
			})
		})

		it('Search the key and set the value', function() {
			storer.set({
				foo:'bar',
				count: 5000,
				a: {
					b: [
						{ c:'d' },
						{ c:'d' },
						{ c:'d' }
					]
				}
			})
			storer.set('foo', 'newValue')

			var result = storer.get('foo')

			expect(result).to.equal('newValue')
		})

		it('Setting at a path', function() {
			storer.set({
				foo:'bar',
				count: 5000,
				a: {
					b: [
						{ c:'d' },
						{ c:'d' },
						{ c:'d' }
					]
				}
			})
			storer.set('a.b[1].c', 'newValue')

			var result = storer.get('a.b[1].c')

			expect(result).to.equal('newValue')
		})

		it('Pushing the value when is an array and using only brackets without an index', function() {
			storer.set({
				foo:'bar',
				count: 5000,
				a: {
					b: [
						{ c:'d' },
						{ c:'d' },
						{ c:'d' }
					]
				}
			})
			storer.set('a.b[]', 'newValue')

			var result = storer.get('a.b')
			result = result[result.length-1]

			expect(result).to.equal('newValue')
		})

		it('Pushing the value when is an array and the index inside brackets is higher than array length', function() {
			storer.set({
				foo:'bar',
				count: 5000,
				a: {
					b: [
						{ c:'d' },
						{ c:'d' },
						{ c:'d' }
					]
				}
			})
			storer.set('a.b[25]', 'newValue')

			var result = storer.get('a.b')
			result = result[result.length-1]

			expect(result).to.equal('newValue')
		})

		it('Testing success callback', function( done ) {
			storer.set({
				foo:'bar',
				count: 5000,
				a: {
					b: [
						{ c:'d' },
						{ c:'d' },
						{ c:'d' }
					]
				}
			}, ( error, value ) => {
				expect(error).to.be.undefined
				expect(value).to.not.be.undefined
				expect(value).to.be.an('object')

				done()
			})
		})

		it('Testing error callback', function( done ) {
			storer.set(null, ( error, value ) => {
				expect(error).to.be.an('error')
				expect(error.message).to.equal('[Storer::set()] There were a problem setting the value: null')
				expect(value).to.be.undefined

				done()
			})
		})

		it('Testing Promise success', function( done ) {
			storer.set({ foo:'bar' })
				.then(value => {
					expect(value).to.not.be.undefined
					expect(value).to.eql({ foo:'bar' })
					done()
				})
		})

		it('Testing Promise error', function( done ) {

			storer.set(null)
				.catch(error => {
					expect(error).to.be.an('error')
					expect(error.message).to.equal('[Storer::set()] There were a problem setting the value: null')

					done()
				})
		})

		it('Testing EventEmitter listener', function( done ) {

			storer.on('set', value => {
				expect(value).to.not.be.undefined
				expect(value).to.eql({ foo:'bar' })
				done()
			})

			storer.set({ foo:'bar' })
		})
	})

	describe('#remove()', function() {

		var storer;

		beforeEach(function() {
			storer = new Storer('myStore')
		})

		afterEach(function() { storer.destroy() })

		it('Search the entry and remove it', function( done ) {
			storer.set({ foo:'bar' })
				.then(value => {
					storer.remove('foo')
					expect(storer.get('foo')).to.be.undefined

					done()
				})
		})

		it('Search the entry by path and remove it', function( done ) {
			storer.set({
				foo:'bar',
				count: 5000,
				a: {
					b: [
						{ c:1 },
						{ c:2 },
						{ c:3 }
					]
				}
			})
				.then(value => {
					storer.remove('a.b[1]')
					expect(storer.get('a.b')).to.have.length(2)
					expect(storer.get('a.b[1]')).to.equal(3)

					done()
				})
		})

		it('Search the entry by path and remove entire array', function( done ) {
			storer.set({
				foo:'bar',
				count: 5000,
				a: {
					b: [
						{ c:1 },
						{ c:2 },
						{ c:3 }
					]
				}
			})
				.then(value => {
					storer.remove('a.b')
					expect(storer.get('a.b')).to.be.undefined

					done()
				})
		})

		it('Testing success callback', function( done ) {
			storer.set({ foo:'bar' })
				.then(value => {
					storer.remove('foo', ( error, value ) => {
						expect(storer.get('foo')).to.be.undefined
						expect(storer.store.has(storer.namespace)).to.be.true

						done()
					})
				})
		})

		it('Testing error callback', function( done ) {
			storer.set({ foo:'bar' })
				.then(value => {
					storer.remove('undefinedKey', ( error, value ) => {
						expect(error).to.be.an('error')
						expect(error.message).to.equal('[Storer::remove()] There were a problem removing the path: undefinedKey')
						expect(value).to.be.undefined

						done()
					})
				})
		})

		/*it('Testing Promise success', function( done ) {
			storer.set({ foo:'bar' })
				.then(value => storer.remove('foo'))
				.then(value => {
					expect(storer.get('foo')).to.be.undefined
					expect(storer.store.has(storer.namespace)).to.be.false
					done()
				})
		})*/

		it('Testing Promise error', function( done ) {
			storer.set({ foo:'bar' })
				.then(value => storer.remove('undefinedKey'))
				.catch(error => {
					expect(error).to.be.an('error')
					expect(error.message).to.equal('[Storer::remove()] There were a problem removing the path: undefinedKey')

					done()
				})
		})

		it('Testing EventEmitter listener', function( done ) {

			storer.on('remove', value => {
				expect(value).to.not.be.undefined
				expect(value).to.equal('foo')
				done()
			})

			storer.set({ foo:'bar' })
				.then(value => storer.remove('foo'))
		})
	})

	describe('#get()', function() {

		var storer;

		before(function() {
			storer = new Storer('myStore')
			storer.set({
				foo:'bar',
				count: 5000,
				a: {
					b: [
						{ c:'d' },
						{ c:'d' },
						{ c:'d' }
					]
				}
			})
		})

		it('Return "bar" as a string', function() {
			var result = storer.get('foo')
			expect(result).to.equal('bar')
		})

		it('Return "d" as the result of the path a.b[1].c', function() {
			var result = storer.get('a.b[1].c')
			expect(result).to.equal('d')
		})

		it('The result must be an array when there are multiple params', function() {
			var result = storer.get('foo', 'a.b[1].c')
			expect(result).to.be.an('array')
		})

		it('Return ["bar", "d"] when getting ("foo", "a.b[1].c")', function() {
			var result = storer.get('foo', 'a.b[1].c')
			expect(result[0]).to.equal('bar')
			expect(result[1]).to.equal('d')
		})
	})

	describe('#pick()', function() {

		var storer;

		before(function() {
			storer = new Storer('myStore')
			storer.set({
				foo:'bar',
				count: 5000,
				a: {
					b: [
						{ c:'d' },
						{ c:'d' },
						{ c:'d' }
					]
				}
			})
		})

		it('The result must be an object when there are only one param', function() {
			var result = storer.pick('foo')
			expect(result).to.be.an('object')
		})

		it('Return { foo:"bar" } key/value pair', function() {
			var result = storer.pick('foo')
			expect(result).to.eql({ foo:'bar' })
		})

		it('Return { c:"d" } key/value pair as the result of the path a.b[1].c', function() {
			var result = storer.pick('a.b[1].c')
			expect(result).to.eql({ c:'d' })
		})

		it('The result must be an array when there are multiple params', function() {
			var result = storer.pick('foo', 'a.b[1].c')
			expect(result).to.be.an('array')
		})

		it('Return [{ foo:"bar" }, { c:"d" }] when picking ("foo", "a.b[1].c")', function() {
			var result = storer.pick('foo', 'a.b[1].c')
			expect(result[0]).to.eql({ foo:'bar' })
			expect(result[1]).to.eql({ c:'d' })
		})
	})

	describe('#has()', function() {

		var storer;

		before(function() {
			storer = new Storer('myStore')
			storer.set({
				foo:'bar',
				count: 5000,
				a: {
					b: [
						{ c:'d' },
						{ c:'d' },
						{ c:'d' }
					]
				}
			})
		})

		it('The result must be a boolean when there are only one param', function() {
			var result = storer.has('foo')
			expect(result).to.be.an('boolean')
		})

		it('The result must be a boolean when there are multiple params', function() {
			var result = storer.has('foo', 'a.b[1].c')
			expect(result).to.be.an('boolean')
		})

		it('Return true when checking for "foo"', function() {
			var result = storer.has('foo')
			expect(result).to.be.true
		})

		it('Return false when checking for "notInStore"', function() {
			var result = storer.has('notInStore')
			expect(result).to.be.false
		})

		it('Return true when checking for the path a.b[1].c', function() {
			var result = storer.has('a.b[1].c')
			expect(result).to.be.true
		})

		it('Return true when all params are found', function() {
			var result = storer.has('foo', 'a.b[1].c')
			expect(result).to.be.true
		})

		it('Return false when there multiple params and one of them is not found', function() {
			var result = storer.has('foo', 'a.b[1].c', 'notInStore')
			expect(result).to.be.false
		})
	})

	describe('#keys()', function() {

		var storer;

		before(function() {
			storer = new Storer('myStore')
			storer.set({
				foo:'bar',
				count: 5000,
				a: {
					b: [
						{ c:'d' },
						{ c:'d' },
						{ c:'d' }
					]
				}
			})
		})

		it('The result must be an array', function() {
			var result = storer.keys()
			expect(result).to.be.an('array')
		})

		it('Array length must be 5', function() {
			var result = storer.keys()
			expect(result).to.have.length(5)
		})
	})

	describe('#loop()', function() {

		var storer;

		beforeEach(function() {
			storer = new Storer('myStore')
		})

		afterEach(function() { storer.destroy() })

		it('Testing a loop with success callback', function( done ) {
			storer.set({
				foo:'bar',
				count: 5000,
				a: {
					b: [
						{ c:'d' },
						{ c:'d' },
						{ c:'d' }
					]
				}
			})
			storer.loop(( value, key, count ) => {
				expect(value).to.not.be.undefined
				expect(key).to.not.be.undefined
				expect(count).to.not.be.undefined
			}, count => {
				expect(count).to.equal(10)

				done()
			})
		})

		it('Testing a loop with error callback', function( done ) {
			storer.set(null)
			storer.loop(( value, key, count ) => {}, error => {
				expect(error).to.be.an('error')
				expect(error.message).to.equal('[Storer::loop()] There were a problem looping')

				done()
			})
		})

		it('Testing a loop with a Promise success callback', function( done ) {
			storer.set({
				foo:'bar',
				count: 5000,
				a: {
					b: [
						{ c:'d' },
						{ c:'d' },
						{ c:'d' }
					]
				}
			})
			storer.loop(( value, key, count ) => {
				expect(value).to.not.be.undefined
				expect(key).to.not.be.undefined
				expect(count).to.not.be.undefined
			}).then(count => {
				expect(count).to.equal(10)
				done()
			})
		})

		it('Testing a loop with a Promise error callback', function( done ) {

			storer.set(null)

			storer.loop(( value, key, count ) => {}).catch(error => {
				expect(error).to.be.an('error')
				expect(error.message).to.equal('[Storer::loop()] There were a problem looping')

				done()
			})
		})
	})

	describe('#reset()', function() {

		var storer;

		beforeEach(function() {
			storer = new Storer('myStore')
			storer.set({
				foo:'bar',
				count: 5000,
				a: {
					b: [
						{ c:'d' },
						{ c:'d' },
						{ c:'d' }
					]
				}
			})
		})

		afterEach(function() { storer.destroy() })

		it('Reset with an empty object', function() {
			storer.reset()
			
			var result = storer.all()

			expect(result).to.be.an('object')
			expect(result).to.be.empty
		})

		it('Reset with a new value', function() {
			storer.reset({ foo:'bar' })
			
			var result = storer.all()
			//console.log(result)
			expect(result).to.be.an('object')
			expect(result).to.eql({ foo:'bar' })
		})

		it('Reset with a new value in sessionStorage and localStorage toggling', function() {
			storer.reset({ foo:'bar' }, 'session')

			var result = storer.toSession().all()

			expect(result).to.be.an('object')
			expect(result).to.eql({ foo:'bar' })

			storer.reset({ foo:'bar' }, 'local')

			result = storer.toLocal().all()

			expect(result).to.be.an('object')
			expect(result).to.eql({ foo:'bar' })
		})

		it('Testing EventEmitter listener', function( done ) {

			storer.on('reset', ( type, store ) => {
				expect(store).to.not.be.undefined
				expect(store).to.be.an('object')
				expect(type).to.not.be.undefined
				done()
			})

			storer.reset({ foo:'bar' })
		})
	})

	describe('#clear()', function() {

		var storer;

		beforeEach(function() {
			storer = new Storer({
				namespace: 'myStore',
				type: 'local'
			})
			storer.set({
				foo:'bar',
				count: 5000,
				a: {
					b: [
						{ c:'d' },
						{ c:'d' },
						{ c:'d' }
					]
				}
			})
		})

		afterEach(function() { storer.destroy() })

		it('Clear from current storage type', function() {
			storer.clear()
			
			var result = storer.store.has(storer.namespace)
			expect(result).to.be.false
		})

		it('Clear from sessionStorage', function() {
			storer.clear('session')
			
			var result = storer.store.has(storer.namespace)
			expect(result).to.be.false
		})

		it('Clear from both localStorage & sessionStorage', function() {
			storer.clear('both')

			var result = storer.store.has(storer.namespace)
			expect(result).to.be.false

			storer.toSession()
			result = storer.store.has(storer.namespace)
			expect(result).to.be.false
		})

		it('Testing EventEmitter listener', function( done ) {

			storer.on('clear', ( type, store ) => {
				var result = storer.store.has(storer.namespace)
				expect(result).to.be.false
				done()
			})

			storer.clear()
		})
	})

	describe('#all()', function() {

		var storer;

		beforeEach(function() {
			storer = new Storer({
				namespace: 'myStore',
				type: 'local'
			})
			storer.set({
				foo:'bar',
				count: 5000,
				a: {
					b: [
						{ c:'d' },
						{ c:'d' },
						{ c:'d' }
					]
				}
			})
		})

		afterEach(function() { storer.destroy() })

		it('Return all storage entry', function() {
			var result = storer.all()
			expect(result).to.be.an('object')
			expect(result).to.eql({
				foo:'bar',
				count: 5000,
				a: {
					b: [
						{ c:'d' },
						{ c:'d' },
						{ c:'d' }
					]
				}
			})
		})

		it('Return error when is undefined', function() {
			storer.clear()
			var result = storer.all()
			expect(result).to.be.undefined
		})
	})

	describe('#switchStore()', function() {

		var storer;

		beforeEach(function() {
			storer = new Storer({
				namespace: 'myStore',
				type: 'local'
			})
			storer.set({
				foo:'bar',
				count: 5000,
				a: {
					b: [
						{ c:'d' },
						{ c:'d' },
						{ c:'d' }
					]
				}
			})
		})

		afterEach(function() { storer.destroy() })

		it('Switch to sessionStorage', function() {
			storer.switchStore('session')

			expect(storer.type).to.equal('session')
			expect(storer.store.storage).to.equal(window.sessionStorage)
			expect(storer.all()).to.be.empty
		})

		it('Switch to localStorage', function() {
			storer
				.switchStore('session')
				.switchStore('local')

			expect(storer.type).to.equal('local')
			expect(storer.store.storage).to.equal(window.localStorage)
			expect(storer.all()).to.not.be.empty
		})
	})

	describe('#toSession()', function() {

		var storer;

		beforeEach(function() {
			storer = new Storer({
				namespace: 'myStore',
				type: 'local'
			})
			storer.set({
				foo:'bar',
				count: 5000,
				a: {
					b: [
						{ c:'d' },
						{ c:'d' },
						{ c:'d' }
					]
				}
			})
		})

		afterEach(function() { storer.destroy() })

		it('Switch to sessionStorage', function() {
			storer.toSession()

			expect(storer.type).to.equal('session')
			expect(storer.store.storage).to.equal(window.sessionStorage)
			expect(storer.all()).to.be.empty
		})
	})

	describe('#toLocal()', function() {

		var storer;

		beforeEach(function() {
			storer = new Storer({
				namespace: 'myStore',
				type: 'session'
			})
			storer.set({
				foo:'bar',
				count: 5000,
				a: {
					b: [
						{ c:'d' },
						{ c:'d' },
						{ c:'d' }
					]
				}
			})
		})

		afterEach(function() { storer.destroy() })

		it('Switch to localStorage', function() {
			storer.toLocal()

			expect(storer.type).to.equal('local')
			expect(storer.store.storage).to.equal(window.localStorage)
			//expect(storer.all()).to.be.empty
		})
	})

	describe('#destroy()', function() {

		var storer;

		it('Testing destroy', function( done ) {
			storer = new Storer({
				namespace: 'myStore',
				type: 'session'
			})
			storer.set({
				foo:'bar',
				count: 5000,
				a: {
					b: [
						{ c:'d' },
						{ c:'d' },
						{ c:'d' }
					]
				}
			})

			storer.on('before.destroy', store => {
				expect(store).to.be.an('object')
				done()
			})

			storer.destroy()

			expect(window.localStorage.getItem('myStore')).to.be.null
			expect(window.sessionStorage.getItem('myStore')).to.be.null

			expect(storer.store).to.be.undefined
			expect(storer.options).to.be.undefined
			expect(storer.namespace).to.be.undefined
			expect(storer.type).to.be.undefined
			expect(storer.cache).to.be.undefined
		})
	})

	describe('Expiration functionality', function() {

		var storer;

		before(function() {
			storer = new Storer('myStore')
		})

		this.timeout(1100);

		it('Expiration is 1000', function( done ) {
			storer = new Storer({
				namespace: 'myStore',
				expiration: 1000
			})
			expect(storer.time.expiration).to.equal(1000)

			setTimeout(done, 1000)
		})

		it('Expiration is a Number', function( done ) {
			storer = new Storer({
				namespace: 'myStore',
				expiration: 1000
			})
			expect(storer.time.expiration).to.be.a('number')

			setTimeout(done, 1000)
		})
	})

})
