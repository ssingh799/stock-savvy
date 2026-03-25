import { useState, useEffect, useCallback } from 'react';
import { marketIndices as fallbackIndices } from '@/data/stockData';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export interface LiveIndex {
  name: string;
  value: string;
  rawValue: number;
  change: string;
  changePercent: string;
  bullish: boolean;
}

export interface MarketDataResult {
  indices: LiveIndex[];
  niftyHistory: { day: number; value: number; date: string }[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  refetch: () => void;
  isLive: boolean;
  fromCache: boolean;
}

export function useMarketData(): MarketDataResult {
  const [indices, setIndices] = useState<LiveIndex[]>(
    fallbackIndices.map(i => ({ ...i, rawValue: 0 }))
  );
  const [niftyHistory, setNiftyHistory] = useState<{ day: number; value: number; date: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [fromCache, setFromCache] = useState(false);

  const fetchData = useCallback(async () => {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${SUPABASE_URL}/functions/v1/stock-data?type=indices`,
        {
          headers: {
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      if (data.indices && data.indices.length > 0) {
        setIndices(data.indices);
        setIsLive(true);
        setFromCache(!!data.fromCache);
        setError(null);
      }

      if (data.niftyHistory && data.niftyHistory.length > 0) {
        setNiftyHistory(data.niftyHistory);
      }

      setLastUpdated(data.fetchedAt);
    } catch (err: any) {
      console.warn('Live market data fetch failed, using fallback:', err.message);
      setError(err.message);
      setIsLive(false);
      setFromCache(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { indices, niftyHistory, loading, error, lastUpdated, refetch: fetchData, isLive, fromCache };
}
