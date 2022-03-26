import * as model from './model.js'; //We import everything from model.js
import { MODAL_CLOSE_SEC, MODAL_UPDATE_SEC } from './config.js';
import recipeView from './views/recipeViews.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import numPagesView from './views/numpagesView.js';

// These imports will make sure that most real old browsers are still being suported by our application
import 'core-js/stable'; // This one is for polyfilling everything else
import 'regenerator-runtime/runtime'; //This one is for polyfilling async/await

//This is not real Javascript, this is coming from Parcel
// It keeps what we have on the page when we reload the page, so the state actually remains
// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

//Async function so works in the background
const controlRecipes = async function () {
  try {
    // 0) Update results view and bookmarks to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    // console.log(model.getSearchResultsPage());

    // 1) Get the id
    //Window.location.hash gives the part of the url after the # symblol
    // console.log(window.location);
    const id = window.location.hash.slice(1);
    // the id contains the # sign and we don't want it so we use .slice(1)
    // console.log(id);
    // We need a guard clause
    if (!id) return;
    // 2) Load Recipe
    recipeView.renderSpinner();
    // console.log(recipeView);
    await model.loadRecipe(id);

    //3) Render Recipe
    recipeView.render(model.state.recipe);
    // console.log(model.state.recipe);

    // console.log(recipeView);
  } catch (err) {
    // alert(err);
    console.error(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // 1) Get Search Query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load Search Results
    resultsView.renderSpinner();
    // console.log(resultsView);
    await model.loadSearchResults(query);

    //3) Render Results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());
    // console.log(model.state.search);

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
    numPagesView.render(model.state.search);

    //My code:
    // 5) Add events on buttons
    // paginationView.addHandlerPagination(controlPaginationMe);
  } catch (err) {
    console.error(err);
    // resultsView.renderError();
  }
};

// My code:
// const controlPaginationMe = function (dir) {
//   console.log(dir);
//   //1) Get the new page
//   const newPage =
//     dir === 'next' ? model.state.search.page + 1 : model.state.search.page - 1;

//   //2) Render Results
//   resultsView.render(model.getSearchResultsPage(newPage));
//   console.log(model.state.search);

//   // 3) Render pagination buttons
//   paginationView.render(model.state.search);

//   // 4) Add events on buttons
//   paginationView.addHandlerPagination(controlPaginationMe);
// };

//Prof's code:
const controlPagination = function (goToPage) {
  // 1) Render NEW Results
  resultsView.render(model.getSearchResultsPage(goToPage));
  // console.log(model.state.search);
  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
  numPagesView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update the recipe servings (in state)
  model.updateServings(newServings);
  //Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe); // This update method will only update text and attrivutes in the DOM wihout having to re-render the entire view.
};

const controlAddBookmark = function () {
  // 1) Add/Remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // console.log(model.state.recipe);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  //3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

// We need to load and render the bookmarks directly when the window load for the first time (and thefore, then we will be bale to just update it at some points)
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // console.log(newRecipe);

    //Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    // console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);
    // We use render and not update bc we want to insert a new element

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // It allows us to change the URL without reloading the page
    // .pushState takes 3 arguments:
    // - The state (doesn't really matter)
    // - The title (alos no relevant)
    // - The URL
    // Close form window

    setTimeout(function () {
      addRecipeView.toggleWindow();
      setTimeout(function () {
        addRecipeView.render(1);
      }, MODAL_UPDATE_SEC * 1000);
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(`Here's your error: ${err.message}`);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
