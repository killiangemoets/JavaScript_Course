'use strict';

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');

///////////////////////////////////////
////// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//// Button scrolling
btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

//// Page navigation
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });
//This is a good solution for 3 elements but not for 1000 bc with the for each function we will create 1000 copies of the same function

// The best solution is to use event delegetion. In event delegation we use the fact that events bubble up and so we put the event listener on a commun parent of all the elements that we are interested in.
// 1. Add event listener to commun parent element
//2. Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  console.log(e.target);
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//// Tabbed component
tabs.forEach(t => t.addEventListener('click', () => console.log('TAB'))); // But not the best way, let's use again event delegation

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);

  // Guard close
  if (!clicked) return;

  //we could alsor do:  if (clicked) { ...

  //Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));

  //Active tab
  clicked.classList.add('operations__tab--active');

  //Active content area
  console.log(clicked.dataset.tab);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//// Menu fade animation
const handleHover = function (e, opac) {
  console.log(this, e.currentTarget);
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    // console.log(siblings);
    // console.log(link);
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
// After 'mouseover' and 'moseout', JavaScript expects a function (not a value which would be the result of calling the function) !!
// nav.addEventListener('mouseover', function (e) {
//   handleHover(e, 0.5);
// });
// nav.addEventListener('mouseout', function (e) {
//   handleHover(e, 1);
// });

//Other way to do the same thing:
// Bc bind returns a new function
// So here we use the bind method to pass an argument into a handler function
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

//// Sticky navigation

// Prof's solution but work only if we load the page on the top
// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function (e) {
//   console.log(window.scrollY);
//   console.log(initialCoords);
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// My solution
// let initialCoords = {};
// window.addEventListener('scroll', function (e) {
//   initialCoords = section1.getBoundingClientRect();
//   // console.log(initialCoords);
//   if (initialCoords.top < 0) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

//Better way of doing it: The Intersection Observer API
const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);
const stickyNav = function (entries) {
  const [entry] = entries; // let's use destructuring to get the first element (and only one) of the threshold
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

//// Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//// Lazy loading images
//Note : it's really great for performance
const imgTargets = document.querySelectorAll('img[data-src]');
console.log(imgTargets);

const loadImg = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  //Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  //Remove the blurred filter
  // Better to remove the blurred filter once the image is loaded
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '-200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

////// Slider
const slides = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');
  let curSlide = 0;
  const maxSlide = slides.length - 1;

  //Functions :
  // Creat the dots
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };
  // Show the active dot
  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };
  //Moving to a slide
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
      // curSlide 1: -100%, 0%, 100%, 200%, ...
    );
  };
  // Next Slide
  const nextSlide = function () {
    if (curSlide === maxSlide) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };
  // Previous Slide
  const prevSlide = function () {
    if (curSlide === 0) curSlide = maxSlide;
    else curSlide--;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    //Initiate the slides
    goToSlide(0);
    // 0%, 100%, 200%, 300%, ...
    createDots();
    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    console.log(e);
    if (e.key === 'ArrowLeft') prevSlide();
    // if (e.key === 'ArrowRight') nextSlide();
    // Recap, we could do this:
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      // console.log('DOT');
      const slide = e.target.dataset.slide;
      // We can use destructuring because slide on both side of the equal:
      // const {slide} = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slides();

///////////////////////////////////////////////////
////////////////// EXPERIMENTS //////////////

// //// Selecting, Creating, and Deleting Elements ////

// // Selection ELEMENTS
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const header = document.querySelector('.header'); //the first element with the class header
// const allSections = document.querySelectorAll('.section'); //all the elements with the class section
// console.log(allSections);
// //It is a NodeList
// //It DOES NOT update itself if I delete an element

// console.log(document.getElementById('section--1'));
// const allButtons = document.getElementsByTagName('button');

// console.log(allButtons);
// // It's an HTMLCollection
// // It DOES UPDATE itslef if I delete and element

// console.log(document.getElementsByClassName('btn'));

// // Creating and inserting elements
// // .insertAdjacentHTML

// const message = document.createElement('div');

// message.classList.add('cookie-message');
// // message.textContent = 'We use cookies for improved functionality and analytics.';
// message.innerHTML =
//   'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Gor it!</button>';

// header.prepend(message);
// //Prepend will add message as the first child of the header

// header.append(message);
// //Prepend will add message as the last child of the header
// //Note the element "message" is only inserted once bc it's a life element living in the DOM

// // header.append(message.cloneNode(true));

// header.before(message);
// //Before will add message before the header

// header.after(message);
// //After  will add message after the header

// // Delete elements
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove();
//     // document.querySelector('.cookie-message').remove(); //it does the same
//     message.parentElement.removeChild(message); //how we used to do it before bc before we were just able to delete the direct child of an element
//   });

// ///////////////////////////////////////////////////
// //// Styles, Attributes, and Classes ////

// // Styles
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// console.log(message.style.color); //Can't be find cause it's in css
// console.log(message.style.backgroundColor); // Can be find cause it's a line style in html

// console.log(getComputedStyle(message).color); // Now it can be find
// console.log(getComputedStyle(message).height);

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height) + 30 + 'px';

// console.log(getComputedStyle(message).height);

// document.documentElement.style.setProperty('--color-primary', 'orangered');

// //Get Attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.getAttribute('src'));
// console.log(logo.className);
// // Works only for standard properties

// // Non-standard
// console.log(logo.designer);
// console.log(logo.getAttribute('designer'));

// //Set Attributes
// logo.alt = 'Beautiful minimalist logo';
// logo.setAttribute('company', 'Bankist');

// const link = document.querySelector('.nav__link--btn');
// console.log(link.href);
// console.log(link.getAttribute('href'));

// //Data attributes
// console.log(logo.dataset.versionNumber);

// //Classes
// logo.classList.add('c');
// logo.classList.remove('c');
// logo.classList.toggle('c');
// logo.classList.contains('c'); //not includes

// // Don't use it because it overwrite all the existing classes
// logo.className = 'kiki';

// ///////////////////////////////////////////////////
// //// Implementing Smooth Scrolling ////
// const btnScrollTo = document.querySelector('.btn--scroll-to');
// const section1 = document.querySelector('#section--1');

// btnScrollTo.addEventListener('click', function (e) {
//   const s1coords = section1.getBoundingClientRect();
//   console.log(s1coords);

//   console.log(e.target.getBoundingClientRect()); // e.target is btnScrollTo

//   console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset); // Give the distance that we scrolled. If we are on the top, Y=0.

//   console.log(
//     'Height/Width viewport',
//     document.documentElement.clientHeight,
//     document.documentElement.clientWidth
//     // Height and Width of the viewport
//   );

//   // // Scrolling
//   // window.scrollTo(s1coords.left, s1coords.top);
//   // // Doesn't work very well bc the top here is related to the top of the viewport and not the top of the page

//   // window.scrollTo(
//   //   s1coords.left + window.pageXOffset,
//   //   s1coords.top + window.pageYOffset
//   // );
//   // // This is why we have to add the current distance that we scrolled

//   // // It's also possible to change the behavior by using an obtject.
//   // window.scrollTo({
//   //   left: s1coords.left + window.pageXOffset,
//   //   top: s1coords.top + window.pageYOffset,
//   //   behavior: 'smooth',
//   // });

//   //More modern way of doin it
//   section1.scrollIntoView({ behavior: 'smooth' });
// });

// ///////////////////////////////////////////////////
// //// Types of Events and Event Handlers ////

// const h1 = document.querySelector('h1');

// // h1.addEventListener('mouseenter', function (e) {
// //   alert('Great!');
// // });

// // Old school way
// // h1.onmouseenter = function (e) {
// //   alert('Great 2!');
// // };

// //AddEVentListener is better bc:
// // - It allows us to add multiple event listeners to the same event
// // - We can remove an event handler in case we don't need it anymore :

// const alertH1 = function (e) {
//   alert('Great 3!');
//   h1.removeEventListener('mouseenter', alertH1);
// };

// // h1.addEventListener('mouseenter', alertH1);

// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);
// // Removing the event after a certain time

// ///////////////////////////////////////////////////
// //// Event Propagation: Bubbling and Capturing ////

// //rgb(255,255,255)
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// console.log(randomColor());

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   console.log('LINK', e.target, e.currentTarget);
//   this.style.backgroundColor = randomColor();
//   console.log(e.currentTarget === this);

//   //Stop event propagation
//   e.stopPropagation();
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   console.log('CONTAINER', e.target, e.currentTarget);
//   this.style.backgroundColor = randomColor();
//   console.log(e.currentTarget === this);
// });

// document.querySelector('.nav').addEventListener(
//   'click',
//   function (e) {
//     console.log('NAV', e.target, e.currentTarget);
//     this.style.backgroundColor = randomColor();
//     console.log(e.currentTarget === this);
//   },
//   true
// );
// //  We can define a third parameter in the addEventListener function.
// // When this used capture parameter is set to true, the event handler will no longer listen to bubbling events, but instead to capturing events!
// // If we check in the console, now the nav is the first element appearing

// ///////////////////////////////////////////////////
// //// DOM Travsersing ////

// const h1 = document.querySelector('h1');

// // Going downwards: children
// console.log(h1.querySelectorAll('.highlight'));
// //It woudl go down as deep as necessary in the dom tree (doesn't only select the frst children)

// //To get the DIRECT children:
// console.log(h1.childNodes); //Gives us every single node (event texts, commentsn etc.)
// console.log(h1.children); //Give the elements themselves

// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'blue';

// // Going upwards: parents

// //To get the DIRECT parent:
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest('.header').style.background = 'var( --gradient-secondary)';

// h1.closest('h1').style.background = 'black'; //it's the element itself

// //Going sideways: siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// console.log(h1.parentElement.children);

// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) el.style.transform = 'scale(0.5)';
// });

// ///////////////////////////////////////////////////
// //// A Better Way: The Intersection Observer API ////

// // This function will be called each time the observed element (i.e the target element) is intersecting the root element at the threshold that we defined
// // the entries is an array containing the elements of the threshold
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const obseOptions = {
//   root: null, //the root is the element that we want our target element to intersect
//   // If root is null, we'll be able to observe our target element intersecting the entire viewport
//   threshold: [0, 0.2], //this is the percentage of intersection at which the observer callback will be called (i.e, obsCallBack)
//   // 0% means that our callback will trigger each time that the target element moves completely out of the view and also when it enters the view
// };

// // The callback function will be called when the thresold is passed when moving into the view AND when moving out of the view
// const observer = new IntersectionObserver(obsCallback, obseOptions);

// observer.observe(section1); // section 1 is the target

// // //// Lifecycle DOM Events ////
// document.addEventListener('DOMContentLoaded', function (e) {
//   console.log('HTML parsed and DOM tree built!');
// });

// // When we have the script tag at the end of the HTML, then we do NOT need to listen for the DOM content loaded event

// window.addEventListener('load', function (e) {
//   console.log('Page full loaded', e);
// });

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });
