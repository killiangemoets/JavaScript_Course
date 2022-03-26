// The goal of this module is to have a central place for the functions that we reuse over and over in our project

import { TIMEOUT_SECONDS } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fecthPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    // We do a race between the fetch and a timeout to return an error if the browser is too slow
    const res = await Promise.race([fecthPro, timeout(TIMEOUT_SECONDS)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`Hey there: ${data.message} (${res.status})`);

    return data;
  } catch (err) {
    throw err;
    // By doing this, the promise that's being returned from getJSON will actually reject
    // So then we will be able to actually handle the error in the model.js file
  }
};

/*
export const getJSON = async function (url) {
  try {
    // We do a race between the fetch and a timeout to return an error if the browser is too slow
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SECONDS)]);
    const data = await res.json();

    // console.log(res);
    // console.log(data);

    if (!res.ok) throw new Error(`Hey there: ${data.message} (${res.status})`);

    return data;
  } catch (err) {
    throw err;
    // By doing this, the promise that's being returned from getJSON will actually reject
    // So then we will be able to actually handle the error in the model.js file
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    // TO send data, that needs to be a post request. To do that, besides the adress, we also need an object of some options
    // The first option is the method
    // Then we need an object of headers, i.e. information about the request itself
    // With Content-Type we say to the API than the request that we will send is going to be in the JSON format
    // Finally we need the payload of the request, so the data that we want to send
    // JSON.stringify converts an object to a string
    const fecthPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });

    // We do a race between the fetch and a timeout to return an error if the browser is too slow
    const res = await Promise.race([fecthPro, timeout(TIMEOUT_SECONDS)]);
    // We will wait any data to come back bc the API that we're gonna use will actually return the data back that we just sent
    const data = await res.json();

    // console.log(res);
    // console.log(data);

    if (!res.ok) throw new Error(`Hey there: ${data.message} (${res.status})`);

    return data;
  } catch (err) {
    throw err;
    // By doing this, the promise that's being returned from getJSON will actually reject
    // So then we will be able to actually handle the error in the model.js file
  }
};
*/

export const numberToFraction = function (amount) {
  // This is a whole number and doesn't need modification.
  if (parseFloat(amount) === parseInt(amount)) {
    return amount;
  }
  // Next 12 lines are cribbed from https://stackoverflow.com/a/23575406.
  const gcd = function (a, b) {
    if (b < 0.0000001) {
      return a;
    }
    return gcd(b, Math.floor(a % b));
  };
  const len = amount.toString().length - 2;
  let denominator = Math.pow(10, len);
  let numerator = amount * denominator;
  var divisor = gcd(numerator, denominator);
  numerator /= divisor;
  denominator /= divisor;
  let base = 0;
  // In a scenario like 3/2, convert to 1 1/2
  // by pulling out the base number and reducing the numerator.
  if (numerator > denominator) {
    base = Math.floor(numerator / denominator);
    numerator -= base * denominator;
  }
  amount = Math.floor(numerator) + '/' + Math.floor(denominator);
  if (base) {
    amount = base + ' ' + amount;
  }
  return amount;
};
