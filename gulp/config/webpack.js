import config from './'
import path from 'path'
import deepMergeWithArray from '../lib/deepMergeWithArray.js'
import webpack from 'webpack'
import WebpackNotifierPlugin from 'webpack-notifier'
import ProgressBarPlugin from 'progress-bar-webpack-plugin'

export default function() {

	const devJS      = path.resolve(config.dev + '/js'),
		  distJS     = path.resolve(config.dist),
		  env        = process.env.NODE_ENV || 'development'

	const filename = env === 'development' ?
		config.name :
		env === 'distributionDefault' ? config.name : `${config.name}.min`

	let providePluginDefaults = {
		Promise: 'es6-promise-promise'
	}

	const bannerPlugin = {
		raw: false,
		entryOnly: true,
		banner: `Storer v${config.pack.version}\nExtended storage functionality for LocalStorage and SessionStorage\n\nLicensed MIT for open source use\n\nhttp://seresinertes.com\nCopyright ${new Date().getFullYear()} benjasHu`
	}
	
	let __defaults = {
		debug: false,
		watch: true,
		devtool: false,
		context: devJS,
		cache: true,
		entry: {
			main: [
				env === 'development' ? './test.js' : './index.js'
			]
		},

		output: {
			filename: `${filename}.js`,
			path: distJS,
			library: 'storer',
			libraryTarget: 'umd',
			umdNamedDefine: true
		},

		externals: [
			{ eventemitter2: {
				root      : 'EventEmitter2',
				commonjs  : 'eventemitter2',
				commonjs2 : 'eventemitter2',
				amd       : 'eventemitter2'
			} }
		],

		resolve: {
			extensions: ['', '.js'],
			modulesDirectories: [
				'node_modules',
				devJS
			]
		},

		node: {
			fs: 'empty'
		},

		module: {
			loaders: [
				{ loader: "imports?define=>false" }, // prevent check AMD on plugins modules and check CommonJS first
				{
					test: /\.js?$/,
					loader: 'babel',
					exclude: /node_modules/,
					query: {
						cacheDirectory: true
					}
				}
			]
		},

		plugins: [
			new ProgressBarPlugin(),
			new WebpackNotifierPlugin(),
			new webpack.optimize.DedupePlugin(),
			new webpack.optimize.OccurrenceOrderPlugin(true),
			new webpack.ProvidePlugin(providePluginDefaults)
		]
	}

	if(env === 'development') {
		__defaults.devtool = 'source-map';
	}

	if(env === 'development' || env === 'distributionDefault') {
		__defaults.debug = true;
		__defaults.plugins.push(new webpack.BannerPlugin(bannerPlugin))
	}

	if(env === 'distribution') {
		__defaults.watch = false
		__defaults.plugins.push(
			new webpack.optimize.UglifyJsPlugin({
				sourceMap: false,
				compress: {
					warnings: false,
					sequences: true,
					dead_code: true,
					conditionals: true,
					booleans: true,
					unused: true,
					if_return: true,
					join_vars: true,
					drop_console: false
				},
				mangle: {
					except: ['$super', '$', 'exports', 'require']
				},
				output: {
					comments: false
				} 
			}),
			new webpack.BannerPlugin(bannerPlugin)
		)
	}

	let __project = {}

	return deepMergeWithArray(__defaults, __project)
}
