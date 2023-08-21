import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';


document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('search-form');
  const gallery = document.querySelector('.gallery');
  const loadMoreBtn = document.querySelector('.load-more');

  let page = 1;
  let currentQuery = '';
  loadMoreBtn.style.display = 'none';

  searchForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    gallery.innerHTML = '';
    page = 1;
    currentQuery = searchForm.searchQuery.value.trim();
    await fetchImages(currentQuery);
  });

  loadMoreBtn.addEventListener('click', async function () {
    page++;
    await fetchImages(currentQuery);
  });

  async function fetchImages(query) {
    const apiKey = '38911992-4282f3ea184d2afaa0285965b';
    const perPage = 10;

    const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

    try {
        const response = await axios.get(apiUrl);
        const data = response.data;
    
        if (data.hits.length === 0) {
          Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
          return;
        }
    
        data.hits.forEach(image => {
          const card = createImageCard(image);
          const cardLink = document.createElement('a');
          cardLink.href = image.largeImageURL;
          cardLink.appendChild(card);
          gallery.appendChild(cardLink);
        });
    
        const lightbox = new SimpleLightbox('.gallery a');
        lightbox.refresh();
    
        if (data.totalHits <= page * perPage) {
          loadMoreBtn.style.display = 'none';
          Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
          return;
        } else {
            loadMoreBtn.style.display = 'block'
        }

        const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
        window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
        });


      } catch (error) {
        console.error('Error fetching images:', error);
        Notiflix.Notify.failure('An error occurred while fetching images. Please try again later.');
      }
    }
    

  function createImageCard(image) {
    const card = document.createElement('div');
    card.classList.add('photo-card');

    const img = document.createElement('img');
    img.src = image.webformatURL;
    img.alt = image.tags;
    img.loading = 'lazy';

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('info');

    const likes = document.createElement('p');
    likes.classList.add('info-item');
    likes.innerHTML = `<b>Likes:</b> ${image.likes}`;

    const views = document.createElement('p');
    views.classList.add('info-item');
    views.innerHTML = `<b>Views:</b> ${image.views}`;

    const comments = document.createElement('p');
    comments.classList.add('info-item');
    comments.innerHTML = `<b>Comments:</b> ${image.comments}`;

    const downloads = document.createElement('p');
    downloads.classList.add('info-item');
    downloads.innerHTML = `<b>Downloads:</b> ${image.downloads}`;

    infoDiv.appendChild(likes);
    infoDiv.appendChild(views);
    infoDiv.appendChild(comments);
    infoDiv.appendChild(downloads);

    card.appendChild(img);
    card.appendChild(infoDiv);

    return card;
  }
});
