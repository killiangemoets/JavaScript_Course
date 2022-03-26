'use strict';
// create variables
const player1 = document.querySelector('.player--0');
const player2 = document.querySelector('.player--1');
const scorePlayer1 = document.querySelector('#score--0');
const scorePlayer2 = document.querySelector('#score--1');
const currentPlayer1 = document.querySelector('#current--0');
const currentPlayer2 = document.querySelector('#current--1');
const dice = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');

let diceValue, activePlayer, currentScore, scores, scoreToWin;
//game init
const init = function () {
  scorePlayer1.textContent = 0;
  scorePlayer2.textContent = 0;
  currentPlayer1.textContent = 0;
  currentPlayer2.textContent = 0;
  dice.classList.add('hidden');
  player1.classList.add('player--active');
  player2.classList.remove('player--active');
  player1.classList.remove('player--winner');
  player2.classList.remove('player--winner');
  diceValue = 0;
  activePlayer = 0;
  currentScore = 0;
  scores = [0, 0];
  scoreToWin = 20;
};
init();

//User rolls dice
btnRoll.addEventListener('click', function () {
  if (scores[0] < scoreToWin && scores[1] < scoreToWin) {
    // Dice
    diceValue = Math.trunc(Math.random() * 6) + 1;
    console.log(diceValue);
    document.querySelector('.dice').src = `dice-${diceValue}.png`;
    document.querySelector('.dice').classList.remove('hidden');

    //Current score
    if (diceValue !== 1) {
      currentScore += diceValue;
      console.log(currentScore);
      if (!activePlayer) {
        currentPlayer1.textContent = currentScore;
      } else {
        currentPlayer2.textContent = currentScore;
      }
    } else {
      currentScore = 0;
      if (!activePlayer) {
        currentPlayer1.textContent = currentScore;
        player1.classList.remove('player--active');
        player2.classList.add('player--active');
        activePlayer = 1;
      } else {
        currentPlayer2.textContent = currentScore;
        player1.classList.add('player--active');
        player2.classList.remove('player--active');
        activePlayer = 0;
      }
    }
  }
});

//User holds score
btnHold.addEventListener('click', function () {
  if (!activePlayer) {
    scores[0] += currentScore;
    if (scores[0] < scoreToWin) {
      scorePlayer1.textContent = scores[0];
      player1.classList.remove('player--active');
      player2.classList.add('player--active');
      currentScore = 0;
      currentPlayer1.textContent = currentScore;
      activePlayer = 1;
    } else {
      player1.classList.add('player--winner');
    }
  } else {
    scores[1] += currentScore;
    if (scores[1] < scoreToWin) {
      scorePlayer2.textContent = scores[1];
      player1.classList.add('player--active');
      player2.classList.remove('player--active');
      currentScore = 0;
      currentPlayer2.textContent = currentScore;
      activePlayer = 0;
    } else {
      player2.classList.add('player--winner');
    }
  }
});

//User resets game ;
btnNew.addEventListener('click', init);
