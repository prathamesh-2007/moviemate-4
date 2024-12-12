'use client';

import { MediaCard } from '@/components/media-card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface MediaGridProps {
  items: any[];
  type: 'movie' | 'tv';
  page: number;
  totalPages: number;
  isLoading: boolean;
  onRefresh: () => void;
  title: string;
}

export function MediaGrid({
  items,
  type,
  page,
  totalPages,
  isLoading,
  onRefresh,
  title,
}: MediaGridProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
        </div>
        <Button onClick={onRefresh} disabled={isLoading} variant="outline">
          {isLoading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span className="ml-2">Show More</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <MediaCard
            key={item.id}
            id={item.id}
            title={type === 'movie' ? item.title : item.name}
            overview={item.overview}
            posterPath={item.poster_path}
            releaseDate={type === 'movie' ? item.release_date : item.first_air_date}
            rating={item.vote_average}
            type={type}
          />
        ))}
      </div>
    </div>
  );
}