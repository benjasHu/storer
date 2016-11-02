'use strict';

//import { expect } from chai
//console.log(expect)
//import Storer, { StorerStorage, clearExpireds } from './dev/js/index'

describe('Storer', function () {
	describe('Storer', function () {

		var Storer;

		beforeEach(function () {
			storer = new Storer('myStore');
		});

		it('return namespace', function () {
			expect(storer.namespace).to.equal('myStore');
		});
	});
});