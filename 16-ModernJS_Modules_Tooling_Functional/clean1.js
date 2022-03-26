const budget = [
  { value: 250, description: 'Sold old TV 📺', user: 'jonas' },
  { value: -45, description: 'Groceries 🥑', user: 'jonas' },
  { value: 3500, description: 'Monthly salary 👩‍💻', user: 'jonas' },
  { value: 300, description: 'Freelancing 👩‍💻', user: 'jonas' },
  { value: -1100, description: 'New iPhone 📱', user: 'jonas' },
  { value: -20, description: 'Candy 🍭', user: 'matilda' },
  { value: -125, description: 'Toys 🚂', user: 'matilda' },
  { value: -1800, description: 'New Laptop 💻', user: 'jonas' },
];

const spendinglimits = {
  jonas: 1500,
  matilda: 100,
};

const getLimit = user => spendinglimits?.[user] ?? 0;

const addExpense = function (value, description, user = 'jonas') {
  // if (!user) user = 'jonas';
  user = user.toLowerCase();

  // let limit;
  // if (spendinglimits[user]) {
  //   limit = spendinglimits[user];
  // } else {
  //   limit = 0;
  // }

  //Better:
  // const limit = spendinglimits[user] ? spendinglimits[user] : 0;
  // Even better:
  // const limit = spendinglimits?.[user] ?? 0;
  // const limit = getLimit(user);

  if (value <= getLimit(user)) {
    // budget.push({ value: -value, description: description, user: user });
    budget.push({ value: -value, description, user });
  }
};
addExpense(10, 'Pizza 🍕');
addExpense(100, 'Going to movies 🍿', 'Matilda');
addExpense(200, 'Stuff', 'Jay');
console.log(budget);

const checkExpenses = function () {
  for (const entry of budget) {
    // let lim;
    // if (spendinglimits[entry.user]) {
    //   lim = spendinglimits[entry.user];
    // } else {
    //   lim = 0;
    // }
    // const lim = spendinglimits?.[entry.user] ?? 0;
    // const lim = getLimit(entry.user);
    if (entry.value < -getLimit(entry.user)) {
      entry.flag = 'limit';
    }
  }
};
checkExpenses();

console.log(budget);

const logBigExpenses = function (bigLimit) {
  let output = '';
  for (const entry of budget) {
    // if (entry.value <= -bigLimit) {
    //   // output += entry.description.slice(-2) + ' / '; // -2 bc emojis are 2 characters
    //   output += `${entry.description.slice(-2)} / `;
    // }
    output +=
      entry.value <= -bigLimit ? `${entry.description.slice(-2)} / ` : '';
  }
  output = output.slice(0, -2); // Remove last '/ '
  console.log(output);
};

logBigExpenses(1000);
