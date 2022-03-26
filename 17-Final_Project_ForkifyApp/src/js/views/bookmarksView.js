// import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends previewView {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message = 'No bookmarks yet. Find a nice recipe and bookmark it :)';

  //   _generateMarkup() {
  //     // console.log(this._data);
  //     // return this._data.map(bookmark => previewView.render(bookmark)).join('');
  //   }

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}

export default new BookmarksView();
