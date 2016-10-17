import * as utils from './utils'

export default class Storage {

	constructor( { type='local', namespace='storage' } = {} ) {
		this.type = type;
		this.namespace = namespace;
		this.storage = this.getStore();
	}

	switchStore( type='local' ) {
		this.type = type;
		this.storage = this.getStore();
	}

	getStore( type=this.type ) {
		return window[`${type}Storage`];
	}

	toggleStore() {
		return this.getStore(this.type === 'local' ? 'session' : 'local');
	}

	set( data={} ) {
		this.storage.setItem(this.namespace, JSON.stringify(data));

		/*if(utils.size(data) === 0) {
			const toggleStore = this.toggleStore();

			console.log(toggleStore)

			if(toggleStore.getItem(this.namespace)) {
				toggleStore.setItem(this.namespace, '');
				return this.getContent()
			} else {
				throw new Error(`[Storage::set()] Not found ${this.namespace} in ${toggleStore}`)
			}
		}*/

		return this.getContent()
	}

	get( namespace=this.namespace ) {
		return this.storage.getItem(namespace);
	}

	getContent( namespace=this.namespace ) {
		const data = this.get(namespace);
		return data ? JSON.parse(data) : undefined;
	}

	has( namespace=this.namespace ) {
		return !!this.get(namespace);
	}

	remove( namespace=this.namespace, type ) {
		this.storage.removeItem(namespace);
	}

	removeBoth( namespace=this.namespace, type ) {
		this.storage.removeItem(namespace);

		const toggleStore = this.toggleStore();

		if(toggleStore.getItem(namespace))
			toggleStore.removeItem(namespace);
	}

	static browserSupportsStorage() {
		try {
			window.localStorage.setItem('foo', 'foo');
			window.localStorage.removeItem('foo');
			return true;
		} catch (e) {
			return false;
		}
	}
}
