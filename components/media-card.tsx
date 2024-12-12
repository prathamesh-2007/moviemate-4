'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Calendar, Clock, Film, Star, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
import { MediaDetailsDialog } from './media-details-dialog';
import { fetchMovieTrailer } from '@/lib/tmdb';
import { cn } from '@/lib/utils';

interface MediaCardProps {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  releaseDate: string;
  rating: number;
  type: 'movie' | 'tv';
  runtime?: number;
}

export function MediaCard({
  id,
  title,
  overview,
  posterPath,
  releaseDate,
  rating,
  type,
  runtime,
}: MediaCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [watchlist, setWatchlist] = useLocalStorage<number[]>('watchlist', []);
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isInWatchlist = watchlist.includes(id);

  const handleWatchlistToggle = () => {
    if (isInWatchlist) {
      setWatchlist(watchlist.filter((itemId) => itemId !== id));
    } else {
      setWatchlist([...watchlist, id]);
    }
  };

  const handleWatchTrailer = async () => {
    setIsLoadingTrailer(true);
    try {
      const trailer = await fetchMovieTrailer(id);
      if (trailer) {
        window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank', 'noopener,noreferrer');
      } else {
        console.log('No trailer available');
      }
    } catch (error) {
      console.error('Error fetching trailer:', error);
    } finally {
      setIsLoadingTrailer(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <>
      <Card
        className="relative overflow-hidden transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[2/3] bg-muted">
          {(!posterPath || imageError) ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-muted-foreground">
              <Film className="h-12 w-12 mb-2" />
              <p className="text-sm text-center font-medium">{title}</p>
            </div>
          ) : (
            <Image
              src={`https://image.tmdb.org/t/p/w500${posterPath}`}
              alt={title}
              fill
              className={cn(
                "object-cover transition-opacity duration-300",
                imageError ? "opacity-0" : "opacity-100"
              )}
              onError={handleImageError}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
            />
          )}
          {isHovered && (
            <div className="absolute inset-0 bg-black/70 p-4 flex flex-col justify-between text-white transition-opacity duration-300">
              <div>
                <h3 className="font-bold mb-2">{title}</h3>
                <p className="text-sm line-clamp-3">{overview}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  {new Date(releaseDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4" />
                  {rating.toFixed(1)}
                </div>
                {runtime && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    {runtime} min
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => setIsDetailsOpen(true)}
                  >
                    More Info
                  </Button>
                  <Button
                    size="sm"
                    variant={isInWatchlist ? 'destructive' : 'default'}
                    className="flex-1"
                    onClick={handleWatchlistToggle}
                  >
                    {isInWatchlist ? 'Remove' : 'Watch Later'}
                  </Button>
                </div>
                {type === 'movie' && (
                  <Button
                    size="sm"
                    variant="default"
                    className="w-full"
                    onClick={handleWatchTrailer}
                    disabled={isLoadingTrailer}
                  >
                    <Youtube className="h-4 w-4 mr-2" />
                    {isLoadingTrailer ? 'Loading...' : 'Watch Trailer'}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
      <MediaDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        mediaId={id}
        type={type}
      />
    </>
  );
}