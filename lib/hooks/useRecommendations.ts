'use client';

import { useState, useCallback } from 'react';
import { fetchRecommendedMovies, fetchRecommendedTVShows } from '@/lib/api/recommendations';
import { RecommendationParams } from '@/lib/types/recommendations';

export function useRecommendations() {
  const [movies, setMovies] = useState<any[]>([]);
  const [tvShows, setTvShows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentValues, setCurrentValues] = useState<RecommendationParams | null>(null);

  const fetchRecommendations = useCallback(async (values: RecommendationParams) => {
    setIsLoading(true);
    setMovies([]);
    setTvShows([]);
    
    try {
      const [movieResults, tvResults] = await Promise.all([
        fetchRecommendedMovies(values),
        fetchRecommendedTVShows(values),
      ]);

      setMovies(movieResults || []);
      setTvShows(tvResults || []);
      setCurrentValues(values);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setMovies([]);
      setTvShows([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    if (currentValues) {
      await fetchRecommendations(currentValues);
    }
  }, [currentValues, fetchRecommendations]);

  return {
    movies,
    tvShows,
    isLoading,
    fetchRecommendations,
    refresh,
    hasValues: !!currentValues,
  };
}