function storageMock() {
	var storage = {};

	return {
		setItem: function(key, value) {
			storage[key] = value || '';
		},
		getItem: function(key) {
			return storage[key] || null;
		},
		removeItem: function(key) {
			delete storage[key];
		},
		length() {
			return Object.keys(storage).length;
		},
		key: function(i) {
			var keys = Object.keys(storage);
			return keys[i] || null;
		}
	};
}

module.exports = function() {
	if (typeof document !== 'undefined') return;

	var jsdom = require('jsdom').jsdom;

	global.document = jsdom('<html><body></body></html>' || '');
	global.window = document.defaultView;
	global.navigator = {
		userAgent: 'node.js'
	};

	window.localStorage = storageMock();
	window.sessionStorage = storageMock();
};
