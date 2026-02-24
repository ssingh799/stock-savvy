import { useState, useEffect, useCallback } from 'react';
import { Stock, nseStocks as fallbackNSE, bseStocks as fallbackBSE } from '@/data/stockData';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

interface StockDataResult {
  stocks: Stock[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  refetch: () => void;
  isLive: boolean;
  fromCache: boolean;
}

export function useStockData(exchange: 'NSE' | 'BSE'): StockDataResult {
  const fallback = exchange === 'NSE' ? fallbackNSE : fallbackBSE;
  const [stocks, setStocks] = useState<Stock[]>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [fromCache, setFromCache] = useState(false);

  const fetchStocks = useCallback(async () => {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${SUPABASE_URL}/functions/v1/stock-data?exchange=${exchange}`,
        {
          headers: {
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      if (data.stocks && data.stocks.length > 0) {
        setStocks(data.stocks);
        setLastUpdated(data.fetchedAt);
        setIsLive(true);
        setFromCache(!!data.fromCache);
        setError(null);
      } else {
        throw new Error('No stock data returned');
      }
    } catch (err: any) {
      console.warn(`Live data fetch failed for ${exchange}, using fallback:`, err.message);
      setError(err.message);
      setStocks(fallback);
      setIsLive(false);
      setFromCache(false);
    } finally {
      setLoading(false);
    }
  }, [exchange, fallback]);

  useEffect(() => {
    fetchStocks();
    // Refresh every 60 seconds
    const interval = setInterval(fetchStocks, 60000);
    return () => clearInterval(interval);
  }, [fetchStocks]);

  return { stocks, loading, error, lastUpdated, refetch: fetchStocks, isLive, fromCache };
}
