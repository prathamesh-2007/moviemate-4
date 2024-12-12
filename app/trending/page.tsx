'use client';

import { useEffect, useState } from 'react';
import { MediaCard } from '@/components/media-card';
import { fetchTrending } from '@/lib/tmdb';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function TrendingPage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTrending = async () => {
    setIsLoading(true);
    try {
      const data = await fetchTrending();
      setMovies(data);
    } catch (error) {
      console.error('Error fetching trending movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTrending();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Trending Movies</h1>
        <Button onClick={loadTrending} disabled={isLoading} variant="outline">
          {isLoading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span className="ml-2">Refresh</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <MediaCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            overview={movie.overview}
            posterPath={movie.poster_path}
            releaseDate={movie.release_date}
            rating={movie.vote_average}
            type="movie"
          />
        ))}
      </div>
    </div>
  );
}