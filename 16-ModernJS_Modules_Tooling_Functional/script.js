//////////////////////////////////////////////
//// Importing module ////

/// Named Import ///
// import { addToCart, totalPrice as price, tq } from './shoppingCart.js';
// addToCart('bread', 5);
// console.log(price, tq);

console.log('Importing module');
// console.log(shippingCost);

// This will create an object containing everything that's exported from the module specified
// import * as ShoppingCart from './shoppingCart.js';
// console.log(ShoppingCart);
// ShoppingCart.addToCart('bread', 5);
// console.log(ShoppingCart.totalPrice);

/// Default Import ///
// We can give it the name that we want
// import add from './shoppingCart.js';
// add('pizza', 2);

// We also can have use named and default imports at the same time.
// But we never to it in practice!
import add, { cart } from './shoppingCart.js';
add('pizza', 2);

/// Proof that imports are a life connection to exports ///
add('bread', 5);
add('apples', 4);
// The array that we just exported in not empty anymore
//=> IMPORTS ARE NOT COPIES OF THE EXPORT
console.log(cart);

//////////////////////////////////////////////
//// TOP-LEVEL AWAIT (ES2022) ////
// We can use the await keyword outside of an async function which we call TOP-LEVEL AWAIT. But it only works in modules, not in scripts (bc we added type="module" in the html file)

// console.log('Start fetching');
// const res = await fetch('https://jsonplaceholder.typicode.com/posts');
// const data = await res.json();
// console.log(data);
// console.log('Something');
// The await keyword which is now outside of an async function is blocking the entire execution of this module

const getLastPost = async function () {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  const data = await res.json();
  //   console.log(data);

  return { title: data.at(-1).title, text: data.at(-1).body };
};

//NOTE: Calling an async function will always return a promise!
const lastPost = getLastPost();
console.log(lastPost);
lastPost.then(last => console.log(last));
//Not very clean...

// const lastPost2 = await getLastPost();
// console.log(lastPost2);

//////////////////////////////////////////////
//// THE MODULE PATTERN ////

// Like a module, the main goal of the module pattern is ton encapsulate functionality, to have private data, and to expose a public API
// => The best way of achieving all that is by simply using a function
//We generally create a IIFE bc the goal of this function is to be used once
const ShoopingCart2 = (function () {
  const cart = [];
  const shippingCost = 10;
  const totalPrice = 238;
  const totalQuantity = 23;
  const addToCart = function (product, quantity) {
    cart.push({ product, quantity });
    console.log(
      `${quantity} ${product} add to cart (shiping cost is ${shippingCost})`
    );
  };
  const orderStock = function (product, quantity) {
    console.log(`${quantity} ${product} ordered from supplier`);
  };

  return {
    addToCart,
    cart,
    totalPrice,
    totalQuantity,
  };
})();

ShoopingCart2.addToCart('apple', 4);
ShoopingCart2.addToCart('pizza', 2);
console.log(ShoopingCart2);
console.log(ShoopingCart2.shippingCost);

//////////////////////////////////////////////
//// COMMONJS MODULES ////

//There are different modules systems and CommonJS is particularly important in the world of JavaScript

//Will works in Node.JS:
// Export
// export.addToCart = function (product, quantity) {
//     cart.push({ product, quantity });
//     console.log(
//       `${quantity} ${product} add to cart (shiping cost is ${shippingCost})`
//     );
// Import
// const { addToCart} = require('./shoppingCart.js');

//////////////////////////////////////////////
//// A BRIEF INTRODUCTION TO THE COMMAND LINE ////
import cloneDeep from './node_modules/lodash-es/cloneDeep.js';
// import cloneDeep from 'lodash-es';
// import cloneDeep from 'lodash';

const state = {
  cart: [
    { product: 'bread', quantity: 5 },
    { product: 'pizza', quantity: 5 },
  ],
  user: { loggedIn: true },
};

const stateClone = Object.assign({}, state);
const stateDeepClone = cloneDeep(state);
state.user.loggedIn = false;
console.log(stateClone); //Changed to false
console.log(stateDeepClone); // Still true

if (module.hot) {
  module.hot.accept();
}

class Person {
  greeting = 'Hey';
  constructor(name) {
    this.name = name;
    console.log(`${this.greeting}, ${this.name}`);
  }
}
const jonas = new Person('Jonas');

console.log('Jonas' ?? null);

console.log(cart.find(el => el.quantity >= 2));

Promise.resolve('TEST').then(x => console.log(x));

import 'core-js/stable';
// import 'core-js/stable/array/find';

// Polifilling async functions
import 'regenerator-runtime/runtime';
