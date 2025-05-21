import axios from 'axios';

const API_KEY = "1fcaeba1e6de59a2df5df2503103516a";
const BASE_URL = "https://api.themoviedb.org/3";

export const getPopularMovies = async () => {
  const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
  const data = await response.json();
  return data.results;
};

export const searchMovies = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: {
        api_key: API_KEY,
        query,
      },
    });
    return response.data.results; // Return the list of movies
  } catch (error) {
    console.error('Error fetching movies from TMDb:', error);
    throw error;
  }
};
