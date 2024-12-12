import { BASE_URL, headers, INDUSTRY_MAPPING } from '../config/tmdb';
import { getRandomPage } from '../utils/pagination';
import { RecommendationParams } from '../types/recommendations';

export async function fetchRecommendedMovies(params: RecommendationParams) {
  const { industry, year, genre, contentRating } = params;
  
  let baseUrl = `${BASE_URL}/discover/movie?include_adult=false&sort_by=popularity.desc`;
  
  if (industry) {
    const industryConfig = INDUSTRY_MAPPING[industry];
    if (industryConfig) {
      baseUrl += `&with_original_language=${industryConfig.language}`;
      if (industryConfig.region) {
        baseUrl += `&region=${industryConfig.region}`;
        baseUrl += `&with_origin_country=${industryConfig.region}`;
      }
    }
  }
  
  if (year) baseUrl += `&primary_release_year=${year}`;
  if (genre) baseUrl += `&with_genres=${genre}`;
  
  try {
    // First try with all filters
    let response = await fetchWithRetry(baseUrl);
    if (response.results.length >= 3) {
      return response.results.slice(0, 6);
    }

    // If not enough results, try without content rating
    if (response.results.length < 3) {
      response = await fetchWithRetry(baseUrl);
      if (response.results.length >= 3) {
        return response.results.slice(0, 6);
      }
    }

    // If still not enough, try without year
    if (response.results.length < 3) {
      const urlWithoutYear = baseUrl.replace(/&primary_release_year=\d+/, '');
      response = await fetchWithRetry(urlWithoutYear);
      if (response.results.length >= 3) {
        return response.results.slice(0, 6);
      }
    }

    // Last resort: only use industry and genre
    const baseFilters = `${BASE_URL}/discover/movie?include_adult=false&sort_by=popularity.desc`;
    const industryConfig = INDUSTRY_MAPPING[industry || ''];
    const minimalUrl = industryConfig 
      ? `${baseFilters}&with_original_language=${industryConfig.language}${genre ? `&with_genres=${genre}` : ''}`
      : baseFilters;
    
    response = await fetchWithRetry(minimalUrl);
    return response.results.slice(0, 6);
  } catch (error) {
    console.error('Error fetching recommended movies:', error);
    return [];
  }
}

export async function fetchRecommendedTVShows(params: RecommendationParams) {
  const { industry, year, genre } = params;
  
  let baseUrl = `${BASE_URL}/discover/tv?include_adult=false&sort_by=popularity.desc`;
  
  if (industry) {
    const industryConfig = INDUSTRY_MAPPING[industry];
    if (industryConfig) {
      baseUrl += `&with_original_language=${industryConfig.language}`;
      if (industryConfig.region) {
        baseUrl += `&with_origin_country=${industryConfig.region}`;
      }
    }
  }
  
  if (year) baseUrl += `&first_air_date_year=${year}`;
  if (genre) baseUrl += `&with_genres=${genre}`;

  try {
    // First try with all filters
    let response = await fetchWithRetry(baseUrl);
    if (response.results.length >= 3) {
      return response.results.slice(0, 6);
    }

    // If not enough results, try without year
    if (response.results.length < 3) {
      const urlWithoutYear = baseUrl.replace(/&first_air_date_year=\d+/, '');
      response = await fetchWithRetry(urlWithoutYear);
      if (response.results.length >= 3) {
        return response.results.slice(0, 6);
      }
    }

    // Last resort: only use industry and genre
    const baseFilters = `${BASE_URL}/discover/tv?include_adult=false&sort_by=popularity.desc`;
    const industryConfig = INDUSTRY_MAPPING[industry || ''];
    const minimalUrl = industryConfig 
      ? `${baseFilters}&with_original_language=${industryConfig.language}${genre ? `&with_genres=${genre}` : ''}`
      : baseFilters;
    
    response = await fetchWithRetry(minimalUrl);
    return response.results.slice(0, 6);
  } catch (error) {
    console.error('Error fetching recommended TV shows:', error);
    return [];
  }
}

async function fetchWithRetry(url: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const randomPage = await getRandomPage(url);
      const finalUrl = `${url}&page=${randomPage}`;
      const response = await fetch(finalUrl, { headers });
      const data = await response.json();
      
      if (data.results?.length > 0) {
        return data;
      }
    } catch (error) {
      if (i === retries - 1) throw error;
    }
  }
  return { results: [] };
}