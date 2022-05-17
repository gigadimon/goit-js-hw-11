import { fetchRequest } from './fetchRequest';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import simpleLightbox from 'simplelightbox/dist/simple-lightbox.min.css';
import './sass/main.scss';
const lightbox = new SimpleLightbox('.gallery a');

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  button: document.querySelector('.load-more'),
  header: document.querySelector('.header'),
};

const request = {
  page: 1,
  perPage: 20,
  message: '',
};

refs.form.addEventListener('submit', atSearch);
// refs.button.addEventListener('click', onLoadMoreButtonClick);

async function atSearch(event) {
  event.preventDefault();
  window.addEventListener('scroll', atScroll);
  if (!event.currentTarget.elements.searchQuery.value.trim()) {
    Notify.info('Please, enter your query in the search box');
    return;
  }
  // refs.button.classList.add('visually-hidden');
  refs.gallery.innerHTML = '';

  /* Деструктуризирую не сразу, тк нужно сначала поменять данные именно в обьекте запроса */
  request.page = 1;
  request.message = event.currentTarget.elements.searchQuery.value;
  const { page, message } = request;

  const { hits, totalHits } = await fetchRequest(message, page);

  if (hits.length === 0) {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    return;
  }
  Notify.success(`Hooray! We found ${totalHits} images.`);

  renderMarkup(hits);
  // refs.button.classList.remove('visually-hidden');
}

async function atScroll() {
  const htmlEl = document.documentElement;
  const bodyEl = document.body;

  if (bodyEl.clientHeight + bodyEl.getBoundingClientRect().top === htmlEl.clientHeight) {
    request.page += 1;
    request.message = refs.form.elements.searchQuery.value;
    const { page, perPage, message } = request;

    const { hits, totalHits } = await fetchRequest(message, page, perPage);

    renderMarkup(hits);

    if (
      page * perPage >= totalHits &&
      bodyEl.clientHeight + bodyEl.getBoundingClientRect().top === htmlEl.clientHeight
    ) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      window.removeEventListener('scroll', atScroll);
      // refs.button.classList.add('visually-hidden');
    }
  }
}

// async function onLoadMoreButtonClick() {
//   request.page += 1;
//   request.message = refs.form.elements.searchQuery.value;

//   const { hits, totalHits } = await fetchRequest(request.message, request.page);
//   if (request.page * request.perPage >= totalHits) {
//     Notify.info("We're sorry, but you've reached the end of search results.");
//     refs.button.classList.add('visually-hidden');
//   }

//   renderMarkup(hits);
//   makeAutoScroll();
// }

function renderMarkup(arr) {
  refs.gallery.insertAdjacentHTML('beforeend', createMarkup(arr));
  lightbox.refresh();
}

function createMarkup(arr) {
  return arr
    .map(el => {
      const { largeImageURL, webformatURL, tags, likes, views, comments, downloads } = el;
      return `<a href="${largeImageURL}" class="gallery__item post">
      <div class="photo-card">
      <img src="${webformatURL}" alt="${tags}" width="100%" height="216px" class="gallery__image" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            ${likes}
          </p>
          <p class="info-item">
            <b>Views</b>
            ${views}
          </p>
          <p class="info-item">
            <b>Comments</b>
            ${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>
            ${downloads}
          </p>
        </div>
      </div></a>`;
    })
    .join('');
}

// function makeAutoScroll() {
//   const { height: cardHeight } = document
//     .querySelector('.gallery')
//     .firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight,
//     behavior: 'smooth',
//   });
// }
