'use strict';

/////////////////////////////////////////////////////
//// Constructor Functions and the NEW operator ////

// Construction function = function that we call with the "new"operator
//Convention : always starts with a capital letter

// This function is like the blueprint
const Person = function (firstName, birthYear) {
  console.log(this);
  this.firstName = firstName;
  this.birthYear = birthYear;

  //Never create a method inside of a construction function bc if we create 1000 objects, the method will be created 1000 times -> use the prototype property
  //   this.calAge = function () {
  //     console.log(2037 - this.birthYear);
  //   };
};

const jonas = new Person('Jonas', 1991);
console.log(jonas);

// New is special operator:
// 1. A new empty object {} is created
// 2. The function is called and this is the new empty object (this = {})
// 3. {} is linked to a prototype
// 4. function automatically return {}

const matilda = new Person('Matilda', 2017);
const jack = new Person('Jack', 1985);
console.log(matilda, jack);

const jay = 'Jay';

console.log(jonas instanceof Person);
console.log(jay instanceof Person);

/////////////////////////////////////////////////////
//// Prototypes ////

//Each function in JavaScript automatically has a property called prototype
console.log(Person.prototype);

// We add a method to the prototype property
Person.prototype.calcAge = function () {
  console.log(2022 - this.birthYear);
};

jonas.calcAge();
console.log(jonas);
// The jonas object doesn't contain the calcAge method but still we have access to it bc of prototypal inheritance
matilda.calcAge();

console.log(jonas.__proto__);
console.log(jonas.__proto__ === Person.prototype);
//This is not the prototype property, but it is the prototype of jonas
// And the prototype of jonas is basically the prototype property of the constructor function

console.log(Person.prototype.isPrototypeOf(jonas));
console.log(Person.prototype.isPrototypeOf(matilda));
console.log(Person.prototype.isPrototypeOf(Person));
// Person.prototype is not the prototype of Person !
// It's the prototype of the linked object

Person.prototype.species = 'Homo Sapiens';
console.log(jonas, matilda);
console.log(jonas.species, matilda.species);
// It's not the own properties of the object

console.log(jonas.hasOwnProperty('firstName'));
console.log(jonas.hasOwnProperty('species'));

/////////////////////////////////////////////////////
//// Prototypal Inheritance on Built-In Objects ////

console.log(jonas.__proto__); // === Person.prototype
console.log(jonas.__proto__.__proto__); //=== Object.prototype
console.log(jonas.__proto__.__proto__.__proto__); //Object.prototype is the top of prototype chain

console.log(Person.prototype.constructor);
console.dir(Person.prototype.constructor); //To inspect the function

const arr = [2, 6, 4, 4, 6, 10, 2]; //It's created by the Array constructor, same that using : new Array = []
console.log(arr.__proto__); //Each array has access to a lot of methods thanks to its prototype
console.log(arr.__proto__ === Array.prototype);
console.log(arr.__proto__.__proto__);

// We can add a new method to the prototype property of the Array constructor
Array.prototype.unique = function () {
  return [...new Set(this)]; //The this keywork is the array on which this method will be called
};

console.log(arr.unique());

const h1 = document.querySelector('h1');
console.dir(h1); //If we inspect the prototype chain, the protoype chain is the following :
// HTMLHeaderElement - HTMLElement - Element- Node - EventTarget - Object (see slide 143)

console.dir(x => x + 1);

/////////////////////////////////////////////////////
//// ES6 Classes ////

// Class Expression
// const PersonCl = class{}

// We can also use a Class Declaration (same than Class Expression)
class PersonCl {
  //First thing we need to do is to add a constructor method
  constructor(fullName, birthYear) {
    this.fullName = fullName;
    this.birthYear = birthYear;
  }
  // INSTANCE METHOD:
  // Method that will be added to .prototype property
  calcAge() {
    console.log(2021 - this.birthYear);
  }

  // IMPORTANT NOTE:
  // All the method that we write in the class (so outside of the constructor) will be on the prototype of the objects and not on the objects themselves !

  get age() {
    return 2021 - this.birthYear;
  }

  // Set a property that already exists
  // (I didn't really understand this part...)
  set fullName(name) {
    console.log(name);
    if (name.includes(' ')) this._fullName = name;
    else alert(`${name} is not a full name!`);
  }
  get fullName() {
    return this._fullName;
  }

  // STATIC METHOD:
  // Method that is attached to the constructor itslef and not to the prototype property of the constructor
  static hey() {
    console.log('Hey there!');
    console.log(this);
  }
}

const debie = new PersonCl('Debie Davis', 1985);
console.log(debie);
console.log(jonas);

debie.calcAge();
console.log(debie.age); //Edit a property if we check the protoype of debie

console.log(debie.__proto__ === PersonCl.prototype);

// We also can add a method like this:
PersonCl.prototype.greet = function () {
  console.log(`Hey ${this.fullName}`);
};
debie.greet();

// 1. Classes are NOT hoisted (functional declarations are hoisted, i.e. we can use them before they are declared in the code)
// 2. Class are first-class citizes (i.e, we can pass them into functions and return them from functions)
// 3. Classes are executed in strict mode

const walterWhite = new PersonCl('Walter White', 1965);
console.log(walterWhite);

PersonCl.hey();

/////////////////////////////////////////////////////
//// Setters and Getters ////

// const walter = new PersonCl('Walter', 1965);
// console.log(walter);

const account = {
  owner: 'jonas',
  movements: [200, 530, 120, 300],

  // To add a getter to this object:
  get latest() {
    return this.movements.slice(-1).pop();
  },

  // To add a setter to this object:
  // Any setter method need to have exactly one parameter
  set latest(mov) {
    this.movements.push(mov);
  },

  // NOTE: it's not mandatory to specify a setter when we have a getter for the same property
};

// We simply use "latest" as a property. We don't call the method
console.log(account.latest);

account.latest = 50;
console.log(account.movements);
console.log(account.latest);

console.log(account);

/////////////////////////////////////////////////////
//// Static Methods ////

//Examples of static functions:
console.log(Array.from(document.querySelectorAll('h1')));
// The from function here is attached to the Array constructor itslef and not to the prototype property of the constructor
// So therefore all the arrays do not inherit this method
console.log(Number.parseFloat(12));

Person.hey = function () {
  console.log('Hey there!');
  console.log(this);
};

Person.hey();
// jonas.hey();

/////////////////////////////////////////////////////
//// Object.create ////

// The PersonProto object will be the prototype of all the Person objects
const PersonProto = {
  calcAge() {
    console.log(2022 - this.birthYear);
  },

  init(firstName, birthYear) {
    this.firstName = firstName;
    this.birthYear = birthYear;
  },
};

// Return a new object that is linked to the prototype that we passed.
const steven = Object.create(PersonProto); //Here we pass in the object that we want to be the prototype of the new object

console.log(steven);
// steven is right now an empty object linked to the PersonProto object which is now his protoype

steven.name = 'Steven';
steven.birthYear = 2002;
steven.calcAge();

console.log(steven.__proto__ === PersonProto);

const sarah = Object.create(PersonProto);
sarah.init('Sarah', 1998);
sarah.calcAge();

/////////////////////////////////////////////////////
//// Inheritance Between: "Classes": Constructor Functions ////

const Human = function (firstName, birthYear) {
  console.log(this);
  this.firstName = firstName;
  this.birthYear = birthYear;
};

Human.prototype.calcAge = function () {
  console.log(2022 - this.birthYear);
};

const Student = function (firstName, birthYear, course) {
  //We don't use the keyword NEW here, we're doing a regular function call and in a regular function call, the this keyword is set to undifined. So we need to manually set the this keyword -> To do this, we use the call method.
  Human.call(this, firstName, birthYear);
  // In this case we want the this keyword inside the Person function to simply be the this keywork inside the Student function, i.e, the empty object that is being creteted by the NEW operator.
  this.course = course;
};

//A student is also a person so we want student and person to be connected. We want the student to be the child class and inherit from the person class
// This way, all instances of student could also get access to methods from the person's prototype property (like the calcAge method), through the prototype chain.
// So basically what we want to do is to make human.prototype the prototype of student.prototype
// => We have to create this connection manually by using object.create

Student.prototype = Object.create(Human.prototype);
//We have to create this connection before we add any more methods to the prototype object of student
// This is bc object.create return an empty object so at this point Student.prototype is empty

Student.prototype.introduce = function () {
  console.log(`My name is ${this.firstName} and I study ${this.course}`);
};

const mike = new Student('Mike', 2000, 'Computer Science');
mike.introduce();
//Since person.prototype the prototype of student.prototype, we are able to do this thanks to the prototype chain:
mike.calcAge();

// Quick look at the protype chain:
console.log(mike);
console.log(mike.__proto__);
console.log(mike.__proto__.__proto__);
console.log(mike.__proto__.__proto__.__proto__);
console.log(mike.__proto__.__proto__.__proto__.__proto__);

console.log(mike instanceof Student);
console.log(mike instanceof Human);
console.log(mike instanceof Object);

Student.prototype.constructor = Student;
console.dir(Student.prototype.constructor);

/////////////////////////////////////////////////////
//// Inheritance Between: "Classes": ES6 Classes ////

class HumanCl {
  //First thing we need to do is to add a constructor method
  constructor(fullName, birthYear) {
    this.fullName = fullName;
    this.birthYear = birthYear;
  }
  // INSTANCE METHOD:
  calcAge() {
    console.log(2021 - this.birthYear);
  }
  greet() {
    console.log(`Hey ${this.fullName}`);
  }

  get age() {
    return 2021 - this.birthYear;
  }

  set fullName(name) {
    console.log(name);
    if (name.includes(' ')) this._fullName = name;
    else alert(`${name} is not a full name!`);
  }
  get fullName() {
    return this._fullName;
  }

  // STATIC METHOD:
  static hey() {
    console.log('Hey there!');
    console.log(this);
  }
}

// To implement inheritance between ES6 classes, we only need 2 ingredients: the extends keyword and the super function
//The extends keyword will link the prototypes behind the scenes
class StudentCl extends HumanCl {
  constructor(fullName, birthYear, course) {
    //super is basically the constuctor function of the parent class
    //It always needs to happen first (bc this call is responsible for creating the this keyword) !
    super(fullName, birthYear);
    this.course = course;
  }

  introduce() {
    console.log(`My name is ${this.fullName} and I study ${this.course}`);
  }

  // We can overwtire the calcAge method that is in the parent class
  calcAge() {
    console.log(
      `I'm ${
        2021 - this.birthYear
      } years old, but as a student I feel more like ${
        2021 - this.birthYear + 10
      }`
    );
  }
}

const martha = new StudentCl('Martha Jones', 2001, 'Computer Science');
console.log(martha);
martha.introduce();
martha.calcAge();

/////////////////////////////////////////////////////
//// Inheritance Between: "Classes": Object.create ////

const HumanProto = {
  calcAge() {
    console.log(2022 - this.birthYear);
  },

  init(firstName, birthYear) {
    this.firstName = firstName;
    this.birthYear = birthYear;
  },
};

// Return a new object that is linked to the prototype that we passed.
const stuart = Object.create(HumanProto);

// The StudentProto object is the prototype of joey and the HumanProto object is the prototype of StudentProto
const StudentProto = Object.create(HumanProto);

StudentProto.init = function (firstName, birthYear, course) {
  HumanProto.init.call(this, firstName, birthYear);
  this.course = course;
};

StudentProto.introduce = function () {
  console.log(`My name is ${this.firstName} and I study ${this.course}`);
};

const joey = Object.create(StudentProto);
joey.init('Joey', '2000', 'Computer Science');
joey.introduce();
joey.calcAge();
console.log(joey);

/////////////////////////////////////////////////////
//// Another Class Example ////

class Account {
  constructor(owner, currency, pin) {
    this.owner = owner;
    this.currency = currency;
    this.pin = pin;
    this.movements = [];
    this.locale = navigator.language;

    console.log(`Thanks for opening an account, ${owner}`);
  }

  //Public interface
  deposit(val) {
    this.movements.push(val);
  }
  withdraw(val) {
    this.deposit(-val);
  }
  approveLoan(val) {
    return true;
  }
  requestLoan(val) {
    if (this.approveLoan(val)) {
      this.deposit(val);
      console.log('Loan approved');
    }
  }
}

const acc1 = new Account('Luc', 'EUR', 1111);
console.log(acc1);

// acc1.movements.push(250);
// acc1.movements.push(-140);
acc1.deposit(250);
acc1.withdraw(140);
acc1.requestLoan(1000);
acc1.approveLoan(1000);
// The problem here is that only the requestLoan method should be public
console.log(acc1);

/////////////////////////////////////////////////////
//// Encapsulation: Protected Properties and Methods ////

//Here we will simply fake encapsulation by using a convention
//We want to protect the movements bc it is private data
class AccountPrivate {
  constructor(owner, currency, pin) {
    this.owner = owner;
    this.currency = currency;
    // protected property
    this._pin = pin;
    this._movements = [];
    this.locale = navigator.language;

    console.log(`Thanks for opening an account, ${owner}`);
  }

  //Public interface
  getMovements() {
    return this._movements;
  }

  deposit(val) {
    this._movements.push(val);
  }
  withdraw(val) {
    this.deposit(-val);
  }
  _approveLoan(val) {
    return true;
  }
  requestLoan(val) {
    if (this._approveLoan(val)) {
      this.deposit(val);
      console.log('Loand approved');
    }
  }
}

const acc2 = new AccountPrivate('Luc', 'EUR', 1111);
console.log(acc2);

// acc1._movements.push(250);
// acc1._movements.push(-140);
acc2.deposit(250);
acc2.withdraw(140);
acc2.requestLoan(1000);
console.log(acc2.getMovements());
// The problem here is that only the requestLoan method should be public
console.log(acc2);

/////////////////////////////////////////////////////
//// Encapsulation: Private Class Fields and Methods ////

// 1) Public fields
// 2) Private fields
// 3) Public methods
// 4) Private methods
// (there is also the static version)

class AccountPrivate2 {
  // 1) Public fields (not on the prototype but on the instances !)
  locale = navigator.language;

  // 2) Private fields (the # symbol is the syntax that makes a field private in this new class proposal)
  // Available on the instances themselves, not on the prototype
  #movements = [];
  #pin;
  constructor(owner, currency, pin) {
    this.owner = owner;
    this.currency = currency;
    // protected property
    this.#pin = pin;
    // this._movements = [];
    // this.locale = navigator.language;

    console.log(`Thanks for opening an account, ${owner}`);
  }

  // 3) Public methods

  //Public interface
  getMovements() {
    return this.#movements;
  }

  deposit(val) {
    this.#movements.push(val);
    return this;
  }
  withdraw(val) {
    this.deposit(-val);
    return this;
  }

  requestLoan(val) {
    if (this.#approveLoan(val)) {
      this.deposit(val);
      console.log('Loand approved');
      return this;
    }
  }

  // 4) Private methods
  #approveLoan(val) {
    return true;
  }

  // Static methods are not available on the instances but only on the class itself
  static helper() {
    console.log('Helper');
  }
}

const acc3 = new AccountPrivate2('Luc', 'EUR', 1111);
console.log(acc3);

// acc1._movements.push(250);
// acc1._movements.push(-140);
acc3.deposit(250);
acc3.withdraw(140);
acc3.requestLoan(1000);
// The problem here is that only the requestLoan method should be public
console.log(acc3);

// console.log(acc3.#movements); //Give an error bc #movements is a private field
console.log(acc3.getMovements()); //this method still works
// console.log(acc3.#pin);
// console.log(acc3.#approuveLoan(100));

AccountPrivate2.helper();

/////////////////////////////////////////////////////
//// Chaining Methods ////

acc3.deposit(300).deposit(500).withdraw(35).requestLoan(2500).withdraw(4000);
console.log(acc3.getMovements());

/////////////////////////////////////////////////////
//// Coding Challenge #1 ////
/*
1. Use a constructor function to implement a Car. A car has a make and a speed property. The speed property is the current speed of the car in km/h;
2. Implement an 'accelerate' method that will increase the car's speed by 10, and log the new speed to the console;
3. Implement a 'brake' method that will decrease the car's speed by 5, and log the new speed to the console;
4. Create 2 car objects and experiment with calling 'accelerate' and 'brake' multiple times on each of them.

DATA CAR 1: 'BMW' going at 120 km/h
DATA CAR 2: 'Mercedes' going at 95 km/h

GOOD LUCK 😀
*/

const Car = function (make, speed) {
  console.log(this);
  this.make = make;
  this.speed = speed;
};
const car1 = new Car('BMW', 120);
const car2 = new Car('Mercedes', 95);

Car.prototype.accelerate = function () {
  this.speed += 10;
  console.log(`The speed of the ${this.make} car is now ${this.speed} km/h.`);
};
car1.accelerate();
car2.accelerate();

Car.prototype.brake = function () {
  this.speed -= 5;
  console.log(`The speed of the ${this.make} car is now ${this.speed} km/h.`);
};
car1.brake();
car2.brake();

/////////////////////////////////////////////////////
//// Coding Challenge #2 ////

/*
1. Re-create challenge 1, but this time using an ES6 class;
2. Add a getter called 'speedUS' which returns the current speed in mi/h (divide by 1.6);
3. Add a setter called 'speedUS' which sets the current speed in mi/h (but converts it to km/h before storing the value, by multiplying the input by 1.6);
4. Create a new car and experiment with the accelerate and brake methods, and with the getter and setter.

DATA CAR 1: 'Ford' going at 120 km/h

GOOD LUCK 😀
*/

class CarCl {
  constructor(make, speed) {
    this.make = make;
    this.speed = speed;
  }

  accelerate() {
    this.speed += 10;
    console.log(`The speed of the ${this.make} car is now ${this.speed} km/h.`);
  }

  brake() {
    this.speed -= 5;
    console.log(`The speed of the ${this.make} car is now ${this.speed} km/h.`);
    return this;
  }

  get speedUS() {
    return this.speed / 1.6;
  }

  set speedUS(speed) {
    this.speed = speed * 1.6;
  }
}

const car3 = new CarCl('Ford', 120);
console.log(car3.speedUS);
car3.accelerate();
car3.brake();
car3.speedUS = 50;
console.log(car3);

/////////////////////////////////////////////////////
//// Coding Challenge #3 ////

//1. Use a constructor function to implement an Electric Car (called EV) as a CHILD "class" of Car. Besides a make and current speed, the EV also has the current battery charge in % ('charge' property);
//2. Implement a 'chargeBattery' method which takes an argument 'chargeTo' and sets the battery charge to 'chargeTo';
//3. Implement an 'accelerate' method that will increase the car's speed by 20, and decrease the charge by 1%. Then log a message like this: 'Tesla going at 140 km/h, with a charge of 22%';
//4. Create an electric car object and experiment with calling 'accelerate', 'brake' and 'chargeBattery' (charge to 90%). Notice what happens when you 'accelerate'! HINT: Review the definiton of polymorphism 😉
//DATA CAR 1: 'Tesla' going at 120 km/h, with a charge of 23%
//GOOD LUCK 😀

const EV = function (make, speed, charge) {
  Car.call(this, make, speed);
  this.charge = charge;
};

EV.prototype = Object.create(Car.prototype);
EV.prototype.constructor = EV;

EV.prototype.chargeBattery = function (chargeTo) {
  this.charge = chargeTo;
};

EV.prototype.accelerate = function () {
  this.speed += 20;
  this.charge--;
  console.log(
    `${this.make} goint at ${this.speed} km/h, with a charge of ${this.charge}%.`
  );
};
const tesla = new EV('Tesla', 120, 23);
tesla.chargeBattery(90);
tesla.accelerate();
tesla.brake();
console.log(tesla);

/////////////////////////////////////////////////////
//// Coding Challenge #4 ////

/* 
1. Re-create challenge #3, but this time using ES6 classes: create an 'EVCl' child class of the 'CarCl' class
2. Make the 'charge' property private;
3. Implement the ability to chain the 'accelerate' and 'chargeBattery' methods of this class, and also update the 'brake' method in the 'CarCl' class. Then experiment with chining!

DATA CAR 1: 'Rivian' going at 120 km/h, with a charge of 23%

GOOD LUCK 😀
*/

class EVCl extends CarCl {
  #charge;
  constructor(make, speed, charge) {
    super(make, speed);
    this.#charge = charge;
  }

  chargeBattery(chargeTo) {
    this.#charge = chargeTo;
    return this;
  }

  accelerate() {
    this.speed += 20;
    this.#charge--;
    console.log(
      `${this.make} goint at ${this.speed} km/h, with a charge of ${
        this.#charge
      }%.`
    );
    return this;
  }
}

const rivian = new EVCl('Rivian', 120, 23);

rivian.chargeBattery(90).accelerate().brake();
console.log(rivian);
console.log(rivian.speedUS);
