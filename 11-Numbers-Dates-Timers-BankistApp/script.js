'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2021-12-31T17:01:17.194Z',
    '2022-01-05T23:36:17.929Z',
    '2022-01-07T09:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);
  console.log(new Date());
  console.log(date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  let dates = [];
  if (sort) {
    let index = 0;
    movs.forEach(function (_, i) {
      index = acc.movements.indexOf(movs[i]);
      dates.push(acc.movementsDates[index]);
    });
  } else dates = acc.movementsDates;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(dates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${formatCur(
    acc.balance,
    acc.locale,
    acc.currency
  )}`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    //In each call, print the remaining time to the UI
    labelTimer.textContent = `${min}:${sec}`;

    //When 0 seconds, stop time and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }

    //Decreas 1z
    time--;
  };
  //Set Time to 5 minutes
  let time = 120;
  //Call the time every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timerAccount;

// //FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

// 'the language - the country'

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // SETTING THE TIME
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      // month: '2-digit',
      // month: 'long',
      year: 'numeric',
      // weekday: 'long',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    // const locale = navigator.language;
    // console.log(locale);
    // labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(
    //   now
    // );
    // labelDate.textContent = new Intl.DateTimeFormat('fr-BE', options).format(now);
    // labelDate.textContent = new Intl.DateTimeFormat('en-US', options).format(now);
    // labelDate.textContent = new Intl.DateTimeFormat('en-GB').format(now);
    // labelDate.textContent = new Intl.DateTimeFormat('ar-SY').format(now);
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Time
    if (timerAccount) clearInterval(timerAccount);
    timerAccount = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Add date with the current date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    //Reset the timer
    clearInterval(timerAccount);
    timerAccount = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      //Add date with the current date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      //Reset the timer
      clearInterval(timerAccount);
      timerAccount = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

console.log(23 === 23.0);

// Base 10 - 0 to 9
// Binary base 2 - 0 1
console.log(0.1 + 0.2);

console.log(0.1 + 0.2 === 0.3); //Flase bc error in Javascript that we have to accept

console.log(Number('23'));
console.log(+'23'); // Way to transform the string into a number bc when javascript see the plus operator, it automatically converts all the operands to numbers

// Parsing
// We can parse a number from a string
console.log(Number.parseInt('30px')); //Javascript will automaticcaly try to figure out the number that is in the string
console.log(Number.parseInt('e30')); //The string need to start with a number
console.log(Number.parseInt('30px', 10)); // Accept a second arugment : THE REGEX. It's the base of the numeral system that we are using

console.log(Number.parseFloat('   2.5rem  '));
console.log(Number.parseInt(' 2.5rem '));

// Check if a value is not a number (NaN)
console.log(Number.isNaN(20));
console.log(Number.isNaN('20'));
console.log(Number.isNaN(+'20X'));
console.log(Number.isNaN(20 / 0)); //It give us "infinity", so returns false

// Check if a value is a number
console.log(Number.isFinite(20)); ///Better way to check if it's a number or not bc isNaN don't consider the infinity case
console.log(Number.isFinite('20'));
console.log(Number.isFinite(20.3));
console.log(Number.isFinite(+'20X'));
console.log(Number.isFinite(20 / 0));

// Check if a value is an integer
console.log(Number.isInteger(23));
console.log(Number.isInteger(23.0));
console.log(Number.isInteger(23.4));
console.log(Number.isInteger(23 / 0));

/////////////////////////////////////////////////
//// MATH AND ROUNDING ////

// Squared root and cubic root
console.log(Math.sqrt(25));
console.log(25 ** (1 / 2));
console.log(25 ** (1 / 3));

console.log(Math.max(5, 18, 23, 11, 2));
console.log(Math.max(5, 18, '23', 11, 2));
console.log(Math.max(5, 18, '23px', 11, 2));
console.log(Math.min(5, 18, 23, 11, 2));

// Area of a circle
console.log(Math.PI * Number.parseFloat('10px') ** 2);

// Random number between 1 and 6
// Math.trunc removes the decimal part
console.log(Math.trunc(Math.random() * 6) + 1);

// Give a random number between 2 values
const randomInt = (min, max) =>
  Math.trunc(Math.random() * (max - min) + 1) + min;
console.log(randomInt(10, 20));

//Rounding integers
console.log(Math.trunc(23.3));
console.log(Math.round(23.3));
console.log(Math.trunc(23.9));
console.log(Math.round(23.9));

console.log(Math.ceil(23.3));
console.log(Math.ceil(23.9));

console.log(Math.floor(23.3));
console.log(Math.floor('23.9'));

// trunc and floor do the same when we're dealing with positve numbers
// However, with negative numbers, trunc do the same than ceil
console.log(Math.trunc(-23.3));
console.log(Math.floor(-23.3));
console.log(Math.ceil(-23.9));

//Rounding decimals
console.log((2.7143).toFixed(2));
console.log((2.7163).toFixed(2));
console.log((2.7).toFixed(4));

/////////////////////////////////////////////////
//// The Remainder Operator ////
console.log(5 % 2);

// The remainder (modulo) is useful to know if a number is even or not
const isEven = n => n % 2 === 0;
console.log(isEven(4));
console.log(isEven(5));

labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    // 0 2 4 6
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';
    // 0 3 6 9
    if (i % 3 === 0) row.style.backgroundColor = 'blue';
  });
});

/////////////////////////////////////////////////
//// Numeric Separators ////

//The underscore is juste useful to read the number in the code
// We can place it anywhere we want

// 287,460,000,000
const diameter = 287_460_000_000;
console.log(diameter);

const priceCents = 345_99;
console.log(priceCents);

const transferFee1 = 15_00;
const transferFee2 = 1_500;

// Doesn't work when it comes from a string ofc
console.log(Number('230_000'));

/////////////////////////////////////////////////
//// Working with BigInt ////

// Any integer larger than this is not safe, i.e cannot be respresented accurately
console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);
console.log(2 ** 53 + 1); //We can see that it's not correct compared to 2**53 - 1
console.log(2 ** 53 + 2);
console.log(2 ** 53 + 3);
console.log(2 ** 53 + 4);

// If I add n,the regular number become a bigInt number
console.log(47573299747929719397379379397464398643896n);
console.log(BigInt(47573299747929719397379379397464398643896));

// Operations
console.log(10000n + 10000n);
console.log(326484634986396102163026467389463948397n * 100000n);

const huge = 4348639436493236128913n;
const num = 23;
// console.log(huge * num); //Cannot do it
console.log(huge * BigInt(num));

console.log(20n > 15);
console.log(20n == 20);
console.log(20n === 20);
console.log(typeof 20n);

console.log(huge + 'is REALLY big !!!'); //Here huge is converted to a string

//Divisions
console.log(10n / 3n); //It returns the closest bigInt
console.log(10 / 3);

/////////////////////////////////////////////////
//// Creating Dates ////

// Create a date
const rightNow = new Date();
console.log(rightNow);

console.log(new Date('Thu Jan 06 2022 17:24:15'));
console.log(new Date('December 24, 2015'));
console.log(new Date(account1.movementsDates[0]));
console.log(new Date(2037, 10, 19, 15, 23, 5)); //The month is zero based in Javascript !!
console.log(new Date(2037, 10, 31)); // There is no November 31 so Javascript converts it to December 1
console.log(new Date(2037, 10, 33));

console.log(new Date(0));
console.log(new Date(3 * 24 * 60 * 60 * 1000)); //menas 3 days in milliseconds

// Working with dates
const future = new Date(2037, 10, 19, 15, 23);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth()); //In zero base
console.log(future.getDate()); //Give the day
console.log(future.getDay()); //GIve the day of the week (Zero is sunday)
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());

console.log(future.toISOString()); //Give the ISO string

console.log(future.getTime()); //Time past since Date(0), i.e January 1, 1970 -> Return 2142253380000

console.log(new Date(2142253380000));

console.log(Date.now());

future.setFullYear(2040); //setMonth, setDate, ...
console.log(future);

const x = [3, 4, 2, 0, 9];
const y = ['time3', 'time4', 'time2', 'time0', 'time9'];
const xSort = [0, 2, 3, 4, 9];
const ySort = [];

console.log(xSort[0]);
console.log(x.indexOf(9));

let index = 0;
xSort.forEach(function (mov, i) {
  index = x.indexOf(xSort[i]);
  ySort.push(y[index]);
});

console.log(index);
console.log(ySort);

/////////////////////////////////////////////////
//// Operations With Dates ////

const futuree = new Date(2037, 10, 19, 15, 23);
console.log(futuree);
console.log(Number(futuree)); //We now have the date in milliseconds

// The difference between 2 dates will be in milliseconds
// So we convert it in days
const DaysPassed = (date1, date2) =>
  Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

const days1 = DaysPassed(new Date(2037, 3, 14), new Date(2037, 3, 24));
console.log(days1);

/////////////////////////////////////////////////
//// Internationalizing Numbers (Int) ////

const nuum = 4232368.34;

const options = {
  style: 'unit', // unit, percent or currency
  unit: 'mile-per-hour',
  // currency = 'EUR'
  // useGrouping: false
};

console.log('US:', new Intl.NumberFormat('en-US', options).format(nuum));
console.log('Germany:', new Intl.NumberFormat('de-DE', options).format(nuum));
console.log('Syria:', new Intl.NumberFormat('ar-SY', options).format(nuum));
console.log(
  navigator.language,
  new Intl.NumberFormat(navigator.language, options).format(nuum)
);

/////////////////////////////////////////////////
//// Timers: set Timeout and setInterval ////

setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2}`),
  3000,
  'salami',
  'mushrooms'
);

const ingredients = ['olives', 'spinach'];
const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2}`),
  3000,
  ...ingredients
);
console.log('Waiting...');

if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

//setInterval
setInterval(function () {
  const now = new Date();
  console.log(now);
}, 1000);
