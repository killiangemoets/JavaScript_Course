import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  // My code
  //   addHandlerPagination(handler) {
  //     const buttonPrev = this._parentElement.querySelector(
  //       '.pagination__btn--prev'
  //     );
  //     if (buttonPrev) {
  //       buttonPrev.addEventListener('click', function (e) {
  //         e.preventDefault();
  //         handler();
  //       });
  //     }

  //     const buttonNext = this._parentElement.querySelector(
  //       '.pagination__btn--next'
  //     );
  //     if (buttonNext) {
  //       buttonNext.addEventListener('click', function (e) {
  //         e.preventDefault();
  //         handler('next');
  //       });
  //     }
  //   }

  // The prof's code, using event delegation
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      // We can simply create a button element and select the closest button element to the clicked element
      const btn = e.target.closest('.btn--inline');
      //   console.log(btn);
      if (!btn) return;

      const goToPage = +btn.dataset.goto; //To add a+ sign to convert it to a number
      //   console.log(goToPage);
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // console.log(numPages);

    let markup = '';

    if (currentPage > 1)
      markup += `
          <button data-goto="${
            currentPage - 1
          }" class="btn--inline pagination__btn--prev">
              <svg class="search__icon">
                <use href="${icons}g#icon-arrow-left"></use>
              </svg>
              <span>Page ${currentPage - 1}</span>
          </button>
    `;
    //   markup += `
    //   <div class="num-pages">
    //   <p>7 pages</p>
    // </div>`;

    if (currentPage < numPages)
      markup += `
        <button data-goto="${
          currentPage + 1
        }"class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button
  `;

    return markup;

    // //Page 1, and there are other pages
    // if (currentPage === 1 && numPages > 1) {
    //   return `
    //     <button class="btn--inline pagination__btn--next">
    //         <span>Page ${currentPage + 1}</span>
    //         <svg class="search__icon">
    //           <use href="${icons}#icon-arrow-right"></use>
    //         </svg>
    //     </button
    //     `;
    // }

    // // Last page
    // if (currentPage === numPages && numPages > 1) {
    //   return `
    //     <button class="btn--inline pagination__btn--prev">
    //         <svg class="search__icon">
    //           <use href="${icons}g#icon-arrow-left"></use>
    //         </svg>
    //         <span>Page ${currentPage - 1}</span>
    //     </button>
    // `;
    // }
    // // Other page
    // if (currentPage < numPages) {
    //   return `
    //   <button class="btn--inline pagination__btn--prev">
    //         <svg class="search__icon">
    //             <use href="${icons}g#icon-arrow-left"></use>
    //         </svg>
    //         <span>Page ${currentPage - 1}</span>
    //     </button>
    //     <button class="btn--inline pagination__btn--next">
    //         <span>Page ${currentPage + 1}</span>
    //         <svg class="search__icon">
    //             <use href="${icons}#icon-arrow-right"></use>
    //         </svg>
    //     </button
    // `;
    // }

    // //Page 1, and there are no other pages
    // return '';
  }
}

export default new PaginationView();
