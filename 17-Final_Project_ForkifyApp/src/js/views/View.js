import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @returns {undefined}
   * @this {Object} View instance
   * @author Kiki
   * @todo Finish implementation
   */
  render(data) {
    if (!data || (Array.isArray(data) && data.length == 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    // if (!data || (Array.isArray(data) && data.length == 0)) return;
    this._data = data;
    const newMarkup = this._generateMarkup();
    // We need to compare this new markup to the old one. This newMarkup is a string so it's not easy to compare. Therefore, we will convert this newMarkup string to a DOM object that's living in the memory and that we can then use to compare with the actual DOM that's on the page.
    const newDOM = document.createRange().createContextualFragment(newMarkup); //This method will convert a string to a real DOM Node object (a DOM that's not really living on the page but which lives in our memory)

    // * selects amm the elements in there, it returns a NodeList so we can convert it to real array
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // console.log(newDOM);
    // console.log(newElements);
    // console.log(curElements);

    //Comparaison between the arrays
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      // Update changed TEXT:
      // We want to replace only the elements that contain text
      // To do it we can use .nodeValue bc the value will be null (or '') the node is an element and the content of the text node if the node is a text
      // We need to select the first child bc the child node is actually what contains the text => SEE ADVANCED DOM SECTION!
      // .trim will trim the white spaces
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log('Here:', newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      // Updates changed ATTRIBUTES
      //Then we also need to update the attributes on the buttons
      if (!newEl.isEqualNode(curEl)) {
        // console.log(newEl.attributes);
        //We want to loop over all the attributes of the element. First we need to convert it to an array
        // console.log(Array.from(newEl.attributes));
        Array.from(newEl.attributes).forEach(
          attr => curEl.setAttribute(attr.name, attr.value) // SEE ADVANCED DOM SECTION !! We update/set the name and the value of the attributes of the current element with the value coming from the new element
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = ''; //To remove all the existing html
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div> 
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
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
