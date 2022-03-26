'use strict';

//// DEFAULT PARAMETERS ////
const bookings = [];

const createBooking = function (
  flightNum,
  numPassengers = 1,
  price = 199 * numPassengers
) {
  // OLD WAY TO DEFINE DEFAULT PARAMETERS
  //   numPassengers = numPassengers || 1;
  //   price = price || 199;

  const booking = {
    flightNum,
    numPassengers,
    price,
  };
  console.log(booking);
  bookings.push(booking);
};

createBooking('LH123');
createBooking('LH123', 2, 800);
createBooking('LH123', 2);
createBooking('LH123', 5);

// If we don't want to define the second parameter :
createBooking('LH123', undefined, 1000);

////////////////////////////////////////////
//// How Passing Arguments Works: Values vs. Reference ////

const flight = 'LH234';
const jonas = {
  name: 'Jonas Smiht',
  passport: 24739479284,
};

const checkIn = function (flightNum, passenger) {
  flightNum = 'LH999';
  passenger.name = 'Mr. ' + passenger.name;

  if (passenger.passport === 24739479284) alert('Checked in');
  else alert('Wrong passport!');
};
checkIn(flight, jonas);

// Flight doesn't change
console.log(flight);

// jonas CHANGE !!! BC when we're copying an object, we're really honestly copying the reference to that object in the memory heap
console.log(jonas);

const newPasseport = function (person) {
  person.passport = Math.trunc(Math.random() * 100000);
};

newPasseport(jonas);
checkIn(flight, jonas);

// JAVASCRIPT DOES NOT PASS BY REFERENCE
// For object we do in fact pass in a reference but that reference itself is still a value (it's simply a value that contains a memory adress) -> So we pass a refence to the function but we do not pass BY reference

////////////////////////////////////////////
//// Functions Accepting Callback Functions ////

const oneWord = function (str) {
  return str.replaceAll(' ', '').toLowerCase();
};

const upperFirstWord = function (str) {
  const [first, ...others] = str.split(' ');
  return [first.toUpperCase(), ...others].join(' ');
};

// Higher-order function
const transformer = function (str, fn) {
  console.log(`Original string: ${str}`);
  console.log(`Transformed string: ${fn(str)}`);
  console.log(`Transformer by ${fn.name}`);
};

// upperFirstWord and oneWord are callback functions
transformer('JavaScript is the best!', upperFirstWord);
transformer('JavaScript is the best!', oneWord);

// Others examples of callback functions
const high5 = function () {
  console.log('High five bro!');
};
document.body.addEventListener('click', high5);
['Jonas', 'Martha', 'Adam'].forEach(high5);

////////////////////////////////////////////
//// FUNCTIONS RETURNING FUNCTIONS ////

const greet = function (greeting) {
  return function (name) {
    console.log(`${greeting} ${name}!`);
  };
};

const greeterHey = greet('Hey');
console.log(greeterHey);

greeterHey('Jonas');
greeterHey('Steven');
greet('Hello')('Joseph');

// Same with arrow functions
const greet2 = greeting => name => console.log(`${greeting} ${name}!`);

greet2('Wassup')('Joseph');

////////////////////////////////////////////
//// THE CALL AND APPLY METHODS ////

const lufthansa = {
  airline: 'Lufthansa',
  iataCode: 'LH',
  bookings: [],
  // book: function() {} //This is the old syntax
  book(flightNum, name) {
    console.log(
      `${name} booked a seat on ${this.airline} flight ${this.iataCode}${flightNum}`
    );
    this.bookings.push({ flight: `${this.iataCode}${flightNum}`, name });
  },
};

lufthansa.book(239, 'Lebron James');
lufthansa.book(635, 'Barack Obama');
console.log(lufthansa);

const eurowings = {
  airline: 'Eurowings',
  iataCode: 'EW',
  bookings: [],
};

const book = lufthansa.book;

// THE CALL METHOD

//Error bc the keyword this will point to undifined
// book(23, 'Jr Smith');

//The call method will here set the this keyword to eurowings. We manually and explicitly set the this keyword.
book.call(eurowings, 23, 'JR Smith');
console.log(eurowings);
book.call(lufthansa, 239, 'Mary Cooper');
console.log(lufthansa);

const swiss = {
  airline: 'Swiss Air Lines',
  iataCode: 'LX',
  bookings: [],
};

book.call(swiss, 583, 'Mary Cooper');
console.log(swiss);

// THE APPLY METHOD
const flightData = [583, 'George Cooper'];
book.apply(swiss, flightData);
console.log(swiss);

//Even with an array we can still use the call method
book.call(swiss, ...flightData);

////////////////////////////////////////////
//// THE BIND METHOD ////
// The difference with the first methods is that bind doesn't immediately call the function but instead it returns a new function where the this keyword is bound

const bookEW = book.bind(eurowings);
const bookLX = book.bind(swiss);
const bookLH = book.bind(lufthansa);
bookEW(23, 'Steven Williams');

// it's called a Partial Application
const bookEW23 = book.bind(eurowings, 23);
bookEW23('Steven Adams');

// With Event Listeners
lufthansa.planes = 300;
lufthansa.buyPlane = function () {
  console.log(this);
  this.planes++;
  console.log(this.planes);
};

// Doesn't work bc the this keyword will point to the button element
// document.querySelector('.buy').addEventListener('click', lufthansa.buyPlane);

document
  .querySelector('.buy')
  .addEventListener('click', lufthansa.buyPlane.bind(lufthansa));

// Partial Application
const addTax = (rate, value) => value + value * rate;
console.log(addTax(0.1, 200));

const addVAT = addTax.bind(null, 0.23);
// addTax = value => value + value * 0.23;
console.log(addVAT(200));

//Small challenge:
const addTax2 = function (rate) {
  return function (value) {
    return value + value * rate;
  };
};
const addVAT2 = addTax2(0.23);
console.log(addVAT2(200));

const addTax3 = rate => value => value + value * rate;
const addVAT3 = addTax3(0.23);
console.log(addVAT3(200));

////////////////////////////////////////////
//// Coding Challenge #1 ////

/*
Let's build a simple poll app!

A poll has a question, an array of options from which people can choose, and an array with the number of replies for each option. This data is stored in the starter object below.

GOOD LUCK 😀
*/

// Here are your tasks:

// 1. Create a method called 'registerNewAnswer' on the 'poll' object. The method does 2 things:
//   1.1. Display a prompt window for the user to input the number of the selected option. The prompt should look like this:
//         What is your favourite programming language?
//         0: JavaScript
//         1: Python
//         2: Rust
//         3: C++
//         (Write option number)
//   1.2. Based on the input number, update the answers array. For example, if the option is 3, increase the value AT POSITION 3 of the array by 1. Make sure to check if the input is a number and if the number makes sense (e.g answer 52 wouldn't make sense, right?)

const poll = {
  question: 'What is your favourite programming language?',
  options: ['JavaScript', 'Python', 'Rust', 'C++'],
  // This generates [0, 0, 0, 0]. More in the next section 😃
  answers: new Array(4).fill(0),
  // displayResults: function (type = 'array') {
  //   if (type === 'array') console.log(this.answers);
  //   else if (type === 'string') {
  //     console.log(`Poll results are ${this.answers}`);
  //   } else alert('Invalid Type');
  // },
  registerNewAnswer: function () {
    let text = this.question + '\n';
    for (const [key, opt] of this.options.entries()) {
      text += `${key}: ${opt} \n`;
    }
    text += '(Write option number)';
    const answer = Number(prompt(text));
    if (answer > 0 && answer < 5 && Number.isInteger(answer)) {
      this.answers[answer - 1]++;
      // console.log(this.answers);
    } else {
      alert('Invalid Answer!');
    }
    this.displayResults();
    this.displayResults('string');
  },
};

// 2. Call this method whenever the user clicks the "Answer poll" button.

document
  .querySelector('.poll')
  .addEventListener('click', poll.registerNewAnswer.bind(poll));

// 3. Create a method 'displayResults' which displays the poll results. The method takes a string as an input (called 'type'), which can be either 'string' or 'array'. If type is 'array', simply display the results array as it is, using console.log(). This should be the default option. If type is 'string', display a string like "Poll results are 13, 2, 4, 1".

poll.displayResults = function (type = 'array') {
  if (type === 'array') console.log(this.answers);
  else if (type === 'string') {
    console.log(`Poll results are ${this.answers.join(', ')}`);
  } else alert('Invalid Type');
};

// 4. Run the 'displayResults' method at the end of each 'registerNewAnswer' method call.

// HINT: Use many of the tools you learned about in this and the last section 😉

// BONUS: Use the 'displayResults' method to display the 2 arrays in the test data. Use both the 'array' and the 'string' option. Do NOT put the arrays in the poll object! So what shoud the this keyword look like in this situation?

// BONUS TEST DATA 1: [5, 2, 3]
// BONUS TEST DATA 2: [1, 5, 3, 9, 6, 1]

const testData1 = {
  answers: [5, 2, 3],
};
const testData2 = {
  answers: [1, 5, 3, 9, 6, 1],
};
poll.displayResults.call(testData1);
poll.displayResults.call(testData2, 'string');

poll.displayResults.call({ answers: [5, 2, 3] }, 'string');
poll.displayResults.call({ answers: [1, 5, 3, 9, 6, 1] });

////////////////////////////////////////////
//// Immediately Invoked Function Expressions (IIFE) ////

const runOnce = function () {
  console.log('This will never run again');
};

runOnce();

// Thanks to the parentheses around the function, we transformed the statement into an expression
// Then with the parentheses at the end we call the function immediately
// So this pattern is called a Immmediately Invoked Function Expression (IIFE)
(function () {
  console.log('This will never run again');
})();

// Same with an arrow function
(() => console.log('This will never run again'))();

{
  const isPrivate = 23;
  var notPrivate = 46;
}

// console.log(isPrivate);
console.log(notPrivate);

////////////////////////////////////////////
//// Closures ////

const secureBooking = function () {
  let passengerCount = 0;

  return function () {
    passengerCount++;
    console.log(`${passengerCount} passengers`);
  };
};

const booker = secureBooking();

booker();
booker();
booker();

// /!\ IMPORTANT NOTE : Any function always has access to the variable environment of the exectution context in which the function was created !
// -> This is how the function "booker" will be able to read and manipulate the passengerCount variable.
// It's this connection that we call CLOSURE.

// Note 2 : The closure has priority over the scope chain.
// -> If there was a global passengerCount variable set to 10, it would still first use the one in the closure.

console.dir(booker); // In Scopes we can see the Closure

////////////////////////////////////////////
//// More Closure Examples ////

// Example 1
let f;

const g = function () {
  let a = 23;
  f = function () {
    a *= 2;
    console.log(a * 2);
  };
};
const h = function () {
  let b = 777;
  f = function () {
    b *= 2;
    console.log(b * 2);
  };
};

g();
f();
f();

// Re-assigning f function
h();
f();
f();
console.dir(f);

// Re-assigning f function
g();
f();
console.dir(f);

// Example 2
const boardPassengers = function (n, wait) {
  const perGroup = n / 3;

  setTimeout(function () {
    console.log(`We are now boarding all ${n} passengers`);
    console.log(`There are 3 groups, each with ${perGroup} passengers`);
  }, wait * 1000);
  console.log(`Will start boarding in ${wait} seconds`);
};

const perGroup = 10000; // Proof that the closure has priority on the global scope
boardPassengers(180, 3);

////////////////////////////////////////////
//// Coding Challenge #2 ////
/* 
This is more of a thinking challenge than a coding challenge 🤓

Take the IIFE below and at the end of the function, attach an event listener that changes the color of the selected h1 element ('header') to blue, each time the BODY element is clicked. Do NOT select the h1 element again!

And now explain to YOURSELF (or someone around you) WHY this worked! Take all the time you need. Think about WHEN exactly the callback function is executed, and what that means for the variables involved in this example.

GOOD LUCK 😀
*/

(function () {
  const header = document.querySelector('h1');
  header.style.color = 'red';
  document.querySelector('body').addEventListener('click', function () {
    header.style.color = 'blue';
  });
})();
