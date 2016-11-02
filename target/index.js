'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearExpireds = exports.StorerStorage = exports.default = undefined;

var _storerStorage = require('./storer-storage');

var _storerStorage2 = _interopRequireDefault(_storerStorage);

var _storer = require('./storer');

var _storer2 = _interopRequireDefault(_storer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _storer2.default;
exports.StorerStorage = _storerStorage2.default;
exports.clearExpireds = _storer.clearExpireds;