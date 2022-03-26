'strict mode';

const budget = Object.freeze([
  { value: 250, description: 'Sold old TV 📺', user: 'jonas' },
  { value: -45, description: 'Groceries 🥑', user: 'jonas' },
  { value: 3500, description: 'Monthly salary 👩‍💻', user: 'jonas' },
  { value: 300, description: 'Freelancing 👩‍💻', user: 'jonas' },
  { value: -1100, description: 'New iPhone 📱', user: 'jonas' },
  { value: -20, description: 'Candy 🍭', user: 'matilda' },
  { value: -125, description: 'Toys 🚂', user: 'matilda' },
  { value: -1800, description: 'New Laptop 💻', user: 'jonas' },
]);

// Note: Object.freeze only freezes the first level of the object... So we ca, still change objects inside of the object.
// budget[0].value = 1000;

// Object.freeze makes this object immutable
const spendingLimits = Object.freeze({
  jonas: 1500,
  matilda: 100,
});

// spendingLimits.jay = 200;

const getLimit = (limits, user) => limits?.[user] ?? 0;

// Pure function
const addExpense = function (
  state,
  limits,
  value,
  description,
  user = 'jonas'
) {
  const cleanUser = user.toLowerCase();
  // if (value <= getLimit(cleanUser))
  //   // By doing budget.push we manipulate an object that is outside of the function.. So the function produces a side effect and is called an impure function
  //   // budget.push({ value: -value, description, user: cleanUser });

  //   //We want to create a new object based on the state that we received:
  //   // We create an erray an we use the spread operator to put all the elements of the state inside so it's create a copy of the state array, and then we add the new element in this array
  //   return [...state, { value: -value, description, user: cleanUser }];

  //Then we need to return the original array if value > limit

  return value <= getLimit(limits, cleanUser)
    ? [...state, { value: -value, description, user: cleanUser }]
    : state;
};

const newBudget1 = addExpense(budget, spendingLimits, 10, 'Pizza 🍕');
const newBudget2 = addExpense(
  newBudget1,
  spendingLimits,
  100,
  'Going to movies 🍿',
  'Matilda'
);
const newBudget3 = addExpense(newBudget2, spendingLimits, 200, 'Stuff', 'Jay');
console.log(newBudget3);

// const checkExpenses = function (state, limits) {
//   // for (const entry of state)
//   //   if (entry.value < -getLimit(limits, entry.user)) {
//   //     entry.flag = 'limit';
//   //   }
//   // map will create a brand new array and that's what we want
//   return state.map(entry => {
//     return entry.value < -getLimit(limits, entry.user)
//       ? { ...entry, flag: 'limit' }
//       : entry;
//   });
// };
//Pure function
const checkExpenses = (state, limits) =>
  state.map(entry =>
    entry.value < -getLimit(limits, entry.user)
      ? { ...entry, flag: 'limit' }
      : entry
  );
const finalBudget = checkExpenses(newBudget3, spendingLimits);

console.log(finalBudget);

//Impure function bc it logs something
const logBigExpenses = function (state, bigLimit) {
  const bigExpenses = state
    .filter(entry => entry.value <= -bigLimit)
    .map(entry => entry.description.slice(-2))
    .join(' / ');
  // .reduce((str, cur) => `${str} / ${cur.description.slice(-2)}`, ''); //reduce takes all the values in one array (str is the accumulator and cur is the current value, then we have the callback and then the initial value)
  console.log(bigExpenses);
  // let output = '';
  // for (const entry of budget)
  //   output +=
  //     entry.value <= -bigLimit ? `${entry.description.slice(-2)} / ` : '';
  // output = output.slice(0, -2); // Remove last '/ '
  // console.log(output);
};

logBigExpenses(finalBudget, 1000);
