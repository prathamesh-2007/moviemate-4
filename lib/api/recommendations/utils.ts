import { BASE_URL, headers } from '../../config/tmdb';
import { getRandomPage } from '../../utils/pagination';

export async function fetchWithRetry(baseUrl: string, retries = 3): Promise<any[]> {
  let allResults: any[] = [];
  const seenIds = new Set();

  for (let i = 0; i < retries && allResults.length < 3; i++) {
    try {
      const randomPage = await getRandomPage(baseUrl);
      const finalUrl = `${baseUrl}&page=${randomPage}`;
      const response = await fetch(finalUrl, { headers });
      const data = await response.json();
      
      if (data.results?.length > 0) {
        // Filter out duplicates and add new results
        const newResults = data.results.filter((item: any) => {
          if (seenIds.has(item.id)) return false;
          seenIds.add(item.id);
          return true;
        });
        
        allResults = [...allResults, ...newResults];
      }
    } catch (error) {
      console.error('Error in fetchWithRetry:', error);
      if (i === retries - 1) throw error;
    }
  }

  return allResults;
}