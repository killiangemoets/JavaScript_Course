'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
//// OUR FIST AJAX CALL ////
const getCountryData = function (country) {
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
  request.send();
  // We send off the request. That request then fetches the date in the background, and then once it's done, it will emit the load event
  request.addEventListener('load', function () {
    //the this keyword is the request
    console.log(this.responseText); //What we get here rn is JSON
    const [data] = JSON.parse(this.responseText);
    console.log(data);

    const html = `
    <article class="country">
        <img class="country__img" src="${data.flags.svg}" />
        <div class="country__data">
            <h3 class="country__name">${data.name.common}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(
              +data.population / 1000000
            ).toFixed(1)}M people</p>
            <p class="country__row"><span>🗣️</span>${Object.values(
              data.languages
            )}</p>
            <p class="country__row"><span>💰</span>${Object.values(
              data.currencies
            ).map(currency => currency.name)}</p>
        </div>
    </article>`;

    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
  });
};

getCountryData('germany');

///////////////////////////////////////
//// WELCOME TO CALLBACK HELL ////

const renderCountry = function (data, className = '') {
  const html = `
    <article class="country ${className}">
        <img class="country__img" src="${data.flags.svg}" />
        <div class="country__data">
            <h3 class="country__name">${data.name.common}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(
              +data.population / 1000000
            ).toFixed(1)}M people</p>
            <p class="country__row"><span>🗣️</span>${data.languages.map(
              l => l.name
            )}</p>
            <p class="country__row"><span>💰</span>${data.currencies.map(
              curr => curr.name
            )}</p>
        </div>
    </article>`;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

const getCountryAndNeighbour = function (country) {
  // AJAX Call country 1
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v2/name/${country}`);
  request.send();
  // We send off the request. That request then fetches the date in the background, and then once it's done, it will emit the load event
  request.addEventListener('load', function () {
    //the this keyword is the request
    console.log(this.responseText); //What we get here rn is JSON
    const [data] = JSON.parse(this.responseText);
    console.log(data);

    // Render country 1
    renderCountry(data);

    //Get neighbour country
    const [neighbour] = data.borders;

    if (!neighbour) return;

    // AJAX call country 2
    const request2 = new XMLHttpRequest();
    request2.open('GET', `https://restcountries.com/v2/alpha/${neighbour}`);
    request2.send();

    request2.addEventListener('load', function () {
      console.log(this.responseText);

      const data2 = JSON.parse(this.responseText);
      console.log(data2);

      // Render country 2
      renderCountry(data2, 'neighbour');
    });
  });
};
// getCountryAndNeighbour('canada');

// setTimeout(() => {
//   console.log('1 second passed');
//   setTimeout(() => {
//     console.log('2 seconds passed');
//     setTimeout(() => {
//       console.log('3 seconds passed');
//       setTimeout(() => {
//         console.log('4 seconds passed');
//       }, 1000);
//     }, 1000);
//   }, 1000);
// }, 1000);

///////////////////////////////////////
//// PROMISES AND THE FETCH API ////

// Let's now replace the old XML HTTP request function with the modern way of making AJAX calls
// => and that's by using the Fetch API
const request = fetch('https://restcountries.com/v3.1/name/portugal');
// Do the same thing than :
// const request = new XMLHttpRequest();
// request.open('GET', `https://restcountries.com/v3.1/name/portugal`);
// request.send();

console.log(request); // The fetch function IMMEDIATELY return a promise. In the beginning this promise is of course still pending bc the asynchronous task of getting the data is still running in the background. Then, at a certain point, the promise will be settled and either in a fulfilled or rejected state

///////////////////////////////////////
//// CONSUMING PROMISES ////

const renderCountry2 = function (data, className = '') {
  const html = `
      <article class="country ${className}">
          <img class="country__img" src="${data.flags.svg}" />
          <div class="country__data">
              <h3 class="country__name">${data.name.common}</h3>
              <h4 class="country__region">${data.region}</h4>
              <p class="country__row"><span>👫</span>${(
                +data.population / 1000000
              ).toFixed(1)}M people</p>
              <p class="country__row"><span>🗣️</span>${Object.values(
                data.languages
              )}</p>
              <p class="country__row"><span>💰</span>${Object.values(
                data.currencies
              ).map(curr => curr.name)}</p>
          </div>
      </article>`;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

const getCountryDataPUsingPromise = function (country) {
  // On all promises we can call the then method
  // Into the then method we need to pass a callback function that we want to be executed as soon as the promise is actually fulfilled (i.e.as soon as the result is available)
  // This callback function will receive one argument: the resulting value of the fulfilled promise
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(function (response) {
      console.log(response);
      // To be able to read the data from the body, we need to call the json method on the response
      // BUT this json function is also an asynchronous function, so it will also return a new promise
      // Thefore we will call the then method on return.json()
      // And the resovled value of this promise here is the data itslef
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      renderCountry2(data[0]);
    });
};

//Simplified and cleaner version:
const getCountryDataPUsingPromise2 = function (country) {
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(response => response.json())
    .then(data => renderCountry2(data[0]));
};

getCountryDataPUsingPromise('belgium');
// getCountryDataPUsingPromise2('norway');

///////////////////////////////////////
//// CHAINING PROMISES ////

const getCountryDataPUsingPromise3 = function (country) {
  // Country 1
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(response => response.json())
    .then(data => {
      renderCountry2(data[0]);
      console.log(data[0]);
      const neighbour = data[0].borders[0];
      if (!neighbour) return;

      //Country 2
      // We need to return this new promise bc then we will be able to chain a new then method on the result of this then method
      return fetch(`https://restcountries.com/v2/alpha/${neighbour}`);
    })
    .then(response => response.json())
    .then(data => renderCountry(data, 'neighbour'));
};

// getCountryDataPUsingPromise3('russia');

///////////////////////////////////////
//// HANDLING REJECTED PROMISES ////

// There are 2 ways of handling rejections:

// 1. To pass a second callback function into the then method. This callback function will be called with an argument which is the error itself

const getCountryDataPUsingPromise4 = function (country) {
  // Country 1
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(
      response => response.json(),
      err => alert(err)
    )
    .then(data => {
      renderCountry2(data[0]);
      console.log(data[0]);
      const neighbour = data[0].borders[0];
      if (!neighbour) return;

      //Country 2
      // We need to return this new promise bc then we will be able to chain a new then method on the result of this then method
      return fetch(`https://restcountries.com/v2/alpha/${neighbour}`);
    })
    .then(
      response => response.json(),
      err => alert(err)
    )
    .then(data => renderCountry(data, 'neighbour'));
};

// btn.addEventListener('click', function () {
//   getCountryDataPUsingPromise4('portudvdvgal');
// });

// 2. There is a better way of handling all these errors globally just in one central place (no matter where they appear in the chain), right at the end of the chain by adding a catch method.
// This callback function is also called with the error object that occured

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
};

const getCountryDataPUsingPromise5 = function (country) {
  // Country 1
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(response => response.json())
    .then(data => {
      renderCountry2(data[0]);
      console.log(data[0]);
      const neighbour = data[0].borders[0];
      if (!neighbour) return;

      //Country 2
      // We need to return this new promise bc then we will be able to chain a new then method on the result of this then method
      return fetch(`https://restcountries.com/v2/alpha/${neighbour}`);
    })
    .then(response => response.json())
    .then(data => renderCountry(data, 'neighbour'))
    .catch(err => {
      console.error(`Hey there: ${err} !!!!!`);
      renderError(`Something went wrong! ${err.message}. Try again`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
      // Generally here we hide the loading spinner
    });
  // The callback function of finally will always be called whatever happens with the promise
  // NOTE: .catch returns a promise, that's why .finally works (indeed if we don't ask to return something else, then and catch always return a promise)
};

// btn.addEventListener('click', function () {
//   getCountryDataPUsingPromise5('portugal');
// });

// getCountryDataPUsingPromise5('portugajjl');

///////////////////////////////////////
//// THROWING ERROR MANUALLY ////

// The promise coming from fetch only gets rejected when the user has no internet connection. But in case of a 403 or 404 error, the fetch promise does not reject, so we do that manually.

const getCountryDataPUsingPromise6 = function (country) {
  // Country 1
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(response => {
      console.log(response);
      // If there's in an error : response.ok = false
      if (!response.ok)
        // We create the new error by using the constructor function "Error" and we pass the message
        // Then we use the "throw" keyword which will immediately terminate the current function (just like "return" does it)
        // => The effect of creating and throwing an error in any of these then methods is that the promise will immediately reject, i.e. the promise returned by this then handler will be a REJECTED PROMISE
        // So that rejection will propagate all the way down to the catch handler
        throw new Error(`Country not found (${response.status})`);

      return response.json();
    })
    .then(data => {
      renderCountry2(data[0]);
      // const neighbour = data[0].borders[0];
      const neighbour = 'dfsnn';
      if (!neighbour) return;

      //Country 2
      return fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`);
    })
    .then(response => {
      if (!response.ok)
        throw new Error(`Country not found (${response.status})`);

      return response.json();
    })
    .then(data => renderCountry2(data[0], 'neighbour'))
    .catch(err => {
      console.error(`${err} !!!!!`);
      renderError(`Something went wrong! ${err.message}. Try again!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

// btn.addEventListener('click', function () {
//   getCountryDataPUsingPromise6('portugal');
// });

// getCountryDataPUsingPromise6('pordhsjdhsd');

////
const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);

    return response.json();
  });
};

const getCountryDataPUsingPromise7 = function (country) {
  // Country 1

  getJSON(`https://restcountries.com/v3.1/name/${country}`, 'Country not found')
    .then(data => {
      renderCountry2(data[0]);
      console.log(data[0]);
      const neighbour = data[0].borders[4];
      // const neighbour = 'dfsnn';
      console.log(neighbour);
      if (!neighbour) throw new Error('No neighbour found');

      //Country 2
      return getJSON(
        `https://restcountries.com/v3.1/alpha/${neighbour}`,
        'Country not found'
      );
    })
    .then(data => renderCountry2(data[0], 'neighbour'))
    .catch(err => {
      console.error(`${err} !!!!!`);
      renderError(`Something went wrong! ${err.message}. Try again!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

// btn.addEventListener('click', function () {
//   getCountryDataPUsingPromise7('spain');
// });

// getCountryDataPUsingPromise7('spadshdhs');
// getCountryDataPUsingPromise7('portugal');

///////////////////////////////////////
// Coding Challenge #1

// In this challenge you will build a function 'whereAmI' which renders a country ONLY based on GPS coordinates. For that, you will use a second API to geocode coordinates.

// Here are your tasks:

// PART 1
// 1. Create a function 'whereAmI' which takes as inputs a latitude value (lat) and a longitude value (lng) (these are GPS coordinates, examples are below).
// 2. Do 'reverse geocoding' of the provided coordinates. Reverse geocoding means to convert coordinates to a meaningful location, like a city and country name. Use this API to do reverse geocoding: https://geocode.xyz/api.
// The AJAX call will be done to a URL with this format: https://geocode.xyz/52.508,13.381?geoit=json. Use the fetch API and promises to get the data. Do NOT use the getJSON function we created, that is cheating 😉

// 3. Once you have the data, take a look at it in the console to see all the attributes that you recieved about the provided location. Then, using this data, log a messsage like this to the console: 'You are in Berlin, Germany'

// 4. Chain a .catch method to the end of the promise chain and log errors to the console

// 5. This API allows you to make only 3 requests per second. If you reload fast, you will get this error with code 403. This is an error with the request. Remember, fetch() does NOT reject the promise in this case. So create an error to reject the promise yourself, with a meaningful error message.

// PART 2
// 6. Now it's time to use the received data to render a country. So take the relevant attribute from the geocoding API result, and plug it into the countries API that we have been using.
// 7. Render the country and catch any errors, just like we have done in the last lecture (you can even copy this code, no need to type the same code)

// TEST COORDINATES 1: 52.508, 13.381 (Latitude, Longitude)
// TEST COORDINATES 2: 19.037, 72.873
// TEST COORDINATES 2: -33.933, 18.474

// GOOD LUCK 😀

const whereAmI = function (lat, lng) {
  fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
    .then(function (response) {
      console.log(response);
      if (!response.ok)
        throw new Error(`Location not found (${response.status})`);
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      console.log(`You're in ${data.city}, in ${data.country}`);

      return fetch(`https://restcountries.com/v3.1/name/${data.country}`);
      // return fetch('https://restcountries.com/v3.1/name/fhdkfhdf');
    })
    .then(function (response) {
      console.log(response);
      if (!response.ok)
        throw new Error(`Problem rendering the country (${response.status})`);
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      renderCountry2(data[0]);
    })
    .catch(function (err) {
      console.error(`The error is: ${err.message} !!!!!`);
    });
};
whereAmI(52.508, 13.381);
whereAmI(19.037, 72.873);
whereAmI(-33.933, 18.474);

///////////////////////////////////////
//// THE EVENT LOOP IN PRACTICE ////

console.log('Test start');
setTimeout(() => console.log('0 sec timer'), 0);
// Promise.resolve allows us to create a promise that is immediately resolved, i.e. that immediately has a success value
// So the fullfilled, success value is the one that we pass in there
Promise.resolve('Resolved promise 1').then(res => console.log(res));

Promise.resolve('Resolved promise 2').then(res => {
  for (let i = 0; i < 1000000000; i++) {}
  console.log(res);
});

console.log('Test end ');

///////////////////////////////////////
//// BUILDING A SIMPLE PROMISE ////

// We use the Promise constructor
// The promise constructor takes exactly one argument which is the so-called EXECUTOR FUNCTION
// => As soon as the promise constructor runs, it will automatically execute this executor function
//   And it will do so by passing in two other arguments : the resolve and the reject functions
// The executor function should produce a result value, i.e. the value that's bassically gonna be the future value of the promise
const lotteryPromise = new Promise(function (resolve, reject) {
  console.log('Lottery draw is happening');
  setTimeout(function () {
    if (Math.random() >= 0.5) {
      // In this situation we say that we win the lottery
      // => So we set the promise as fulfilled (i.e. resolved) using the resolve function
      // Now into the resolve method we pass the fulfilled value of the promise so that is can later be consumed with the then method
      // This means that the value we pass into the resolve function is gonna be the result of the promise that will be available in the then handler
      resolve('You WIN!');
    } else {
      reject(new Error('You lost your money, sorry dude...'));
    }
  }, 1000);
});

lotteryPromise.then(res => console.log(res)).catch(err => console.error(err));

// Promisifying = Convert callback based asynchronous behavior to promise based

//Promisifying setTimeout to avoid Callback hell
const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

// console.log(wait(1));

wait(1)
  .then(() => {
    console.log('1 second passed');
    return wait(1);
  })
  .then(() => {
    console.log('2 seconds passed');
    return wait(1);
  })
  .then(() => {
    console.log('3 seconds passed');
    return wait(1);
  })
  .then(() => console.log('4 seconds passed'));

// => Chain of asynchronous behaviors that happens in a sequence

// setTimeout(() => {
//   console.log('1 second passed');
//   setTimeout(() => {
//     console.log('2 seconds passed');
//     setTimeout(() => {
//       console.log('3 seconds passed');
//       setTimeout(() => {
//         console.log('4 seconds passed');
//       }, 1000);
//     }, 1000);
//   }, 1000);
// }, 1000);

// Easy way to create a fulfilled or a rejected promise immediately
// Promise.resolve('abc').then(x => console.log(x));
// Promise.reject(new Error('sheesh')).catch(x => console.error(x));

///////////////////////////////////////
//// PROMISIFYING THE GEOLOCATION API ////

// Let's promisify a callback based API to a promise based API

navigator.geolocation.getCurrentPosition(
  position => console.log(position),
  err => console.log(err)
);
console.log('Getting position');

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    // navigator.geolocation.getCurrentPosition(
    //   position => resolve(position),
    //   err => reject(err)
    // );
    //We can write it like that:

    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

getPosition().then(pos => console.log(pos));

const whereAmI2 = function () {
  getPosition()
    .then(pos => {
      const { latitude: lat, longitude: lng } = pos.coords;

      return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    })
    .then(function (response) {
      console.log(response);
      if (!response.ok)
        throw new Error(`Location not found (${response.status})`);
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      console.log(`You're in ${data.city}, in ${data.country}`);

      return fetch(`https://restcountries.com/v3.1/name/${data.country}`);
      // return fetch('https://restcountries.com/v3.1/name/fhdkfhdf');
    })
    .then(function (response) {
      console.log(response);
      if (!response.ok)
        throw new Error(`Problem rendering the country (${response.status})`);
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      renderCountry2(data[0]);
    })
    .catch(function (err) {
      console.error(`The error is: ${err} !!!!!`);
    });
};

btn.addEventListener('click', whereAmI2);

///////////////////////////////////////
// Coding Challenge #2

// Build the image loading functionality that I just showed you on the screen.

// Tasks are not super-descriptive this time, so that you can figure out some stuff on your own. Pretend you're working on your own 😉

// PART 1
// 1. Create a function 'createImage' which receives imgPath as an input. This function returns a promise which creates a new image (use document.createElement('img')) and sets the .src attribute to the provided image path. When the image is done loading, append it to the DOM element with the 'images' class, and resolve the promise. The fulfilled value should be the image element itself. In case there is an error loading the image ('error' event), reject the promise.
// If this part is too tricky for you, just watch the first part of the solution.

const imgContainer = document.querySelector('.images');

const createImage = function (imgPath) {
  return new Promise(function (resolve, reject) {
    const img = document.createElement('img');
    img.src = imgPath;

    img.addEventListener('load', function () {
      imgContainer.append(img);
      console.log(img);
      resolve(img);
    });
    img.addEventListener('error', function () {
      reject(new Error("Image didn't load"));
    });
  });
};

// PART 2
// 2. Comsume the promise using .then and also add an error handler;
// 3. After the image has loaded, pause execution for 2 seconds using the wait function we created earlier;
// 4. After the 2 seconds have passed, hide the current image (set display to 'none'), and load a second image (HINT: Use the image element returned by the createImage promise to hide the current image. You will need a global variable for that 😉);
// 5. After the second image has loaded, pause execution for 2 seconds again;
// 6. After the 2 seconds have passed, hide the current image.
let currentImg;

// createImage('img/img-1.jpg')
//   .then(img => {
//     currentImg = img;
//     console.log('Image 1 Loaded');
//     return wait(2);
//   })
//   .then(() => {
//     currentImg.style.display = 'none';
//     return createImage('img/img-3.jpg');
//   })
//   .then(img => {
//     currentImg = img;
//     console.log('Image 1 Loaded');
//     return wait(2);
//   })
//   .then(() => {
//     currentImg.style.display = 'none';
//   })
//   .catch(err => console.error(err));

// TEST DATA: Images in the img folder. Test the error handler by passing a wrong image path. Set the network speed to 'Fast 3G' in the dev tools Network tab, otherwise images load too fast.

// GOOD LUCK 😀

///////////////////////////////////////
//// CONSUMING PROMISES WITH ASYNC/AWAIT ////

// const getPosition = function () {
//   return new Promise(function (resolve, reject) {
//     navigator.geolocation.getCurrentPosition(resolve, reject);
//   });
// };

// We can make it an async function by simply adding async in front of the function
// So it's now an asynchronous function, i.e. a function that will basically keep running in the background while performing the code that's inside of it
// Then when this function is done, it automatically returns a promise
const whereAmI3 = async function () {
  // Inside an async function we can have one or more await statements
  // await and then we need a promise
  // Await will stop the code execution at this point of the function until the promise is fulfilled
  // Recap: this function is running asynchonously in the background -> So it's not blocking the call stack

  // Geolocation
  const pos = await getPosition();
  const { latitude: lat, longitude: lng } = pos.coords;

  // Reverse geocoding
  const resGeo = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
  const dataGeo = await resGeo.json();
  console.log(dataGeo);

  // Country data
  const res = await fetch(
    `https://restcountries.com/v3.1/name/${dataGeo.country}`
  );
  console.log(res);

  // It's excatly the same than this:
  // fetch(`https://restcountries.com/v3.1/name/${country}`).then(res =>console.log(res));

  const data = await res.json();
  console.log(data[0]);
  renderCountry2(data[0]);
};

// whereAmI3();
console.log('FIRST');

///////////////////////////////////////
//// ERROR HANDLING WITH TRY...CATCH ////

// Try catch has nothing to do with async await but we can still use it to catch errors in async functions
try {
  let y = 1;
  const x = 2;
  y = 3;
} catch (err) {
  alert(err.message);
}

const whereAmI4 = async function () {
  try {
    // Geolocation
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;

    // Reverse geocoding
    const resGeo = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    if (!resGeo.ok) throw new Error(`Problem getting location data`);
    const dataGeo = await resGeo.json();
    console.log(dataGeo);

    // Country data
    const res = await fetch(
      `https://restcountries.com/v3.1/name/${dataGeo.country}`
    );
    if (!res.ok) throw new Error(`Problem getting country`);
    console.log(res);

    const data = await res.json();
    console.log(data[0]);
    renderCountry2(data[0]);
  } catch (err) {
    console.error(`HEEEERE: ${err}`);
    renderError(`Something went wrong: ${err.message}`);
  }
};

// whereAmI4();

///////////////////////////////////////
//// RETURNING VALUES FROM ASYNC FUNCTIONS ////

const whereAmI5 = async function () {
  try {
    // Geolocation
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;

    // Reverse geocoding
    const resGeo = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    if (!resGeo.ok) throw new Error(`Problem getting location data`);
    const dataGeo = await resGeo.json();

    // Country data
    const res = await fetch(
      `https://restcountries.com/v3.1/name/${dataGeo.country}`
    );
    if (!res.ok) throw new Error(`Problem getting country`);
    const data = await res.json();
    console.log(data[0]);
    renderCountry2(data[0]);

    return `You are in ${dataGeo.city}, ${dataGeo.country}`;
  } catch (err) {
    console.error(`HEEEERE: ${err}`);
    renderError(`Something went wrong: ${err.message}`);

    //The problem with try catch is that the promise is always fulfilled even when there is an error
    // If we want to fix that and to be able to catch that error with '.catch', we have to rethrow that error right here
    // Reject promise returned from async function:
    throw err;
  }
};

whereAmI5();

console.log('1: Will get location');
// const city = whereAmI5();
// console.log(city);
whereAmI5()
  .then(city => console.log(`2: ${city}`))
  .catch(err => console.error(`2: ${err.message}`)) // The promise is always fulfulled even when there is an error, see "2: undifined" into the console
  .finally(() => console.log('3: Finished getting location'));
// If we want to solve the problem that the 3 is printed before the 2, we can use .finally

//Still a problem, we are mixing async/await and then/catch -> not really good so let's convert everything to async/await
//=> We don't really want a new complete function here so we can use a IIFE (immediately-invoked function expressions)

(async function () {
  try {
    const city = await whereAmI5();
    console.log(`2: ${city}`);
  } catch (err) {
    console.error(`2: ${err.message}`);
  }
  console.log('3: Finished getting location');
})();

///////////////////////////////////////
//// RUNNING PROMISES IN PARALLEL ////

// Doesn't really make sense bc the second call need to wait for the first one to finish while it doesn't depend on the first one (same for the third one)
const get3countries = async function (c1, c2, c3) {
  try {
    const [data1] = await getJSON(`https://restcountries.com/v3.1/name/${c1}`);
    const [data2] = await getJSON(`https://restcountries.com/v3.1/name/${c2}`);
    const [data3] = await getJSON(`https://restcountries.com/v3.1/name/${c3}`);

    console.log([data1.capital, data2.capital, data3.capital]);
  } catch (err) {
    console.log(err);
  }
};

const get3countries2 = async function (c1, c2, c3) {
  try {
    //all is a static method that takes an array of promises and return a new promise, which will then run all the promises in the array at the same time
    const data = await Promise.all([
      getJSON(`https://restcountries.com/v3.1/name/${c1}`),
      getJSON(`https://restcountries.com/v3.1/name/${c2}`),
      getJSON(`https://restcountries.com/v3.1/name/${c3}`),
    ]);
    //NOTE : if one of the promises reject, the whole promise .all rejects as well

    console.log(data);
    console.log(data.map(d => d[0].capital));
  } catch (err) {
    console.error(err);
  }
};

get3countries2('portugal', 'canada', 'tanzania');

///////////////////////////////////////
//// OTHER PROMISE COMBINATORS: RACE, ALLSETTLED AND ANY ////

// Promise.race

// Receives an array of promises and returns a promise
(async function () {
  const res = await Promise.race([
    getJSON('https://restcountries.com/v3.1/name/italy'),
    getJSON('https://restcountries.com/v3.1/name/egypt'),
    getJSON('https://restcountries.com/v3.1/name/mexico'),
  ]);

  // We only get ONE RESULT  and ont an array of the results of all the three. This result is the winner of the race, no matter if it's fulfilled or rejected
  console.log(res[0]);
})();

// We can create a special time out promise which basically rejects after a certain time has passed
// Note: it's similar to the wait function but the difference is that this one is actually going reject and not going to resolve
const timeout = function (sec) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error('Request took too long!'));
    }, sec * 1000);
  });
};

// const wait = function (seconds) {
//   return new Promise(function (resolve) {
//     setTimeout(resolve, seconds * 1000);
//   });
// };

Promise.race([
  getJSON('https://restcountries.com/v3.1/name/peru'),
  timeout(0.38),
])
  .then(res => console.log(res[0]))
  .catch(err => console.error(err));
// So we have these two promises racing against each other and if the timeout happens first then all of this will be rejected

//Promise.allStelled
// It takes an array of promises and simply return an array of all the setlled promises (no matter if the promises got rejected or not)
// The difference with Promise.all is that Promise.all will short circuit as soon as one promise rejects but Promise.allSettled simply never short circuits
Promise.allSettled([
  Promise.resolve('succes'),
  Promise.reject('ERROR'),
  Promise.resolve('Another success'),
]).then(res => console.log(res));

Promise.all([
  Promise.resolve('succes'),
  Promise.reject('ERROR'),
  Promise.resolve('Another success'),
])
  .then(res => console.log(res))
  .catch(err => console.error(err));

// Promise.any [ES2021]
Promise.any([
  Promise.resolve('succes'),
  Promise.reject('ERROR'),
  Promise.resolve('Another success'),
])
  .then(res => console.log(res))
  .catch(err => console.error(err));

///////////////////////////////////////
// Coding Challenge #3

// PART 1
// Write an async function 'loadNPause' that recreates Coding Challenge #2, this time using async/await (only the part where the promise is consumed). Compare the two versions, think about the big differences, and see which one you like more.
// Don't forget to test the error handler, and to set the network speed to 'Fast 3G' in the dev tools Network tab.

const loadNPause = async function (imgPath1, imgPath2) {
  try {
    const img1 = await createImage(imgPath1);
    console.log('Image 1 loaded');
    await wait(2);

    img1.style.display = 'none';
    const img2 = await createImage(imgPath2);

    console.log('Image 2 loaded');
    await wait(2);

    img2.style.display = 'none';
  } catch (err) {
    console.error(`Here's your error: ${err.message}`);
  }
};

// loadNPause('img/img-1.jpg', 'img/img-3.jpg');

// PART 2
// 1. Create an async function 'loadAll' that receives an array of image paths 'imgArr';
// 2. Use .map to loop over the array, to load all the images with the 'createImage' function (call the resulting array 'imgs')
// 3. Check out the 'imgs' array in the console! Is it like you expected?
// 4. Use a promise combinator function to actually get the images from the array 😉
// 5. Add the 'paralell' class to all the images (it has some CSS styles).

const loadAll = async function (imgArr) {
  try {
    // const imgs1 = await imgArr.map(img => createImage(img));
    // console.log(imgs1);
    // imgs1[0].then(e => console.log(e));

    const imgs = await Promise.all(imgArr.map(imgSrc => createImage(imgSrc)));
    console.log(imgs);
    imgs.forEach(img => img.classList.add('parallel'));
  } catch (err) {
    console.error(`Here's your error: ${err.message}`);
  }
};

//PROF:
// const loadAll = async function (imgArr) {
//   try {
//     const imgs = imgArr.map(async img => await createImage(img));
//     const imgsEl = await Promise.all(imgs);
//     console.log(imgsEl);
//     imgsEl.forEach(img => img.classList.add('parallel'));
//   } catch (err) {
//     console.error(err);
//   }
// };

loadAll(['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg']);

// TEST DATA: ['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg']. To test, turn off the 'loadNPause' function.

// GOOD LUCK 😀
