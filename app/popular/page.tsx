'use client';

import { useEffect, useState } from 'react';
import { MediaCard } from '@/components/media-card';
import { fetchPopular } from '@/lib/tmdb';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function PopularPage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPopular = async () => {
    setIsLoading(true);
    try {
      const data = await fetchPopular();
      setMovies(data);
    } catch (error) {
      console.error('Error fetching popular movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPopular();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Popular Movies</h1>
        <Button onClick={loadPopular} disabled={isLoading} variant="outline">
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