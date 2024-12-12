'use client';

import { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MediaGrid } from '@/components/top-rated/media-grid';
import { useTopRated } from '@/hooks/useTopRated';

export default function TopRatedPage() {
  const {
    data: moviesData,
    isLoading: isLoadingMovies,
    fetchData: fetchMovies,
  } = useTopRated('movie');

  const {
    data: tvShowsData,
    isLoading: isLoadingTVShows,
    fetchData: fetchTVShows,
  } = useTopRated('tv');

  useEffect(() => {
    // Initial load
    Promise.all([
      fetchMovies(1),
      fetchTVShows(1),
    ]);
  }, [fetchMovies, fetchTVShows]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Top Rated</h1>
        <p className="text-muted-foreground">
          Discover the highest-rated movies and TV shows of all time
        </p>
      </div>
      
      <Tabs defaultValue="movies" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="movies">Movies</TabsTrigger>
          <TabsTrigger value="tv">TV Shows</TabsTrigger>
        </TabsList>

        <TabsContent value="movies">
          <MediaGrid
            items={moviesData.results}
            type="movie"
            page={moviesData.page}
            totalPages={moviesData.totalPages}
            isLoading={isLoadingMovies}
            onRefresh={() => fetchMovies()}
            title="Top Rated Movies"
          />
        </TabsContent>

        <TabsContent value="tv">
          <MediaGrid
            items={tvShowsData.results}
            type="tv"
            page={tvShowsData.page}
            totalPages={tvShowsData.totalPages}
            isLoading={isLoadingTVShows}
            onRefresh={() => fetchTVShows()}
            title="Top Rated TV Shows"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}