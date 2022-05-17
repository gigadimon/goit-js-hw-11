import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const SECRET_KEY = '27409916-238dc54d0ca856be32d436daf';

async function fetchRequest(request, page, perPage) {
  const response = await axios(
    `${BASE_URL}?key=${SECRET_KEY}&q=${request}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`,
  );

  return response.data;
}

export { fetchRequest };
