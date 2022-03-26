'use strict';

// Data needed for a later exercise
const flights =
  '_Delayed_Departure;fao93766109;txl2133758440;11:25+_Arrival;bru0943384722;fao93766109;11:45+_Delayed_Arrival;hel7439299980;fao93766109;12:05+_Departure;fao93766109;lis2323639855;12:30';

// Data needed for first part of the section

const weekDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const openingHourss = {
  [weekDays[3]]: {
    open: 12,
    close: 22,
  },
  [weekDays[4]]: {
    open: 11,
    close: 23,
  },
  [weekDays[5]]: {
    open: 0, // Open 24 hours
    close: 24,
  },
};

const restaurant = {
  name: 'Classico Italiano',
  location: 'Via Angelo Tavanti 23, Firenze, Italy',
  categories: ['Italian', 'Pizzeria', 'Vegetarian', 'Organic'],
  starterMenu: ['Focaccia', 'Bruschetta', 'Garlic Bread', 'Caprese Salad'],
  mainMenu: ['Pizza', 'Pasta', 'Risotto'],
  openingHours: openingHourss,

  order(starterIndex, mainIndex) {
    return [this.starterMenu[starterIndex], this.mainMenu[mainIndex]];
  },

  orderDelivery({ starterIndex = 1, mainIndex = 0, time = '20:00', address }) {
    console.log(
      `Order received! ${this.starterMenu[starterIndex]} and ${this.mainMenu[mainIndex]} will be delivered to ${address} at ${time}`
    );
  },

  orderPasta(ing1, ing2, ing3) {
    console.log(
      `Here is your delicious pasta with ${ing1}, ${ing2} and ${ing3}`
    );
  },

  orderPizza(mainIngredient, ...otherIngredients) {
    console.log(mainIngredient);
    console.log(otherIngredients);
  },
};

//// DESTRUCTURING ARRAYS ////

const arrrr = [2, 3, 4];
const aa = arrrr[0];
const bb = arrrr[1];
const cc = arrrr[2];

const [xx, yy, zz] = arrrr;
console.log(xx, yy, zz);
console.log(arrrr);

let [main, , secondary] = restaurant.categories;
console.log(main, secondary);

// switching variables

// const temp = main;
// main = secondary;
// secondary = temp;

[main, secondary] = [secondary, main];
console.log(main, secondary);

const [starter, mainCourse] = restaurant.order(2, 0);
console.log(starter, mainCourse);

// Nested destructuring
const nested = [2, 4, [5, 6]];
// const [i, , j] = nested;
// console.log(i, j);
const [i, , [j, k]] = nested;
console.log(i, j, k);

// Default values
const [p = 1, q = 1, r = 1] = [8, 9];
console.log(p, q, r);

//// DESTRUCTURING OBJECTS ////

const { name, openingHours, categories } = restaurant;
console.log(name, openingHours, categories);

const {
  name: restaurantName,
  openingHours: hours,
  categories: tags,
} = restaurant;
console.log(restaurantName, hours, tags);

const { menu = [], starterMenu: starters = [] } = restaurant;
console.log(menu, starters);

let a = 111;
let b = 999;
const obj = { a: 23, b: 7, c: 14 };

({ a, b } = obj);
console.log(a, b);

//Nested objects
const {
  fri: { open: o, close: c },
} = openingHours;
console.log(o, c);

restaurant.orderDelivery({
  time: '22:30',
  address: 'Via del Sole, 21',
  mainIndex: 2,
  starterIndex: 2,
});

restaurant.orderDelivery({
  address: 'Via del Sole, 21',
  starterIndex: 2,
});

//// THE SPREAD OPERAT0RS ////
const arr = [7, 8, 9];
const badNewArr = [1, 2, arr[0], arr[1], arr[2]];
console.log(badNewArr);

const newArr = [1, 2, ...arr];
console.log(newArr);

console.log(...newArr);

const newMenu = [...restaurant.mainMenu, 'Gnocci'];
console.log(newMenu);

//Copy array
const mainMenuCopy = [...restaurant.mainMenu];

//Join 2 arrays
const totalMenu = [...restaurant.starterMenu, ...restaurant.mainMenu];
console.log(totalMenu);

//Iterables : arrays, strings, maps, sets BUT NOT OBJECTS !
const str = 'Jonas';
const letters = [...str, ' ', 'S.'];

console.log(letters);
console.log(...str);

//Real-world example
const ingredients = [
  // prompt("Let's make pasta! Ingredient 1?"),
  // prompt('Ingredient 2?'),
  // prompt('Ingredient 3?'),
];
console.log(ingredients);

restaurant.orderPasta(ingredients[0], ingredients[1], ingredients[2]);
restaurant.orderPasta(...ingredients);

// objects
const newRestaurant = { founderIn: 1998, ...restaurant, founder: 'Guiseppe' };
console.log(newRestaurant);

const restaurantCopy = { ...restaurant };
restaurantCopy.name = 'Ristorante Roma';
console.log(restaurantCopy.name);
console.log(restaurant.name);

//// REST PATTERN AND PARAMETERS ////

// SPREAD, because on RIGHT side of =
const arrr = [1, 2, ...[3, 4]];

// REST, because on LEFT side of =
const [first, second, ...others] = [1, 2, 3, 4, 5];
console.log(first, second, others);

const [pizza, , risotto, ...otherFood] = [
  ...restaurant.mainMenu,
  ...restaurant.starterMenu,
];
console.log(pizza, risotto, otherFood);

//Objects
const { sat, ...weekdays } = restaurant.openingHours;
console.log(weekdays);

//2) Functions
const add = function (...numbers) {
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) sum += numbers[i];
  console.log(sum);
};
add(2, 3);
add(5, 3, 7, 2);
add(8, 2, 5, 3, 2, 1, 4);

const x = [23, 5, 7];
add(...x);

restaurant.orderPizza('mushrooms', 'onion', 'olive', 'pepperoni');
restaurant.orderPizza('mushrooms');

//// SHORT CIRCUITING (&& and ||) ////

// USE ANY data type, return ANY data type
console.log('-------- OR -------');
console.log(3 || 'Jonas');
console.log('' || 'Jonas');
console.log(true || 0);
console.log(undefined || null);

console.log(undefined || 0 || '' || 'Hello' || 23 || null);

restaurant.numGuests = 0;
const guests1 = restaurant.numGuests ? restaurant.numGuests : 10;
console.log(guests1);

const guests2 = restaurant.numGuests || 10;
console.log(guests2);

console.log('-------- AND -------');
console.log(0 && 'Jonas');
console.log(7 && 'Jonas');
console.log('Hello' && 23 && null && 'jonas');

if (restaurant.orderPizza) {
  restaurant.orderPizza('mushrooms', 'spinach', 'peperoni');
}

restaurant.orderPizza &&
  restaurant.orderPizza('mushrooms', 'spinach', 'peperoni');

//// The Nullish Coalescing Operator (??) ////

// Nullish: null and undifined (NOT 0 or '')
const guestCorrect = restaurant.numGuests ?? 10;
console.log(guestCorrect);

//// Local Assignment Operators ////
const rest1 = {
  name: 'Capri',
  numGuests: 0,
};

const rest2 = {
  name: 'La Piazza',
  owner: 'Giovanni Rossi',
};

// OR assignment operator
// rest1.numGuests = rest1.numGuests || 10;
// rest2.numGuests = rest2.numGuests || 10;
// rest1.numGuests ||= 10;
// rest2.numGuests ||= 10;

//nullish assignment operator
rest1.numGuests ??= 10;
rest2.numGuests ??= 10;

// AND assignment operator
// rest1.owner = rest1.owner && '<ANONYMOUS>';
// rest2.owner = rest2.owner && '<ANONYMOUS>';
rest1.owner &&= '<ANONYMOUS>';
rest2.owner &&= '<ANONYMOUS>';

console.log(rest1);
console.log(rest2);

//// LOOPING Arrays: The for-of Loop ////
const menuTot = [...restaurant.starterMenu, ...restaurant.mainMenu];

for (const item of menuTot) console.log(item);

for (const item of menuTot.entries()) {
  //console.log(item);
  console.log(`${item[0] + 1}: ${item[1]}`);
}

for (const [i, el] of menuTot.entries()) {
  // console.log(item);
  console.log(`${i + 1}: ${el}`);
}

console.log(menu.entries());

//// OPTIONAL CHAINING (?.) ////
console.log(restaurant.openingHours.mon);
// console.log(restaurant.openingHours.mon.open);
// undifined and then error bc the restaurant isn't opened on Monday

if (restaurant.openingHours && restaurant.openingHours.mon)
  console.log(restaurant.openingHours.mon.open);

// With optional chaining
console.log(restaurant.openingHours.mon?.open);
console.log(restaurant.openingHours?.mon?.open);
//avoid an error, if it doesn't exist it will return undefined

const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

for (const day of days) {
  console.log(day);
  const open = restaurant.openingHours[day]?.open ?? 'closed';
  if (open == 'closed') console.log(`On ${day}, we're closed`);
  else console.log(`On ${day}, we open at ${open}`);
}

//Methods
console.log(restaurant.order?.(0, 1) ?? 'Method does not exist');
console.log(restaurant.orderRisotto?.(0, 1) ?? 'Method does not exist');

//Arrays
const users = [{ name: 'Jonas', email: 'hello@jonas.io' }, 1, 2, 3];

console.log(users[0]?.name ?? 'User array empty');

if (users.length > 0) console.log(users[0].email);
else console.log('User array empty');

//// LOOPING OBJECTS : Object Keys, Values, and Entries ////

// Property NAMES
const properties = Object.keys(openingHours);
console.log(properties);

let openStr = `We are open on ${properties.length} days:`;

for (const day of properties) {
  openStr += `${day},`;
}

console.log(openStr);

// Property VALUES
const values = Object.values(openingHours);
console.log(values);

//Entire object
const entries = Object.entries(openingHours);
console.log(entries);

for (const [key, { open, close }] of entries) {
  // console.log(key, open, close);
  console.log(`On ${key} we open at ${open} and close at ${close}.`);
}

//// SETS ////
const ordersSet = new Set([
  'Pasta',
  'Pizza',
  'Pizza',
  'Risotto',
  'Pasta',
  'Pizza',
]);

console.log(ordersSet);
console.log(new Set('Jonas'));
console.log(ordersSet.size);
console.log(ordersSet.has('Pizza'));
console.log(ordersSet.has('Bread'));
ordersSet.add('Garlic Bread');
ordersSet.add('Garlic Bread');
ordersSet.delete('Risotto');
//ordersSet.clear();
console.log(ordersSet);
console.log(ordersSet[0]); // No indexes in a set

for (const order of ordersSet) console.log(order);

// Example
const staff = ['Waiter', 'Chef', 'Waiter', 'Manager', 'Chef', 'Waiter'];
const staffUnique1 = new Set(staff); //it's a set
const staffUnique = [...new Set(staff)]; //it's an array
console.log(staffUnique);
console.log(
  new Set(['Waiter', 'Chef', 'Waiter', 'Manager', 'Chef', 'Waiter']).size
);

console.log(new Set('killiangemoets').size);

//// MAPS ////
// it's like an object but the keys can be anything
const rest = new Map();
rest.set('name', 'Classico Italiano');
rest.set(1, ' Firenze, Italy');
console.log(rest.set(2, 'Lisbone, Portugal'));

rest
  .set('categories', ['Italian', 'Pizzeria', 'Vegetarian', 'Organic'])
  .set('open', 11)
  .set('close', 23)
  .set(true, 'We are open')
  .set(false, 'We are closed');

console.log(rest.get('name'));
console.log(rest.get(true));
console.log(rest.get(1));

const time = 21;
console.log(rest.get(time > rest.get('open') && time < rest.get('close')));

console.log(rest.has('categories'));
rest.delete(2);
//rest.clear();
console.log(rest);
console.log(rest.size);

rest.set([1, 2], 'Test');
console.log(rest.get([1, 2]));
// It doesn't work bc they aren't the same object in the heap
// See section objects vs primitives

const arrayy = [1, 2];
rest.set(arrayy, 'Test');
console.log(rest.get(arrayy));

// Also useful with dumb elements
rest.set(document.querySelector('h1'), 'Heading');
console.log(rest);

//// MAPS : Iteration ////
const question = new Map([
  ['question', 'What is the best programming language in the world ?'],
  [1, 'C'],
  [2, 'Java'],
  [3, 'JavaScript'],
  ['correct', 3],
  [true, 'Correct :D'],
  [false, 'Try again!'],
]);
console.log(question);

// Convert object to map
console.log(Object.entries(openingHourss));
const hoursMap = new Map(Object.entries(openingHourss));
console.log(hoursMap);

// Quiz map
console.log(question.get('question'));
for (const [key, value] of question) {
  if (typeof key === 'number') console.log(`Answer ${key}: ${value}`);
}
// const answer = Number(prompt('Your answer'));
const answer = 3;
console.log(answer);

// MOI
answer === question.get('correct')
  ? console.log(question.get(true))
  : console.log(question.get(false));

// PROF
console.log(question.get(answer === question.get('correct')));

// Convert map to array
console.log(...question);
console.log(...question.entries());
console.log(...question.keys());
console.log(...question.values());
console.log([...question.values()]);
console.log(question.values());

//// WORKING WITH STRINGS - Part 1 ////
const airline = 'TAP Air Portugal';
const plane = 'A320';

console.log(plane[0]);
console.log(plane[1]);
console.log(plane[2]);
console.log('B737'[0]);

console.log(airline.length);
console.log('B737'.length);

console.log(airline.indexOf('r'));
console.log(airline.lastIndexOf('r'));

console.log(airline.indexOf('Portugal'));
console.log(airline.indexOf('portugal'));

console.log(airline.slice(4));
//4 is the begin parameter, the parameter where the extraction will start
//This doesn't change the underlying string !!
console.log(airline.slice(4, 7));

console.log(airline.slice(0, airline.indexOf(' ')));
console.log(airline.slice(airline.lastIndexOf(' ') + 1));

console.log(airline.slice(-2));
console.log(airline.slice(1, -1));

const checkMiddleSeat = function (seat) {
  // B and E are middle seats
  const s = seat.slice(-1);
  if (s === 'B' || s === 'E') console.log('You got a middle seat');
  else console.log('You got lucky');
};

checkMiddleSeat('11B');
checkMiddleSeat('23C');
checkMiddleSeat('3E');

// Methods are only available on objects but when we use a method on a string, JavaScript automaticcaly (behind the scenes) convert that string primitive to a string object and the method is then called on that object. This process is called BOWING.
// What happens is this:
console.log(new String('Portugal'));
console.log(typeof new String('Portugal'));
console.log(typeof new String('Portugal').slice(1));

//// WORKING WITH STRINGS - Part 2 ////

console.log(airline.toLowerCase());
console.log(airline.toUpperCase());

//Fix capitalization in name
const passenger = 'jOnAS';
const passengerLower = passenger.toLowerCase();
const passentCorrect =
  passengerLower[0].toUpperCase() + passengerLower.slice(1);

console.log(passentCorrect);

// Comparing emails
const email = 'hello@hotmail.com';
const loginEmail = '  Hello@Hotmail.Com \n';

// const lowerEmail = loginEmail.toLowerCase();
// const trimmedEmail = lowerEmail.trim();
// console.log(trimmedEmail);

const normalizedEmail = loginEmail.toLowerCase().trim();
console.log(normalizedEmail);
console.log(email === normalizedEmail);

// Replacing
const priceEU = '288,97€';
const priceUS = priceEU.replace('€', '$').replace(',', '.');
console.log(priceUS);

const announcement =
  'All passengers come to boarding door 23. Boarding door 23!';

console.log(announcement.replace('door', 'gate'));
console.log(announcement.replaceAll('door', 'gate'));
console.log(announcement.replace(/door/g, 'gate')); // g means global

//.Booleans
const flight = 'Airbus A320neo';
console.log(flight.includes('A320'));
console.log(flight.includes('Boing'));
console.log(flight.startsWith('Air'));

if (flight.startsWith('Airbus') && flight.endsWith('neo')) {
  console.log('Part of the new Airbus family');
}

// Practice exercise
const checkBaggage = function (items) {
  const baggage = items.toLowerCase();
  if (baggage.includes('knife') || baggage.includes('gun')) {
    console.log("You're not allowed on board");
  } else {
    console.log('Welcome aboard');
  }
};

checkBaggage('I have a laptop, some Food and a pocket Knife');
checkBaggage('Socks and camera');
checkBaggage('Got some snacks and a gun for protection');

//// WORKING WITH STRINGS - Part 3 ////

// Split and Join
console.log('a+very+nice+string'.split('+'));
console.log('Killian Gemoets'.split(' '));
const [firstName, lastName] = 'Killian Gemoets'.split(' ');

const newName = ['Mr.', firstName, lastName.toUpperCase()].join(' ');
console.log(newName);

const capitalizeName = function (name) {
  const names = name.toLowerCase().split(' ');
  const namesUpper = [];
  for (const n of names) {
    // namesUpper.push(n[0].toUpperCase() + n.slice(1));
    namesUpper.push(n.replace(n[0], n[0].toUpperCase()));
  }
  console.log(namesUpper);
  console.log(namesUpper.join(' '));
};

capitalizeName('jesSica ann smith davis');
capitalizeName('killian gemoets');

// Padding
const message = 'Go to gate 23!';
console.log(message.padStart(20, '+').padEnd(30, '+'));
console.log('Killian'.padStart(20, '+').padEnd(30, '+'));

const maskCreditCard = function (number) {
  const str = String(number);
  //const str = number + '';
  console.log(str);
  const last = str.slice(-4);
  return last.padStart(str.length, '*');
};

console.log(maskCreditCard(3564614396451));
console.log(maskCreditCard('456567144123'));

//Repeat
const message2 = 'Bad weather... All Departures Delayed... ';
console.log(message2.repeat(5));

const planesInLine = function (n) {
  console.log(`They are ${n} planes in line ${'✈️'.repeat(n)}`);
};

planesInLine(12);
planesInLine(4);

//// String Methods Practice ////

const flightsExample =
  '_Delayed_Departure;fao93766109;txl2133758440;11:25+_Arrival;bru0943384722;fao93766109;11:45+_Delayed_Arrival;hel7439299980;fao93766109;12:05+_Departure;fao93766109;lis2323639855;12:30';

// 🔴 Delayed Departure from FAO to TXL (11h25)
//              Arrival from BRU to FAO (11h45)
//   🔴 Delayed Arrival from HEL to FAO (12h05)
//            Departure from FAO to LIS (12h30)

// ME:
for (const flight of flightsExample.split('+')) {
  // console.log(flight);
  const [type, from, to, time] = flight.split(';');
  const newType = type.replaceAll('_', ' ');
  const newFrom = from.slice(0, 3).toLocaleUpperCase();
  const newTo = to.slice(0, 3).toLocaleUpperCase();
  const newTime = time.replace(':', 'h');
  const first = type.startsWith('_Delayed') ? '🔴' : '';
  const newFlight =
    `${first}${newType} from ${newFrom} to ${newTo} (${newTime})`.padStart(46);
  console.log(newFlight);
}

// PROF:
const getCode = str => str.slice(0, 3).toUpperCase(); //A small function can be write like that
for (const flight of flights.split('+')) {
  const [type, from, to, time] = flight.split(';');
  const output = `${type.startsWith('_Delayed') ? '🔴' : ''}${type.replaceAll(
    '_',
    ' '
  )} ${getCode(from)} ${getCode(to)} (${time.replace(':', 'h')})`.padStart(36);
  console.log(output);
}

// CODING CHALLENGE #1 ////
/*
We're building a football betting app (soccer for my American friends 😅)!

Suppose we get data from a web service about a certain game (below). In this challenge we're gonna work with the data. So here are your tasks:

TEST DATA FOR 6: Use players 'Davies', 'Muller', 'Lewandowski' and 'Kimmich'. Then, call the function again with players from game.scored

GOOD LUCK 😀
*/
const game = {
  team1: 'Bayern Munich',
  team2: 'Borrussia Dortmund',
  players: [
    [
      'Neuer',
      'Pavard',
      'Martinez',
      'Alaba',
      'Davies',
      'Kimmich',
      'Goretzka',
      'Coman',
      'Muller',
      'Gnarby',
      'Lewandowski',
    ],
    [
      'Burki',
      'Schulz',
      'Hummels',
      'Akanji',
      'Hakimi',
      'Weigl',
      'Witsel',
      'Hazard',
      'Brandt',
      'Sancho',
      'Gotze',
    ],
  ],
  score: '4:0',
  scored: ['Lewandowski', 'Gnarby', 'Lewandowski', 'Hummels'],
  date: 'Nov 9th, 2037',
  odds: {
    team1: 1.33,
    x: 3.25,
    team2: 6.5,
  },
};

// 1. Create one player array for each team (variables 'players1' and 'players2')
const [players1, players2] = game.players;
console.log(players1);
console.log(players2);

// 2. The first player in any player array is the goalkeeper and the others are field players. For Bayern Munich (team 1) create one variable ('gk') with the goalkeeper's name, and one array ('fieldPlayers') with all the remaining 10 field players
const [gk, ...fieldPlayers] = players1;
console.log(gk);
console.log(fieldPlayers);

// 3. Create an array 'allPlayers' containing all players of both teams (22 players)
const allPlayers = [...players1, ...players2];
console.log(allPlayers);

// 4. During the game, Bayern Munich (team 1) used 3 substitute players. So create a new array ('players1Final') containing all the original team1 players plus 'Thiago', 'Coutinho' and 'Perisic'
const players1Final = [...players1, 'Thiago', 'Coutinho', 'Perisic'];
console.log(players1Final);

// 5. Based on the game.odds object, create one variable for each odd (called 'team1', 'draw' and 'team2')
// const team1 = game.odds.team1;
// const draw = game.odds.x;
// const team2 = game.odds.team2;

// const { team1, x: draw, team2 } = game.odds;
// console.log(team1, draw, team2);

const {
  odds: { team1, x: draw, team2 },
} = game;
console.log(team1, draw, team2);

// 6. Write a function ('printGoals') that receives an arbitrary number of player names (NOT an array) and prints each of them to the console, along with the number of goals that were scored in total (number of player names passed in)
const printGoals = function (...players) {
  console.log(players);
  console.log(`${players.length} goals were scored`);
};
printGoals(...game.scored);

// 7. The team with the lower odd is more likely to win. Print to the console which team is more likely to win, WITHOUT using an if/else statement or the ternary operator.
// const teamAboutToWin =
//   game.odds.team1 > game.odds.team2 ? game.team2 : game.team1;
// console.log(teamAboutToWin);

team1 > team2 && console.log(`${game.team2} is more likely to win.`);
team1 < team2 && console.log(`${game.team1} is more likely to win.`);

//// Coding Challenge #2 ////

//Let's continue with our football betting app!
// GOOD LUCK 😀

//1. Loop over the game.scored array and print each player name to the console, along with the goal number (Example: "Goal 1: Lewandowski")
for (const [goal_num, scorer] of game.scored.entries()) {
  console.log(`Goal ${goal_num + 1}: ${scorer}`);
}

//2. Use a loop to calculate the average odd and log it to the console (We already studied how to calculate averages, you can go check if you don't remember)

const odd_values = Object.values(game.odds);
let average = 0;
for (const i of odd_values) average += i;
average /= odd_values.length;
console.log(parseFloat(average).toFixed(2));

// 3. Print the 3 odds to the console, but in a nice formatted way, exaclty like this:
//       Odd of victory Bayern Munich: 1.33
//       Odd of draw: 3.25
//       Odd of victory Borrussia Dortmund: 6.5
// Get the team names directly from the game object, don't hardcode them (except for "draw"). HINT: Note how the odds and the game objects have the same property names 😉

const odds = Object.entries(game.odds);
for (const [key, val] of odds) {
  const team = game[key] ?? 'draw';
  if (team == 'draw') console.log(`Odd of ${team}: ${val}`);
  else console.log(`Odd of victory ${team}: ${val}`);
}

// PROF:
// for (const [team, odd] of Object.entries(game.odds)) {
//   const teamStr = team === 'x' ? 'draw' : `victory ${game[team]}`;
//   console.log(`Odd of ${teamStr} ${odd}`);
// }

// BONUS: Create an object called 'scorers' which contains the names of the players who scored as properties, and the number of goals as the value. In this game, it will look like this:
//       {
//         Gnarby: 1,
//         Hummels: 1,
//         Lewandowski: 2
//       }
const scorers = {};
const player = game.scored;
for (let i = 0; i < player.length; i++) {
  console.log(player[i]);
  if (scorers[player[i]]) scorers[player[i]] += 1;
  else scorers[player[i]] = 1;
}

// PROF :
// const scorers = {};
// for (const player of game.scored) {
//   scorers[player] ? scorers[player]++ : (scorers[player] = 1);
// }

console.log(scorers);

// Coding Challenge #3 ////

//// SETS ////

// Let's continue with our football betting app! This time, we have a map with a log of the events that happened during the game. The values are the events themselves, and the keys are the minutes in which each event happened (a football game has 90 minutes plus some extra time).
// GOOD LUCK 😀

const gameEvents = new Map([
  [17, '⚽️ GOAL'],
  [36, '🔁 Substitution'],
  [47, '⚽️ GOAL'],
  [61, '🔁 Substitution'],
  [64, '🔶 Yellow card'],
  [69, '🔴 Red card'],
  [70, '🔁 Substitution'],
  [72, '🔁 Substitution'],
  [76, '⚽️ GOAL'],
  [80, '⚽️ GOAL'],
  [92, '🔶 Yellow card'],
]);

//1. Create an array 'events' of the different game events that happened (no duplicates)

const valuesss = [...gameEvents.values()];
console.log(valuesss);
const eventss = new Set(valuesss);
console.log(eventss);
const events = [...eventss];
console.log(events);

const events2 = [...new Set([...gameEvents.values()])];
console.log(events2);

const valuess3 = gameEvents.values();
console.log(valuess3);
const eventss3 = new Set(gameEvents.values());
console.log(eventss3);
const events3 = [...new Set(gameEvents.values())];
console.log(events3);

//2. After the game has finished, is was found that the yellow card from minute 64 was unfair. So remove this event from the game events log.

gameEvents.delete(64);
console.log(gameEvents);

//3. Print the following string to the console: "An event happened, on average, every 9 minutes" (keep in mind that a game has 90 minutes)
const averageTime = 90 / gameEvents.size;
console.log(`An event happened on average, every ${averageTime} minutes`);

//4. Loop over the events and log them to the console, marking whether it's in the first half or second half (after 45 min) of the game, like this:
//     [FIRST HALF] 17: ⚽️ GOAL
for (const [time, event] of gameEvents) {
  let message = time <= 45 ? '[FIRST HALF]' : '[SECOND HALF]';
  message += ` ${time}: ${event}`;
  console.log(message);
}

// Coding Challenge #4

/*
Write a program that receives a list of variable names written in underscore_case and convert them to camelCase.

The input will come from a textarea inserted into the DOM (see code below), and conversion will happen when the button is pressed.

THIS TEST DATA (pasted to textarea)
underscore_case
 first_name
Some_Variable
  calculate_AGE
delayed_departure

SHOULD PRODUCE THIS OUTPUT (5 separate console.log outputs)
underscoreCase      ✅
firstName           ✅✅
someVariable        ✅✅✅
calculateAge        ✅✅✅✅
delayedDeparture    ✅✅✅✅✅

HINT 1: Remember which character defines a new line in the textarea 😉
HINT 2: The solution only needs to work for a variable made out of 2 words, like a_b
HINT 3: Start without worrying about the ✅. Tackle that only after you have the variable name conversion working 😉
HINT 4: This challenge is difficult on purpose, so start watching the solution in case you're stuck. Then pause and continue!

Afterwards, test with your own test data!

GOOD LUCK 😀
*/

document.body.append(document.createElement('textarea'));
document.body.append(document.createElement('button'));

document.querySelector('button').addEventListener('click', function () {
  const text = document.querySelector('textarea').value;
  console.log(text);
  const lines = text.split('\n');
  console.log(lines);
  let newText = '';
  for (const [i, line] of lines.entries()) {
    const lineLowerCase = line.toLowerCase().trim();
    // const newLine =
    //   lineLowerCase.slice(0, lineLowerCase.indexOf('_')) +
    //   lineLowerCase[lineLowerCase.indexOf('_') + 1].toUpperCase() +
    //   lineLowerCase.slice(lineLowerCase.indexOf('_') + 2);

    const newLine =
      lineLowerCase.slice(0, lineLowerCase.indexOf('_')) +
      lineLowerCase
        .slice(lineLowerCase.indexOf('_') + 1)
        .replace(
          lineLowerCase[lineLowerCase.indexOf('_') + 1],
          lineLowerCase[lineLowerCase.indexOf('_') + 1].toUpperCase()
        );

    const newLineWithV = newLine.padEnd(20) + `${'✅'.repeat(i + 1)}`;

    newText += newLineWithV + '\n';
  }
  console.log(newText);
});
