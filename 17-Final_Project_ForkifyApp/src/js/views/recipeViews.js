import View from './View.js';
import { numberToFraction } from '../helpers.js';

// In our template litteral above we are writing the old paths of the icons while in the file "dist" the icons have a new path
// We need a way to tell to Javascript that the icons file changed
// We can do that with parcel by simply importing the icons file
// import icons from '../img/icons.svg'; //Parcel
import icons from 'url:../../img/icons.svg'; //Parcel 2
// "icons" is a name that we chose, it can be anything.

// This package coming from "npm install fractional" will allow us to display numbers in the form of fractions
// import { Fraction } from 'fractional';

// console.log(icons);
// console.log(Fraction);

// We use a class bc later we ill also have a parent class called View which will countain a couple of methods that all the views should inherit
class RecipeView extends View {
  // Note: Right now, with Parcel and Babel, inheritance between truly private fields and methods  doesn't really work yet. So we cannot use the # symbol in front of variables and function, so let's use _ to at least make it protected using the underscore convention.
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'We could not find that recipe. Please try another one!';
  _message = '';

  // This method is the publisher and needs to get access to the subscriber (i.e., the handler function in this case)
  addHandlerRender(handler) {
    // window.addEventListener('hashchange', handler);
    // window.addEventListener('load', handler);
    // Can be write like it:
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
    //This line has more to do with DOM Manipulation than with the controller, this is why we wanted to put it in the recipeView.js file!
  }

  addHandlerUpdateServings(handler) {
    //Again, let's use event delegation

    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return;
      // console.log(btn);
      const { updateTo } = btn.dataset;
      if (+updateTo > 0) handler(+updateTo);
    });
  }

  addHandlerAddBookmark(handler) {
    // We use event delegation bc the button doesn't exist by the time the application is loaded

    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }

  _generateMarkup() {
    return `
    <figure class="recipe__fig">
          <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
    </figure>

    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-clock"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${
          this._data.cookingTime
        }</span>
        <span class="recipe__info-text">minutes</span>
      </div>
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-users"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${
          this._data.servings
        }</span>
        <span class="recipe__info-text">servings</span>

        <div class="recipe__info-buttons">
          <button class="btn--tiny btn--update-servings" data-update-to="${
            this._data.servings - 1
          }">
            <svg>
              <use href="${icons}#icon-minus-circle"></use>
            </svg>
          </button>
          <button class="btn--tiny btn--update-servings" data-update-to="${
            this._data.servings + 1
          }">
            <svg>
              <use href="${icons}#icon-plus-circle"></use>
            </svg>
          </button>
        </div>
      </div>

      <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
      <svg>
        <use href="${icons}#icon-user"></use>
      </svg>
    </div>
      <button class="btn--round btn--bookmark">
        <svg class="">
          <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
        </svg>
      </button>
    </div>

    <div class="recipe__ingredients">
      <h2 class="heading--2">Recipe ingredients</h2>
      <ul class="recipe__ingredient-list">
      ${this._data.ingredients.map(this._generateMarkupIngredient).join('')}

      </ul>
    </div>

    <div class="recipe__directions">
      <h2 class="heading--2">How to cook it</h2>
      <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__publisher">${
          this._data.publisher
        }</span>. Please check out
        directions at their website.
      </p>
      <a
        class="btn--small recipe__btn"
        href= ${this._data.sourceUrl}
        target="_blank"
      >
        <span>Directions</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </a>
    </div>`;
  }

  _generateMarkupIngredient(ing) {
    return `
      <li class="recipe__ingredient">
      <svg class="recipe__icon">
        <use href="${icons}#icon-check"></use>
      </svg>
      <div class="recipe__quantity">${
        ing.quantity ? numberToFraction(ing.quantity).toString() : ''
      }</div>
      <div class="recipe__description">
        <span class="recipe__unit">${ing.unit}</span>
        ${ing.description}
      </div>
    </li>`;
  }
}

//We could export the class RecipeView and create an object with the class RecipeView in the controller.js file
// However, instead we already create an object here and we export this object
// Like that it doesn't allow us to create others objects with this class in the controller.js file
export default new RecipeView();
