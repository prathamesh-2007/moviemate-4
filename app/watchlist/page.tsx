'use client';

import { useEffect, useState } from 'react';
import { MediaCard } from '@/components/media-card';
import { fetchMovieDetails } from '@/lib/tmdb';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
import { Clock } from 'lucide-react';

export default function WatchlistPage() {
  const [watchlist] = useLocalStorage<number[]>('watchlist', []);
  const [watched] = useLocalStorage<{ id: number; runtime: number }[]>('watched', []);
  const [movies, setMovies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const totalWatchTime = watched.reduce((acc, movie) => acc + movie.runtime, 0);

  useEffect(() => {
    const loadWatchlist = async () => {
      setIsLoading(true);
      try {
        const movieDetails = await Promise.all(
          watchlist.map((id) => fetchMovieDetails(id))
        );
        setMovies(movieDetails);
      } catch (error) {
        console.error('Error fetching watchlist movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWatchlist();
  }, [watchlist]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Your Watchlist</h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            Total watch time: {Math.floor(totalWatchTime / 60)} hours{' '}
            {totalWatchTime % 60} minutes
          </span>
        </div>
      </div>

      {movies.length > 0 ? (
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
              runtime={movie.runtime}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Your watchlist is empty. Add movies to watch later!
          </p>
        </div>
      )}
    </div>
  );
}