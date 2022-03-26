import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded :)';

  // We want the function addHandlerShowWindow to be called as soon as the page loads
  // In this case it has nothing to do with any controller so we can simply run this function here as soon as this object is created
  // So far that we need to add a constructor method
  constructor() {
    super(); //Recap: only after calling super we wan use the this keyword
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
    // this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    // this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
  }

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  toggleWindow() {
    // toggle add the class when it's not there and remove the class when it's already there
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    // The this keyword inside of a handler function points to the element on which that listener is attached to
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    // The this keyword inside of a handler function points to the element on which that listener is attached to
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      // We can get access to all the values by selecting them one by one but there is a better way, we can use something called FORM DATA
      // It's a pretty modern browser API that we can make use of
      // Into the FormData constructor we have to pass in an element thas is a form
      // That form in this case is the this key word bc we are inside of a handler function so the this key word point to this._parentElement, which is the upload form
      // It will return a weird object but we can spread that object into an array that will contains all the fields with all the values in there
      const dataArr = [...new FormData(this)];

      // In JavaScript, there sis now a new method that wa can use to convert entries to an object
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  _generateMarkup() {
    return `
      <div class="upload__column">
          <h3 class="upload__heading">Recipe data</h3>
          <label>Title</label>
          <input value="TEST1234" required name="title" type="text" />
          <label>URL</label>
          <input value="TEST1234" required name="sourceUrl" type="text" />
          <label>Image URL</label>
          <input value="TEST1234" required name="image" type="text" />
          <label>Publisher</label>
          <input value="TEST1234" required name="publisher" type="text" />
          <label>Prep time</label>
          <input value="23" required name="cookingTime" type="number" />
          <label>Servings</label>
        <input value="23" required name="servings" type="number" />
      </div>

      <div class="upload__column">
          <h3 class="upload__heading">Ingredients</h3>
          <label>Ingredient 1</label>
          <input
              value="0.5,kg,Rice"
              type="text"
              required
              name="ingredient-1"
              placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 2</label>
          <input
              value="1,,Avocado"
              type="text"
              name="ingredient-2"
              placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 3</label>
          <input
              value=",,salt"
              type="text"
              name="ingredient-3"
              placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 4</label>
          <input
              type="text"
              name="ingredient-4"
              placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 5</label>
          <input
              type="text"
              name="ingredient-5"
              placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 6</label>
          <input
              type="text"
              name="ingredient-6"
              placeholder="Format: 'Quantity,Unit,Description'"
          />
      </div>

      <button class="btn upload__btn">
          <svg>
              <use href="${icons}#icon-upload-cloud"></use>
          </svg>
          <span>Upload</span>
      </button>
    `;
  }
}

export default new AddRecipeView();
