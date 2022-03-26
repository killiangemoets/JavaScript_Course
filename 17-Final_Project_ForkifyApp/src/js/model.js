import { API_URL, RES_PER_PAGE, API_KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
    // Nice trick to conditonally add a property to an object:
    // We only want to add the key if there actually exists one
    // Note: we spread that object to put the values here
  };
};

// This function is not a pure function bc it manipulates the variable "state" that is outside of the function
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);
    // console.log(data);
    state.recipe = createRecipeObject(data);

    // console.log(state.recipe);
    // Recap: some will loop over the array and return true if any of them has true for the condition that we will specify
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    // Temp error handling
    // console.error(`There's an error: ${err} `);
    throw err;
  }
};

// Again, this function is going to be called by the controller
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    // console.log(data);
    // console.log(data.data.recipes);

    // if (
    //   !data ||
    //   (Array.isArray(data.data.recipes) && data.data.recipes.length == 0)
    // )
    //   throw new Error('Error loading the research');

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    // We reset the current page to 1
    state.search.page = 1;

    // console.log(state.search);
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = state.search.resultsPerPage * (page - 1);
  const end = state.search.resultsPerPage * page; // Because the slice method doesn't include the last value that we pass in
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    //newQt = oldQT * newServings/ OldServings
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  //setItem add or remove an item from the localstorage
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks)); // JSON.stringify converts an object to a string
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark
  // Note: state.recipe is the recipe that we are currently loading in our app
  if ((recipe.id = state.recipe.id)) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  // Recap: to delete something, we use the splice method
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if ((id = state.recipe.id)) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage); // JSON.parse converts a string to an object
};

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

init();
// console.log(state.bookmarks);

export const uploadRecipe = async function (newRecipe) {
  try {
    // Object.entries is the opposite of Object.fromEntries, it will convert the object to an array
    // console.log(Object.entries(newRecipe));
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        const ingArr = ing[1].split(',').map(el => el.trim());

        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format. Please use the correct format!'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    // console.log(ingredients);

    // We create the recipe with the format that the API is ready to receive
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    // console.log(recipe);
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    // console.log(data); //In data we now have a key variable
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
