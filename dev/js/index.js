import WebStorage from './webstorage'
import * as utils from './utils'

const storage = new WebStorage('myStore')

storage.on('set', ( key ) => console.log(key))
storage.set({
	foo:'bar',
	family: [
		{ nombre: 'Benja' },
		{ nombre: 'Clara' },
		{ nombre: 'Trufa' }
	],
	place: {
		town: 'Tomelloso',
		car: 'Opel Corsa',
		food: [
			{ name: 'Huevo frito' },
			{ name: 'Patatas' },
			{ name: 'Mandarina' }
		]
	}
})
/*storage.set({
	benja: {
		clara: 'trufa'
	},
	state: 'fetching',
	user: {
		ajax: {
			fetching:'corsa',
			success:[
				{ coche: [{ color:'rojo' }, { color:'azul' }] },
				{ coche: [{ color:'verde' }, { color:'amarillo' }] }
			],
			error:false,
			cached: [
				{ foo: { bar: 500 } }, 
				{ foo:'hola' },
				{ foo:'4343' },
				{ foo:'999999' }
			]
		},
		logged: 'cirote',
		rememberme: false,
		success: [
			{ bar: { bar: 1000 } }, 
			{ bar:'adios' },
			{ bar:'1111' },
			{ bar:'cirote' }
		]
	}
})*/

storage.remove('place.food[2]')
console.log(storage.all())

/*document.onclick = e => {
	storage
		.switchStore()
		.set({ time:Date.now() })
}*/

export default WebStorage
