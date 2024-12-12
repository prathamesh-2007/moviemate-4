import { BASE_URL, headers, INDUSTRY_MAPPING } from '../../config/tmdb';
import { RecommendationParams } from '../../types/recommendations';
import { fetchWithRetry } from './utils';
import { normalizeResults } from './normalizer';

export async function fetchRecommendedTVShows(params: RecommendationParams) {
  const { industry, year, genre } = params;
  
  let baseUrl = `${BASE_URL}/discover/tv?include_adult=false&sort_by=popularity.desc&vote_count.gte=100`;
  
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
    // Try with all filters first
    let results = await fetchWithRetry(baseUrl);
    
    // If not enough results, try without year
    if (results.length < 3) {
      const urlWithoutYear = baseUrl.replace(/&first_air_date_year=\d+/, '');
      results = await fetchWithRetry(urlWithoutYear);
    }
    
    // If still not enough, try with minimal filters
    if (results.length < 3) {
      const minimalUrl = industry 
        ? `${BASE_URL}/discover/tv?include_adult=false&sort_by=popularity.desc&vote_count.gte=100&with_original_language=${INDUSTRY_MAPPING[industry].language}`
        : `${BASE_URL}/discover/tv?include_adult=false&sort_by=popularity.desc&vote_count.gte=100`;
      results = await fetchWithRetry(minimalUrl);
    }

    return normalizeResults(results).slice(0, 3);
  } catch (error) {
    console.error('Error fetching recommended TV shows:', error);
    return [];
  }
}