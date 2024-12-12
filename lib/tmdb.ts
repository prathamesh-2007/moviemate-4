import { BASE_URL, headers, INDUSTRY_MAPPING } from './config/tmdb';
import { Movie, TVShow } from './types/tmdb';
import { getCertificationQuery } from './utils/certifications';
import { getRandomPage } from './utils/pagination';

export const fetchMovies = async (params: {
  industry?: string;
  year?: string;
  genre?: string;
  contentRating?: string;
}) => {
  const { industry, year, genre, contentRating } = params;
  
  let baseUrl = `${BASE_URL}/discover/movie?include_adult=false`;
  
  if (industry) {
    const industryConfig = INDUSTRY_MAPPING[industry];
    if (industryConfig) {
      baseUrl += `&with_original_language=${industryConfig.language}`;
      baseUrl += `&region=${industryConfig.region}`;
    }
  }
  
  if (year) baseUrl += `&primary_release_year=${year}`;
  if (genre) baseUrl += `&with_genres=${genre}`;
  
  if (industry && contentRating) {
    baseUrl += getCertificationQuery(industry, contentRating);
  }

  const randomPage = await getRandomPage(baseUrl);
  const url = `${baseUrl}&page=${randomPage}`;

  try {
    const response = await fetch(url, { headers });
    const data = await response.json();
    
    if (!data.results?.length) {
      const firstPageResponse = await fetch(`${baseUrl}&page=1`, { headers });
      const firstPageData = await firstPageResponse.json();
      return (firstPageData.results || []).slice(0, 3);
    }
    
    return data.results.slice(0, 3);
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};

export const fetchTVShows = async (params: {
  industry?: string;
  year?: string;
  genre?: string;
  contentRating?: string;
}) => {
  const { industry, year, genre } = params;
  
  let baseUrl = `${BASE_URL}/discover/tv?include_adult=false`;
  
  if (industry) {
    const industryConfig = INDUSTRY_MAPPING[industry];
    if (industryConfig) {
      baseUrl += `&with_original_language=${industryConfig.language}`;
      baseUrl += `&with_origin_country=${industryConfig.region}`;
    }
  }
  
  if (year) baseUrl += `&first_air_date_year=${year}`;
  if (genre) baseUrl += `&with_genres=${genre}`;

  const randomPage = await getRandomPage(baseUrl);
  const url = `${baseUrl}&page=${randomPage}`;

  try {
    const response = await fetch(url, { headers });
    const data = await response.json();
    
    let results = data.results || [];
    
    if (industry) {
      const industryConfig = INDUSTRY_MAPPING[industry];
      if (industryConfig) {
        results = results.filter((show: TVShow) => 
          show.origin_country.includes(industryConfig.region)
        );
      }
    }
    
    if (!results.length) {
      const firstPageResponse = await fetch(`${baseUrl}&page=1`, { headers });
      const firstPageData = await firstPageResponse.json();
      results = (firstPageData.results || []).filter((show: TVShow) => {
        if (!industry) return true;
        const industryConfig = INDUSTRY_MAPPING[industry];
        return industryConfig ? show.origin_country.includes(industryConfig.region) : true;
      });
    }
    
    return results.slice(0, 3);
  } catch (error) {
    console.error('Error fetching TV shows:', error);
    return [];
  }
};

export const fetchMovieDetails = async (id: number): Promise<Movie> => {
  const response = await fetch(
    `${BASE_URL}/movie/${id}?language=en-US`,
    { headers }
  );
  return response.json();
};

export const fetchMovieCredits = async (id: number) => {
  const response = await fetch(
    `${BASE_URL}/movie/${id}/credits?language=en-US`,
    { headers }
  );
  return response.json();
};

export const fetchTVShowDetails = async (id: number): Promise<TVShow> => {
  const response = await fetch(
    `${BASE_URL}/tv/${id}?language=en-US`,
    { headers }
  );
  return response.json();
};

export const fetchTrending = async () => {
  const response = await fetch(
    `${BASE_URL}/trending/movie/week?language=en-US`,
    { headers }
  );
  const data = await response.json();
  return data.results;
};

export const fetchPopular = async () => {
  const response = await fetch(
    `${BASE_URL}/movie/popular?language=en-US`,
    { headers }
  );
  const data = await response.json();
  return data.results;
};

export const fetchTopRatedMovies = async () => {
  const response = await fetch(
    `${BASE_URL}/movie/top_rated?language=en-US`,
    { headers }
  );
  const data = await response.json();
  return data.results;
};

export const fetchTopRatedTVShows = async () => {
  const response = await fetch(
    `${BASE_URL}/tv/top_rated?language=en-US`,
    { headers }
  );
  const data = await response.json();
  return data.results;
};

export const fetchMovieTrailer = async (id: number) => {
  const response = await fetch(
    `${BASE_URL}/movie/${id}/videos?language=en-US`,
    { headers }
  );
  const data = await response.json();
  return data.results.find((video: any) => video.type === 'Trailer');
};