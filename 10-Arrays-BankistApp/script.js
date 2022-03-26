'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

// Display the movements
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  // If sort it true, we want to display a sorted movements array but we do NOT want to sort the original array !!
  // This is why we use the slice method to create a a copy of the movements array

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">3 days ago</div>
      <div class="movements__value">${mov}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovements(account1.movements);
// console.log(containerMovements.innerHTML);

// Display the balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};
// calcDisplayBalance(account1.movements);

// Display the income, outcome et interest
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + Math.abs(mov), 0);
  labelSumOut.textContent = `${outcomes}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100) //Let's suppose there is an interest rate of 1.2%
    .filter(interest => interest >= 1) //Let's suppose the bank doesn't consider the interest if it's less than 1€
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};
// calcDisplaySummary(account1.movements);

//Creation of User names
// PROF
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.ursername = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (name) {
        return name[0];
      })
      .join('');
  });
};
createUsernames(accounts);
//MOI
// const createUsernames = function (user) {
//   const username = user
//     .toLowerCase()
//     .split(' ')
//     .map(function (name) {
//       return name[0];
//     })
//     .join('');
//   return username;
// };
// for (const acc of accounts) {
//   acc.username = createUsernames(acc.owner);
// }
// console.log(accounts);

// Updating the interface
const updateUI = function (acc) {
  //Display movements
  displayMovements(acc.movements);
  // Display balance
  calcDisplayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
};

//Event handler
let currentAccount;

// LOGIN TO AN ACCOUNT
btnLogin.addEventListener('click', function (e) {
  // e is the event parameter
  e.preventDefault(); //By default the button reload the page cause it's a button in a form element (see html file) but we don't want it.

  currentAccount = accounts.find(
    acc => acc.ursername === inputLoginUsername.value
  );
  // console.log(currentAccount);

  //Same than if (currentAccount && courrentAccount.pin === ...)
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;

    //Clear inputs fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); //Avoid to keep the focus on pin
    inputLoginUsername.blur();

    //Update UI
    updateUI(currentAccount);
  }
});

// DOING A TRANSFER OF MONEY
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.ursername === inputTransferTo.value
  );
  console.log(amount, receiverAcc);

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.ursername !== currentAccount.ursername
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Update UI
    updateUI(currentAccount);

    //Clear inputs fields
    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferAmount.blur(); //Avoid to keep the focus on pin
    inputTransferTo.blur();
  }
});

//CLOSING AN ACCOUNT
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.ursername &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.ursername === currentAccount.ursername
      // The findIdex method will return the firt index in the array that matches this condition
    );

    // Delete account
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;

    //Clear inputs fields
    inputCloseUsername.value = inputClosePin.value = '';
    inputCloseUsername.blur(); //Avoid to keep the focus on pin
    inputClosePin.blur();
  }
});

//REQUEST A LOAN
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //ADD movement
    currentAccount.movements.push(amount);

    //Update UI
    updateUI(currentAccount);

    //Clear inputs fields
    inputLoanAmount.value = '';
    inputLoanAmount.blur();
  }
});

// IMPLEMENTING THE SORTING FUNCTIONALITY
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

//// Simple Array Methods ////
let arr = ['a', 'b', 'c', 'd', 'e'];

//SLICE
// Doesn't change the original array
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(1, -1));
console.log(arr.slice()); //Shallow copy of the array
console.log([...arr]); //Shallow copy using the spread operator

//SPLICE
//Splice modify the original array
arr.splice(-1);
console.log(arr);
console.log(arr.splice(1, 2));

//REVERSE
//Reverse the orignial array
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

//CONCAT
const letters = arr.concat(arr2);
console.log(letters);
console.log(arr);
console.log([...arr, ...arr2]);

//JOIN
console.log(letters.join(' - '));

// From previous section :
//PUSH
//SHIFT
//POP
//IndexOf
//Include

/////////////////////////////////////////////////
//// The at method ////

const arrr = [23, 11, 64];
console.log(arrr[0]);
console.log(arrr.at(0));

//Getting last array element
console.log(arrr[arrr.length - 1]);
console.log(arrr.slice(-1));
console.log(arrr.slice(-1)[0]);
console.log(arrr.at(-1));

console.log('jonas'.at(3));

/////////////////////////////////////////////////
//// Looping Arrays: forEach ////
const movementsAccount = [200, 450, -400, 3000, -650, -130, 70, 1300];
for (const movement of movementsAccount) {
  if (movement > 0) console.log(`You deposited ${movement}`);
  else console.log(`You withdrew ${Math.abs(movement)}`);
}

console.log('--- FOR EACH ---');
// We give the forEACH instructions by giving it a CALLBACK FUNCTION which contains the instructions
movementsAccount.forEach(function (movement) {
  if (movement > 0) console.log(`You deposited ${movement}`);
  else console.log(`You withdrew ${Math.abs(movement)}`);
});

//0: function(200)
//1: function(450)
//2: function(400)
// ...

for (const [i, movement] of movementsAccount.entries()) {
  if (movement > 0) console.log(`Movement ${i + 1}: You deposited ${movement}`);
  else console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
}

console.log('--- FOR EACH ---');
// We give the forEACH instructions by giving it a CALLBACK FUNTION which contains the instructions
// The first parameter always need to be the current element, the second parameter is the current index and the third one is the entire array that we are looping over.
movementsAccount.forEach(function (mov, i, arr) {
  if (mov > 0) console.log(`Movement ${i + 1}: You deposited ${mov}`);
  else console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
});

// NOTE: Big difference between the for of loop and forEach method: We cannot break a forEach loop so it will always loop over the entire array

/////////////////////////////////////////////////
//// forEach With Maps and Sets ////

//Map
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (currentValue, key, entireMap) {
  console.log(`${key}: ${currentValue}`);
});

//Set
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);

currenciesUnique.forEach(function (value, key, set) {
  console.log(`${key}: ${value}`);
});

// Sets don't have a key!!
// However it was decided to keep the same signature, so to keep the same paramters if the forEach method is used for an array, a map or a set.
// So we can do this:
currenciesUnique.forEach(function (value, _, set) {
  console.log(`${value}`);
});

///////////////////////////////////////
//// Coding Challenge #1 ////

/*
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

GOOD LUCK 😀
*/

//Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

const checkDogs = function (dogsJulia, dogsKate) {
  const realDogsJulia = dogsJulia.slice(1, -2);
  console.log(realDogsJulia);
  const allDogs = realDogsJulia.concat(dogsKate);
  allDogs.forEach(function (age, number) {
    if (age >= 3)
      console.log(
        `Dog number ${number + 1} is an adult, and is ${age} years old`
      );
    else console.log(`Dog number ${number + 1} is still a puppy 🐶`);
  });
};

checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

//1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)

//2. Create an array with both Julia's (corrected) and Kate's data
//3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
//4. Run the function for both test datasets

//HINT: Use tools from all lectures in this section so far 😉

//TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
//TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

/////////////////////////////////////////////////
//// The map Method ////
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const eurToUsd = 1.1;

const movementsUSD = movements.map(function (mov) {
  return mov * eurToUsd;
});
console.log(movements);
console.log(movementsUSD);

// Different way
const movementsUSDfor = [];
for (const mov of movements) movementsUSDfor.push(mov * eurToUsd);
console.log(movementsUSDfor);

const movementsUSD2 = movements.map(mov => mov * eurToUsd);
console.log(movementsUSD2);

const movementsDesriptions = movements.map((mov, i) => {
  return `Movement ${i + 1}: You ${
    mov > 0 ? 'desposited' : 'withdrew'
  } ${Math.abs(mov)}`;
});
console.log(movementsDesriptions);

/////////////////////////////////////////////////
//// The filter Method ////

console.log(movements);
const deposits = movements.filter(function (mov, index, array) {
  return mov > 0;
});
console.log(deposits);

// Other way to do the same thing
const depositsFor = [];
for (const mov of movements) if (mov > 0) depositsFor.push(mov);
console.log(depositsFor);

const withdrawals = movements.filter(function (mov, index, array) {
  return mov <= 0;
});
console.log(withdrawals);

/////////////////////////////////////////////////
//// The reduce Method ////

// With the reduce method the first parameter in the function is the accumulator !
// The accumulator is like a snowball
const balance = movements.reduce(function (acc, currValue, i, array) {
  console.log(`Itiration ${i}: ${acc}`);
  return acc + currValue; // it returns it to the accumulator
}, 0); // 0 is the initial value of the accumulator (it's 0 by default)
console.log(balance);

// Other way to do the same thing
let balance2 = 0;
for (const mov of movements) balance2 += mov;
console.log(balance2);

// With array function
const balance3 = movements.reduce((acc, currValue) => acc + currValue, 0);
console.log(balance3);

// Max value
const max = movements.reduce(
  (acc, currValue) => (acc > currValue ? acc : currValue),
  movements[0]
);
console.log(max);

///////////////////////////////////////
//// Coding Challenge #2 ////

/*
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

const calcAverageHumanAge = function (ages) {
  const humanAges = ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age >= 18);
  console.log(humanAges);
  const averageAge =
    humanAges.reduce((sum, age) => sum + age, 0) / humanAges.length;
  console.log(averageAge);
  const averageAge2 = humanAges.reduce(
    (sum, age, _, array) => sum + age / array.length,
    0
  );
  console.log(averageAge2);
};
calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

///////////////////////////////////////
//// The Magic of Chaining Methods ////

// Pipeline
const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * eurToUsd)
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalDepositsUSD);

// We can inspect the array at any stage of the pipeline like this:
const totalDepositsUSD2 = movements
  .filter(mov => mov < 0)
  .map((mov, i, array) => {
    console.log(array);
    return mov * eurToUsd;
  })
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalDepositsUSD2);

///////////////////////////////////////
//// Coding Challenge #3 ////

/*
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

const calcAverageHumanAge2 = ages =>
  ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((sum, age, _, array) => sum + age / array.length, 0);

const avg1 = calcAverageHumanAge2([5, 2, 4, 1, 15, 8, 3]);
const avg2 = calcAverageHumanAge2([16, 6, 10, 5, 6, 1, 4]);

console.log(avg1, avg2);

///////////////////////////////////////
//// The find Method ////

// The find method will return the first element of the array that satisfy the condition
// The find method returns the element itself (not an array like the filter method)
const firstWithdrawal = movements.find(mov => mov < 0);
console.log(movements);
console.log(firstWithdrawal);

console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);

for (const acc of accounts) {
  if (acc.owner === 'Jessica Davis') {
    const account2 = acc;
    break;
  }
}
console.log(account2);

///////////////////////////////////////
//// some and every ////

console.log(movements);

// EQUALITY
console.log(movements.includes(-130));
//returns true is at least one element is equal to -130

// CONDITION
console.log(movements.some(mov => mov === -130));

const anyDeposits = movements.some(mov => mov > 1500);
//returns true if at least one element satisfy the conditon
console.log(anyDeposits);

//EVERY
// Returns true if ALL the elements in the array statisfy the condition
console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

// Separate callback
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));

///////////////////////////////////////
//// flat and flatMap ////

// FLAT
const arrrrrr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arrrrrr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat());
console.log(arrDeep.flat().flat());
console.log(arrDeep.flat(2)); //the level is 1 by default

const accountMovements = accounts.map(acc => acc.movements);
console.log(accountMovements);
const allMovements = accountMovements.flat();
console.log(allMovements);
const overalBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance);

const overalBalance2 = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance2);

// FLATMAP
// It does map and then flat in only one method
// Note: the flat goes only 1 level deep here and we can't change it
const overalBalance3 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance3);

///////////////////////////////////////
//// Sorting Arrays ////

// Strings
const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort());

//Numbers
console.log(movements);
console.log(movements.sort()); // not the result expected
// the sort method does the sorting based on strings!

// ASCENDING
// if it returns < 0, A before B
// if it returns > 0, B before A
console.log(movements.sort((a, b) => a - b));

//We could do it
console.log(
  movements.sort((a, b) => {
    if (a > b) return 1;
    if (a < b) return -1;
  })
);

// DESCENDING
console.log(movements.sort((a, b) => b - a));
//We could do it
console.log(
  movements.sort((a, b) => {
    if (a > b) return -1;
    if (a < b) return 1;
  })
);

///////////////////////////////////////
//// More Ways of Creating and Filling Arrays ////

console.log([1, 2, 3, 4, 5, 6, 7]);
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// EMPTY ARRAYS + FILL METHOD
const x = new Array(7); // Create an array of 7 empty elements
console.log(x);

console.log(x.map(() => 5)); // It's doing nothing. We can't call the map method on an empty array

// The only method that we can call on an ampty array it the FILL method
x.fill(1);
console.log(x);

// 2 is the value with which we want to fill the array
// 3 is a begin parameter. It's specify the index where we want to start to fill the array
// 5 is a end paramater. It's specify the index where we want to stop to fill the array
x.fill(2, 3, 5);
console.log(x);

const y = [1, 2, 3, 4, 5, 6, 7];
y.fill(23, 2, 6);
console.log(y);

//Array.from
//The first argument is an object through which we can pass the lenght property
// The second argumentis a mapping method
const z = Array.from({ length: 7 }, () => 1);
console.log(z);

const zz = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(zz);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  // We can put the map method directly in Array.from
  console.log(movementsUI);

  // Second method
  // But we have to do the mapping separatly with this method
  const movementsUI2 = [...document.querySelectorAll('.movements__value')];
  console.log(movementsUI2.map(el => Number(el.textContent.replace('€', ''))));
});

///////////////////////////////////////
//// Array Methods Practice ////

//Exercice 1 : Get the sum of all the desposits
//ME
let desposits = 0;
accounts.forEach(function (acc) {
  acc.movements.forEach(function (mov) {
    if (mov > 0) desposits += mov;
  });
});
console.log(desposits);
//PROF
const bankDepositSum = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce(function (acc, mov) {
    if (mov > 0) return acc + mov;
    else return acc;
  }, 0);
console.log(bankDepositSum);
// simplify:
const bankDepositSum2 = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, mov) => sum + mov, 0);
console.log(bankDepositSum2);

//Exercice 2: How many deposits there have been with at least $1,000
let countDesposits1000 = 0;
accounts.forEach(function (acc) {
  acc.movements.forEach(function (mov) {
    if (mov >= 1000) countDesposits1000++;
  });
});
console.log(countDesposits1000);
//or
const countDesposits1000prim = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov >= 1000).length;
console.log(countDesposits1000prim);
//or
const countDesposits1000primprim = accounts
  .flatMap(acc => acc.movements)
  .reduce((sum, mov) => (mov >= 1000 ? ++sum : sum), 0);
console.log(countDesposits1000primprim);

// Recap : prefixed ++ operator
let a = 10;
console.log(a++);
console.log(a);
console.log(++a);

// Exercice 3: Create an object which countains the sum of the deposits and of the withdrawals
//ME - Return an array
const objectDepositsAndWithdrawalsTest = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    function ([deposits, withdrawals], mov) {
      if (mov > 0) return [deposits + mov, withdrawals];
      else return [deposits, withdrawals + mov];
    },
    [0, 0]
  );
console.log(objectDepositsAndWithdrawalsTest);

//PROF - Return an object !
const objectDepositsAndWithdrawals = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, mov) => {
      // mov > 0 ? (sums.desposits += mov) : (sums.withdrawals += mov);
      // We can simplify by using the brackets notation instead of the dot notation
      sums[mov > 0 ? 'deposits' : 'withdrawals'] += mov;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(objectDepositsAndWithdrawals);

console.log(
  objectDepositsAndWithdrawals.deposits,
  objectDepositsAndWithdrawals.withdrawals
);

//Exercice 4: Create a simple function to convert any string to a title case (all the world in a sentence are capitalized except some of them)
// Exemple: this is a nice title -> This Is a Nice Title

//ME - Test 1
const convertTitleCase = function (title) {
  const exceptions = ['a', 'an', 'the', 'and', 'but', 'or', 'on', 'in', 'with'];
  const lowerTitle = title.toLowerCase().split(' ');
  let newWords = [];
  for (const n of lowerTitle) {
    if (!exceptions.includes(n))
      newWords.push(n.replace(n[0], n[0].toUpperCase()));
    else newWords.push(n);
  }
  // console.log(newWords);
  const newTitle = newWords.join(' ');
  return newTitle.replace(newTitle[0], newTitle[0].toUpperCase());
};
console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));

//ME - 2
const convertTitleCase2 = function (title) {
  const exceptions = ['a', 'an', 'the', 'and', 'but', 'or', 'on', 'in', 'with'];
  const newTitle = title
    .toLowerCase()
    .split(' ')
    .map(n =>
      !exceptions.includes(n) ? n.replace(n[0], n[0].toUpperCase()) : n
    )
    .join(' ');

  return newTitle.replace(newTitle[0], newTitle[0].toUpperCase());
};
console.log(convertTitleCase2('this is a nice title'));
console.log(convertTitleCase2('this is a LONG title but not too long'));
console.log(convertTitleCase2('and here is another title with an EXAMPLE'));

//Prof
const convertTitleCase3 = function (title) {
  const capitalize = str => str.replace(str[0], str[0].toUpperCase());
  const exceptions = ['a', 'an', 'the', 'and', 'but', 'or', 'on', 'in', 'with'];
  const newTitle = title
    .toLowerCase()
    .split(' ')
    .map(n => (!exceptions.includes(n) ? capitalize(n) : n))
    .join(' ');

  return capitalize(newTitle);
};
console.log(convertTitleCase3('this is a nice title'));
console.log(convertTitleCase3('this is a LONG title but not too long'));
console.log(convertTitleCase3('and here is another title with an EXAMPLE'));

///////////////////////////////////////
// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).
*/
// HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
// HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

// TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// GOOD LUCK 😀

//1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)

dogs.forEach(function (dog) {
  dog.recommendedFood = dog.weight ** 0.75 * 28;
});
console.log(dogs);

//2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓

const SarahsDog = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(SarahsDog);
if (SarahsDog.curFood < SarahsDog.recommendedFood * 0.9) {
  console.log("Sarah's dog portion is smaller than the recommended portion");
} else if (SarahsDog.curFood > SarahsDog.recommendedFood * 1.1) {
  console.log("Sarah's dog portion is bigger than the recommended portion");
} else console.log("Sarah's dog portion is correct");

//3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
let ownersEatTooMuch = [];
let ownersEatTooLittle = [];
let ownersEatCorrectly = [];
let ownersEatExactly = false;

dogs.forEach(function (dog) {
  if (dog.curFood < dog.recommendedFood * 0.9) {
    ownersEatTooMuch.push(dog.owners);
  } else if (dog.curFood > dog.recommendedFood * 1.1) {
    ownersEatTooMuch.push(dog.owners);
  } else {
    ownersEatCorrectly.push(dog.owners);
    if ((dog.curFood = dog.recommendedFood)) ownersEatExactly = true;
  }
});

console.log(
  ownersEatTooMuch.flat(),
  ownersEatTooLittle.flat(),
  ownersEatCorrectly.flat()
);

//4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"

console.log(`${ownersEatTooMuch.flat().join(' and ')} dogs eat too much!`);
console.log(`${ownersEatTooLittle.flat().join(' and ')} dogs eat too little!`);
console.log(`${ownersEatCorrectly.flat().join(' and ')} dogs eat correctly!`);

// 5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
console.log(ownersEatCorrectly.length > 0);

// 6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
console.log(ownersEatExactly);

// 7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)

// DONE ALREADY
console.log(ownersEatCorrectly.flat());

// 8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

const dogsInOrder = dogs
  .slice()
  .sort((a, b) => a.recommendedFood - b.recommendedFood);

console.log(dogsInOrder);

// //CORRECTION PROF
// // 1.
// dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));

// // 2.
// const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
// console.log(dogSarah);
// console.log(
//   `Sarah's dog is eating too ${
//     dogSarah.curFood > dogSarah.recFood ? 'much' : 'little'
//   } `
// );

// // 3.
// const ownersEatTooMuch = dogs
//   .filter(dog => dog.curFood > dog.recFood)
//   .flatMap(dog => dog.owners);
// // .flat();
// console.log(ownersEatTooMuch);

// const ownersEatTooLittle = dogs
//   .filter(dog => dog.curFood < dog.recFood)
//   .flatMap(dog => dog.owners);
// console.log(ownersEatTooLittle);

// // 4.
// // "Matilda and Alice and Bob's dogs eat too much!"
// //  "Sarah and John and Michael's dogs eat too little!"
// console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
// console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);

// // 5.
// console.log(dogs.some(dog => dog.curFood === dog.recFood));

// // 6.
// // current > (recommended * 0.90) && current < (recommended * 1.10)
// const checkEatingOkay = dog =>
//   dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;

// console.log(dogs.some(checkEatingOkay));

// // 7.
// console.log(dogs.filter(checkEatingOkay));

// // 8.
// // sort it by recommended food portion in an ascending order [1,2,3]
// const dogsSorted = dogs.slice().sort((a, b) => a.recFood - b.recFood);
// console.log(dogsSorted);
