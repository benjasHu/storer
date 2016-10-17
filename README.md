# Storer

[![npm version](https://badge.fury.io/js/storer.svg)](https://badge.fury.io/js/storer)

**Storer** is a storage library that extendes functionality of LocalStorage and SessionStorage. Is completly written in [ECMAScript 6](http://es6-features.org/) and ready to use in current Javascript language, so you can use in both ways.

**Setter** methods are prepared for listen to ***function callbacks***, ***Promises*** and, if you want to include it, ***EventEmitter listeners***.

Creating a new instance of Storer, automatically **will be created a new entry** in Local/Session storage using the key you choose in instance options. Every new Storer instance will be a new entry in Local/Session storage, so this **namespace** will be your root of data. Storer handles itself to manage the data inside usering Objects, Arrays, etc

##Installation

```
$ npm install storer
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
