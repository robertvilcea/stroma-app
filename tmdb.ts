import axios from 'axios';
import 'dotenv/config';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json;charset=utf-8',
  },
});

export const searchTMDB = async (query: string) => {
  const res = await api.get(`/search/multi?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`);
  return res.data.results;
};

export const getWatchProviders = async (id: number, mediaType: 'movie' | 'tv') => {
  const res = await api.get(`/${mediaType}/${id}/watch/providers`);
  return res.data.results?.RO || null;
};
