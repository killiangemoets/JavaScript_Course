//Exporting module
console.log('Exporting module');

// Blocking code
// using top-level await will block the entire moduleb
console.log('Start fetching users');
// await fetch('https://jsonplaceholder.typicode.com/users');
console.log('Finish fetching users');

const shippingCost = 10;
export const cart = [];

//The variables are scoped to the current module. If we want to use them in another module we need to export them. In ES modules, there are 2 types of exports: Named Exports and Default Exports.

//// Named Exports ////
//Note: exports always need to happen in top level code (not inside  a function for example)
export const addToCart = function (product, quantity) {
  cart.push({ product, quantity });
  console.log(`${quantity} ${product} add to cart`);
};

const totalPrice = 238;
const totalQuantity = 23;

export { totalPrice, totalQuantity as tq };

//// Default Exports ////
// We use it when we only want to export one thing per module
// We simply export the value, not the variable

export default function (product, quantity) {
  cart.push({ product, quantity });
  console.log(`${quantity} ${product} add to cart`);
}
