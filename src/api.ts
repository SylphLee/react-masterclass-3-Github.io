const API_KEY = "e62e0dab212dcd3629ec2e9335831fb6";
const BASE_PATH = "https://api.themoviedb.org/3/";
const LANGUAGE = "&language=ko-KR&region=kr";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  release_date: string;  
  vote_average: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  },
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

interface ITv {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
  first_air_date: string;
  vote_average:string;  
}

export interface IGetTvResult {
  dates: {
    maximum: string;
    minimum: string;
  },
  page: number;
  results: ITv[];
  total_pages: number;
  total_results: number;
}

interface ISearch {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
  first_air_date: string;
  vote_average:string;  
}

export interface IGetSearchResult {
  dates: {
    maximum: string;
    minimum: string;
  },
  page: number;
  results: ISearch[];
  total_pages: number;
  total_results: number;
}


export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}${LANGUAGE}`).then(response => response.json());
}
export function getLastestMovies() {
  return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}${LANGUAGE}`).then(response => response.json());
}
export function getTopMovies() {
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}${LANGUAGE}`).then(response => response.json());
}
export function getUpcomingMovies() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}${LANGUAGE}`).then(response => response.json());
}

export function getTv() {
  return fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}`).then(response => response.json());
}
export function getLatestTv() {
  return fetch(`${BASE_PATH}/tv/latest?api_key=${API_KEY}`).then(response => response.json());
}
export function geAiringTv() {
  return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then(response => response.json());
}
export function getPopularTv() {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then(response => response.json());
}
export function getTopTv() {
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(response => response.json());
}

export function getSearch(text: string | null) {
  return fetch(`${BASE_PATH}/search/multi?api_key=${API_KEY}&query=${text}`).then(response => response.json());
}