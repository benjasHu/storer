import * as utils from './utils'

export default class StorerStorage {

	constructor( { type='local', namespace='storage' } = {} ) {
		this.type = type;
		this.namespace = namespace;
		this.storage = this.getStore(this.type);
	}

	switchStore( type='local' ) {
		this.type = type;
		this.storage = this.getStore();
	}

	getStore( type=this.type ) {
		return window[`${type}Storage`];
	}

	toggleStore() {
		const newType = this.type === 'local' ? 'session' : 'local'
		this.type = newType
		return this.getStore(this.type);
	}

	set( data={} ) {
		this.storage.setItem(this.namespace, JSON.stringify(data));
	}

	get( namespace=this.namespace ) {
		return this.storage.getItem(namespace);
	}

	getContent( namespace=this.namespace ) {
		return this.has(namespace) ? JSON.parse(this.get(namespace)) : undefined;
	}

	has( namespace=this.namespace ) {

		const entry = this.get(namespace)

		if(utils.isNull(entry)) return false

		return true
	}

	remove( namespace=this.namespace ) {
		this.has(namespace) && this.storage.removeItem(namespace);
	}

	removeBoth( namespace=this.namespace, type=this.type ) {

		if(!this.has(namespace)) return
			
		this.storage.removeItem(namespace);

		const toggleStore = this.toggleStore();

		if(!utils.isNull(toggleStore.getItem(namespace)))
			toggleStore.removeItem(namespace);
	}

	static browserSupportsStorage() {
		try {
			return 'localStorage' in window && window['localStorage'] !== null;
		} catch (e) {
			return false;
		}
	}
}
