require('./setup.js')()

import jsdom from 'mocha-jsdom'
import { expect } from 'chai'

describe('StorerStorage', function() { 

	jsdom({ skipWindowCheck: true })
	
	var StorerStorage = require('../dev/js/storer-storage.js');
	StorerStorage = 'default' in StorerStorage ? StorerStorage.default : StorerStorage

	describe('#constructor()', function() { 

		var storerStorage;

		before(function() {
			storerStorage = new StorerStorage({
				namespace: 'myStore',
				type: 'local'
			})
		})

		it('Return namespace', function() {
			expect(storerStorage.namespace).to.equal('myStore')
		})

		it('Return type', function() {
			expect(storerStorage.type).to.equal('local')
		})

		it('Storage is localStorage', function() {
			expect(storerStorage.storage).to.equal(window.localStorage)
		})
	})

	describe('#switchStore()', function() { 

		var storerStorage;

		beforeEach(function() {
			storerStorage = new StorerStorage({
				namespace: 'myStore',
				type: 'local'
			})
		})

		afterEach(function() {
			storerStorage.removeBoth()
		})

		it('Switch to sessionStorage', function() {
			storerStorage.switchStore('session')
			expect(storerStorage.type).to.equal('session')
			expect(storerStorage.storage).to.equal(window.sessionStorage)
		})
	})

	describe('#getStore()', function() { 

		var storerStorage;

		beforeEach(function() {
			storerStorage = new StorerStorage({
				namespace: 'myStore',
				type: 'local'
			})
		})

		afterEach(function() {
			storerStorage.removeBoth()
		})

		it('Get current storage: localStorage', function() {
			storerStorage.getStore()
			expect(storerStorage.storage).to.eql(window.localStorage)
		})
	})

	describe('#toggleStore()', function() { 

		var storerStorage;

		beforeEach(function() {
			storerStorage = new StorerStorage({
				namespace: 'myStore',
				type: 'local'
			})
		})

		afterEach(function() {
			storerStorage.removeBoth()
		})

		it('Toggle to sessionStorage', function() {
			storerStorage.toggleStore()
			expect(storerStorage.type).to.equal('session')
		})
	})

	describe('#set()', function() { 

		var storerStorage;

		beforeEach(function() {
			storerStorage = new StorerStorage({
				namespace: 'myStore',
				type: 'local'
			})
		})

		afterEach(function() {
			storerStorage.removeBoth()
		})

		it('Set a value', function() {
			storerStorage.set('foo')
			
			var result = storerStorage.getContent()

			expect(result).to.equal('foo')
		})

		it('Set a object', function() {
			storerStorage.set({
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
			
			var result = storerStorage.getContent()

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
	})

	describe('#get()', function() { 

		var storerStorage;

		beforeEach(function() {
			storerStorage = new StorerStorage({
				namespace: 'myStore',
				type: 'local'
			})
		})

		afterEach(function() {
			storerStorage.removeBoth()
		})

		it('Getting the entry', function() {
			storerStorage.set('foo')
			
			var result = storerStorage.get()

			expect(result).to.equal('"foo"')

			storerStorage.set({ foo:'bar' })
			result = storerStorage.get()

			expect(result).to.be.a('string')
			expect(result).to.equal(JSON.stringify({ foo:'bar' }))
		})
	})

	describe('#getContent()', function() { 

		var storerStorage;

		beforeEach(function() {
			storerStorage = new StorerStorage({
				namespace: 'myStore',
				type: 'local'
			})
		})

		afterEach(function() {
			storerStorage.removeBoth()
		})

		it('Getting the entry content', function() {
			storerStorage.set('foo')
			
			var result = storerStorage.getContent()

			expect(result).to.equal('foo')

			storerStorage.set({ foo:'bar' })
			result = storerStorage.getContent()

			expect(result).to.be.an('object')
			expect(result).to.eql({ foo:'bar' })
		})
	})

	describe('#has()', function() { 

		var storerStorage;

		beforeEach(function() {
			storerStorage = new StorerStorage({
				namespace: 'myStore',
				type: 'local'
			})
		})

		afterEach(function() {
			storerStorage.removeBoth()
		})

		it('Check if entry exists in storage', function() {
			storerStorage.set('foo')
			
			var result = storerStorage.has()

			expect(result).to.be.true

			storerStorage.remove()
			result = storerStorage.has()

			expect(result).to.be.false
		})
	})

	describe('#remove()', function() { 

		var storerStorage;

		beforeEach(function() {
			storerStorage = new StorerStorage({
				namespace: 'myStore',
				type: 'local'
			})
		})

		afterEach(function() {
			storerStorage.removeBoth()
		})

		it('Remove the entry', function() {
			storerStorage.set('foo')
			storerStorage.remove()

			expect(window.localStorage.getItem(storerStorage.namespace)).to.be.null
		})
	})

	describe('#removeBoth()', function() { 

		var storerStorage;

		beforeEach(function() {
			storerStorage = new StorerStorage({
				namespace: 'myStore',
				type: 'local'
			})
		})

		afterEach(function() {
			storerStorage.removeBoth()
		})

		it('Remove the entry in both local & session storage', function() {
			storerStorage.set('foo')
			storerStorage.removeBoth()

			expect(window.localStorage.getItem(storerStorage.namespace)).to.be.null
			expect(window.sessionStorage.getItem(storerStorage.namespace)).to.be.null
		})
	})

	describe('#browserSupportsStorage()', function() { 
		
		var _localStorage

		after(function() {
			window.localStorage = _localStorage
		})

		it('Remove the entry in both local & session storage', function() {
			var result = StorerStorage.browserSupportsStorage()

			expect(result).to.be.true

			_localStorage = window.localStorage

			window.localStorage = null

			result = StorerStorage.browserSupportsStorage()

			expect(result).to.be.false
		})
	})
})
