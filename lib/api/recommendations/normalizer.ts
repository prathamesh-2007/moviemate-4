export function normalizeResults(results: any[]) {
  return results
    .filter(item => {
      // Filter out items without essential data
      return (
        item &&
        (item.title || item.name) &&
        item.id &&
        item.vote_average !== undefined &&
        (item.release_date || item.first_air_date)
      );
    })
    .map(item => ({
      ...item,
      // Ensure poster_path is null if not present
      poster_path: item.poster_path || null,
      // Normalize dates
      release_date: item.release_date || item.first_air_date,
      // Ensure vote_average is a number
      vote_average: Number(item.vote_average)
    }));
}