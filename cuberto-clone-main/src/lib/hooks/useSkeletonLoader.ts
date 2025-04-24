"use client";

import { useState, useEffect } from 'react';

interface UseSkeletonLoaderOptions {
  /**
   * Time in milliseconds to show the skeleton at minimum
   */
  minimumLoadTime?: number;
  
  /**
   * Initial loading state
   */
  initialState?: boolean;
  
  /**
   * Simulate loading for demo purposes (in ms)
   */
  simulateLoadTime?: number | null;
}

/**
 * Custom hook for managing skeleton loading states
 */
const useSkeletonLoader = <T>(
  asyncCallback?: () => Promise<T>, 
  options: UseSkeletonLoaderOptions = {}
) => {
  const { 
    minimumLoadTime = 800, 
    initialState = true,
    simulateLoadTime = null 
  } = options;
  
  const [isLoading, setIsLoading] = useState<boolean>(initialState);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  const load = async (callback?: () => Promise<T>) => {
    const loadStartTime = Date.now();
    setIsLoading(true);
    setError(null);
    
    try {
      // If a callback is provided, use it; otherwise use the one from initialization
      const fetchCallback = callback || asyncCallback;
      
      if (!fetchCallback && simulateLoadTime === null) {
        throw new Error('No callback provided and no simulation time set');
      }
      
      let result: T | null = null;
      
      // Simulate loading if needed
      if (simulateLoadTime !== null) {
        await new Promise(resolve => setTimeout(resolve, simulateLoadTime));
        result = null;
      } else if (fetchCallback) {
        result = await fetchCallback();
      }
      
      setData(result);
      
      // Ensure minimum loading time for better UX
      const loadTime = Date.now() - loadStartTime;
      if (loadTime < minimumLoadTime) {
        await new Promise(resolve => 
          setTimeout(resolve, minimumLoadTime - loadTime)
        );
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Auto-load if callback is provided at initialization
  useEffect(() => {
    if (asyncCallback || simulateLoadTime !== null) {
      load();
    } else {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return {
    isLoading,
    data,
    error,
    load,
    setData
  };
};

export default useSkeletonLoader; 