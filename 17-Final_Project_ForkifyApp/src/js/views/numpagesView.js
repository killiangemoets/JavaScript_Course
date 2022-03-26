import View from './View.js';
// import icons from 'url:../../img/icons.svg';

class NumPagesView extends View {
  _parentElement = document.querySelector('.num-pages');

  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const markup = `
        <div class="num-pages">
          <p>Page ${currentPage} of ${numPages}</p>
        </div>`;
    return markup;
  }
}

export default new NumPagesView();
