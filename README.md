# Storer

[![NPM version](https://badge.fury.io/js/storer.svg)](https://badge.fury.io/js/storer)

**Storer** is a storage library that extendes functionality of LocalStorage and SessionStorage. It is completly written in [ECMAScript 6](http://es6-features.org/) and ready to use in current Javascript language (UMD), so you can use in both ways.

**Setter** methods are prepared for listen to ***function callbacks***, [***Promises***](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) and, if you want to include it, [***EventEmitter2 listeners***](https://github.com/asyncly/EventEmitter2).

Creating a new instance of Storer, automatically **will be created a new entry** in Local/Session storage using the key you choose in instance options. Every new Storer instance will be a new entry in Local/Session storage, so this **namespace** will be your root of data. Storer handles itself to manage the data inside usering Objects, Arrays, etc.

##Installation

```
$ npm install storer
```
and in your js
```js
// ES6
import Storer from 'storer';

// ES5
var Storer = require('storer');
```

or you can simply grab `storer.min.js` file and load it in the `<head>` tag of yout html.
```html
<script src="your-path/storer.min.js"></script>
```

##How to use it
You can create a new instance of Storer class or directly use Storer's static methods
```js
// creating a new instance
const storer = new Storer('myStore');
storer.set('foo', 'bar');
storer.set({ my:'value' });

// calling static method "set"
Storer.set('foo', 'bar');
```

##Paths
Every method accepts a ***path*** as the key to search, so, for example, you can:
```js
// creating a new instance
const storer = new Storer('myStore');
storer.set('foo', {
  names: [
    { name:'bar' },
    { name: 'xxx' }
  ]
}).then(value => {
  const name = storer.get('names[0].name');
  console.log(name); // 'bar'
})
```
When the value of your namespace is an object, you can access to a property by a path.
- Nested entries with a **dot** `.`
- Array entries with **brackets and its index** `[x]`

##API
###Storer
Storer class variable. If is used without creating a new instance, you can call **set**, **remove** and **create** methods
```js
// calling static method "set", where 'foo' will be the namespace
Storer.set('foo', 'bar');

// calling static method "remove", where 'foo' will be the namespace
Storer.remove('foo');

// calling static method "create". It will create a new instance o Storer
const storer = Storer.create('foo');
```

###new Storer( namespace, type | { options } )
Arguments expected are **namespace** and **type**. You can pass it as *String options* or *Object*.
- **namespace**: Store namespace
- **type**: Storage type. *(local | session)*
```js
// options as string
const storer = new Storer('myStore', 'local');

// options as object
const storer = new Storer({
  namespace: 'foo',
  type: 'session'
});
```

###set( (value | key, value | path, value), callback( error | value ) )
Set a new at the specific key/path or fill the namespace with a value
- **value**: Any value type *(string | number | boolean | object | array)*
- **key, value**: Search specific *key* in namespace entry and, if found it, fill it with *value*
- **path, value**: Search following the *path* specific entry and, if found it, fill it with *value*
- **callback**: If callback function is present, will be invoked after setting the value
```js
// Fill namespace with a value
storer.set('foo');
storer.set({ foo:'bar' });

// Search the key and fill it with the value
storer.set('foo', 'bar');

// Search following the path and fill it with the value
storer.set('foo.bar[0].anotherKey', 'newValue');
```
If path's value is an array, you can determine wich index to update or push the new value
```js
// Update the index 1 with the value
storer.set('foo.bar[1]', 'newValue');

// Push the value to the new last index
storer.set('foo.bar[]', 'newPushedValue');

// If index to insert to is higher than array length, Storer manage ir and push it correctly
storer.set('foo.bar[25]', 'newPushedValue');
```
If callback function is present, will be invoked. Promise callbacks will **always** be invoked
```js
// callback
storer.set('foo.bar[1]', 'newValue', value => console.log(value));

// Push the value to the new last index
storer.set('foo.bar[]', 'newPushedValue')
  .then(value => console.log(value))
  .catch(error => console.error(error))
```
And **finally**, you can listen to EventEmitter to wait the updating of the value
```js
// listen to
storage.on('set', value => console.log(value))
```

###remove( key | path, successCallback )
Set a new at the specific key/path or fill the namespace with a value
- **key**: Search specific *key* in namespace entry and, if found it, remove the *value*
- **path**: Search following the *path* specific entry and, if found it, remove the *value*
- **successCallback**: callback function invoked when it reaches the end
```js
// Remove by key
storer.remove('foo');

// Remove by path
storer.remove('foo.bar[0].anotherKey');

// Success callback
storer.remove('foo.bar[0].anotherKey', store => {
  console.log('everything went well')
});

// Success Promise
storer.remove('foo.bar[0].anotherKey')
  .then(store => console.log(store))
  .catch(error => console.error(error))
```
Also, you can listen to EventEmitter to wait the updating of the value
```js
// listen to
storage.on('remove', value => console.log(value))
```

###get( key | path )
Get the value of a key or path
- **key**: Search specific *key* in namespace entry and, if found it, get the *value*
- **path**: Search following the *path* specific entry and, if found it, get the *value*
```js
// search by key
storage.get('foo')

// search by path
storage.get('foo.bar[0].name')
```
You can pass multiple params to get multiple value in an array
```js
// multiple keys/paths
storage.get('foo', 'xxx', 'foo.bar[0].name', 'bar') // Array of four values
```

###pick( key | path )
Get the key/value pair of a key or path
- **key**: Search specific *key* in namespace entry and, if found it, get the *key/value pair*
- **path**: Search following the *path* specific entry and, if found it, get the *key/value pair*
```js
// search by key
storage.pick('foo') // { foo:'bar' }

// search by path
storage.pick('foo.bar[0].name') // { name:'bar' }
```
You can pass multiple params to get multiple value in an array
```js
// multiple keys/paths
storage.pick('foo', 'xxx', 'foo.bar[0].name', 'bar') // Array of four key/value pairs
```

###has( key | path )
Check if a key or path exists in namespace
- **key**: Search specific *key* in namespace entry and, if found it, return true
- **path**: Search following the *path* specific entry and, if found it, return true
```js
// search by key
storage.has('foo') // true

// search by path
storage.pick('foo.bar[0].name') // true
```
You can pass multiple params to get multiple value in an array. To return true, every argument has to exist in namespace
```js
// multiple keys/paths
storage.has('foo', 'xxx', 'foo.bar[0].name', 'bar');
```

###keys()
Get all the keys in namespace. Return an array of keys.
```js
// get all keys
storage.keys()
```

###loop( iteratorCallback | successCallback )
Iterate through store returning key/value pairs
- **iteratorCallback**: callback function of every iteration
- **successCallback**: callback function invoked when it reaches the end
```js
// loop with callbacks
storage.loop(( value, key, i ) => {
  console.log(value, key, i);
}, store => {
  //everything went well
  console.log(store);
})
```
Also, you can get success moment with Promise
```js
// loop with callbacks
storage.loop(( value, key, i ) => {
  console.log(value, key, i);
})
.then(store => console.log(store))
.catch(error => console.error(error))
```

###reset( value, type )
Reset namespace with the value. If value is missing, reset with an empty object.
- **value**: value to replace the namespace content
- **type**: Storage type to reset the namespace *(local | session | undefined)* If undefined, will use actually using storage
```js
// reset with an empty object
storage.reset();

// reset and replace namespace with the new content
storage.reset({ foo:'bar' });

// reset and replace namespace with the new content in SessionStorage
storage.reset({ foo:'bar' }, 'session');

// listen to reset event
storage.on('reset', store => console.log(store))
```

###clear( type )
Remove namespace entry of storage, choosing between "local" & "session"
- **type**: Storage type to reset the namespace *(local | session | undefined)* If undefined, will use actually using storage
```js
// reset with an empty object
storage.clear();

// reset and replace namespace with the new content in SessionStorage
storage.reset({ foo:'bar' }, 'session');

// listen to clear event
storage.on('clear', store => console.log(store))
```

###all()
Get all content of namespace
```js
// get all content
storage.all();
```

###switchStore( type )
Switch storage type choosing between "local" & "session". After execute this method, all methods will be used in the corresponding storage type.
- **type**: Storage type to reset the namespace *(local | session)*
```js
// reset with an empty object
storage.switchStore('session');

// listen to clear event
storage.on('switch', (type, store) => console.log(type, store))
```

###toSession()
Switch storage type to SessionStorage.
```js
// switch to session
storage.toSession();
```

###toLocal()
Switch storage type to LocalStorage.
```js
// switch to local
storage.toLocal();
```

###destroy()
Destroy namespace on both Local and Session Storage. Also removes memory vars.
```js
// Destroy
storage.destroy();

// listen to destroy event. Will be invoked before destroy.
storage.on('before.destroy', store => console.log(store))
```
