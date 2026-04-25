const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// In-memory cache (persists across warm invocations)
const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const NSE_SYMBOLS = [
  'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'ICICIBANK.NS',
  'BHARTIARTL.NS', 'WIPRO.NS', 'BAJFINANCE.NS', 'SUNPHARMA.NS', 'MARUTI.NS',
  'ASIANPAINT.NS', 'KOTAKBANK.NS', 'LTIM.NS', 'ADANIENT.NS', 'HCLTECH.NS',
  'TITAN.NS', 'AXISBANK.NS', 'NTPC.NS', 'NESTLEIND.NS', 'ONGC.NS',
];

const BSE_SYMBOLS = [
  'RELIANCE.BO', 'TCS.BO', 'HDFCBANK.BO', 'INFY.BO', 'ICICIBANK.BO',
  'BHARTIARTL.BO', 'WIPRO.BO', 'BAJFINANCE.BO', 'SUNPHARMA.BO', 'MARUTI.BO',
];

const INDEX_SYMBOLS = [
  { symbol: '^NSEI', name: 'NIFTY 50' },
  { symbol: '^BSESN', name: 'SENSEX' },
  { symbol: '^NSEBANK', name: 'NIFTY BANK' },
  { symbol: 'NIFTY_IT.NS', name: 'NIFTY IT' },
  { symbol: '^NSEMDCP50', name: 'NIFTY MIDCAP' },
  { symbol: 'NIFTYAUTO.NS', name: 'NIFTY AUTO' },
  { symbol: 'NIFTYPHARMA.NS', name: 'NIFTY PHARMA' },
  { symbol: 'INDIA_VIX.NS', name: 'INDIA VIX' },
];

const SECTOR_MAP: Record<string, string> = {
  'RELIANCE': 'Energy', 'TCS': 'IT', 'HDFCBANK': 'Banking', 'INFY': 'IT',
  'ICICIBANK': 'Banking', 'BHARTIARTL': 'Telecom', 'WIPRO': 'IT',
  'BAJFINANCE': 'NBFC', 'SUNPHARMA': 'Pharma', 'MARUTI': 'Auto',
  'ASIANPAINT': 'Consumer', 'KOTAKBANK': 'Banking', 'LTIM': 'IT',
  'ADANIENT': 'Conglomerate', 'HCLTECH': 'IT', 'TITAN': 'Consumer',
  'AXISBANK': 'Banking', 'NTPC': 'Power', 'NESTLEIND': 'FMCG', 'ONGC': 'Energy',
};

function formatVolume(vol: number): string {
  if (vol >= 1e6) return `${(vol / 1e6).toFixed(1)}M`;
  if (vol >= 1e3) return `${(vol / 1e3).toFixed(1)}K`;
  return vol.toString();
}

function formatMarketCap(cap: number): string {
  if (cap >= 1e12) return `${(cap / 1e12).toFixed(1)}T`;
  if (cap >= 1e9) return `${(cap / 1e9).toFixed(1)}B`;
  if (cap >= 1e6) return `${(cap / 1e6).toFixed(1)}M`;
  return cap.toString();
}

function cleanSymbol(yahooSymbol: string): string {
  return yahooSymbol.replace('.NS', '').replace('.BO', '');
}

async function fetchSingleChart(sym: string, retries = 2): Promise<any | null> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const url = `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1d&range=1d`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      });

      if (res.status === 429 || res.status >= 500) {
        await res.text();
        if (attempt < retries) {
          await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
          continue;
        }
        return null;
      }

      if (!res.ok) { await res.text(); return null; }

      const data = await res.json();
      const meta = data?.chart?.result?.[0]?.meta;
      if (!meta) return null;

      const prevClose = meta.chartPreviousClose || meta.previousClose || meta.regularMarketPrice;
      const currentPrice = meta.regularMarketPrice;
      const change = currentPrice - prevClose;
      const changePct = prevClose ? (change / prevClose) * 100 : 0;

      return {
        symbol: sym,
        shortName: meta.shortName || meta.symbol,
        longName: meta.longName || meta.shortName || meta.symbol,
        regularMarketPrice: currentPrice,
        regularMarketChange: change,
        regularMarketChangePercent: changePct,
        regularMarketVolume: meta.regularMarketVolume,
        marketCap: 0,
        trailingPE: 0,
        fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh,
        fiftyTwoWeekLow: meta.fiftyTwoWeekLow,
        regularMarketOpen: meta.regularMarketOpen || currentPrice,
        regularMarketPreviousClose: prevClose,
      };
    } catch {
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }
      return null;
    }
  }
  return null;
}

// Fetch historical chart data for an index (30 days)
async function fetchChartHistory(sym: string, retries = 2): Promise<any[] | null> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const url = `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1d&range=1mo`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      });

      if (res.status === 429 || res.status >= 500) {
        await res.text();
        if (attempt < retries) {
          await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
          continue;
        }
        return null;
      }

      if (!res.ok) { await res.text(); return null; }

      const data = await res.json();
      const result = data?.chart?.result?.[0];
      if (!result) return null;

      const timestamps = result.timestamp || [];
      const closes = result.indicators?.quote?.[0]?.close || [];

      return timestamps.map((ts: number, i: number) => ({
        day: i + 1,
        value: closes[i] ? parseFloat(closes[i].toFixed(2)) : null,
        date: new Date(ts * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      })).filter((d: any) => d.value !== null);
    } catch {
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }
      return null;
    }
  }
  return null;
}

async function fetchQuotes(symbols: string[]): Promise<any[]> {
  const results: any[] = [];
  const batchSize = 5;
  for (let i = 0; i < symbols.length; i += batchSize) {
    const batch = symbols.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(sym => fetchSingleChart(sym)));
    results.push(...batchResults.filter(Boolean));
    if (i + batchSize < symbols.length) {
      await new Promise(r => setTimeout(r, 300));
    }
  }
  return results;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const type = url.searchParams.get('type') || 'stocks';
    const exchange = url.searchParams.get('exchange') || 'NSE';

    // === INDICES endpoint ===
    if (type === 'indices') {
      const cacheKey = 'indices';
      const cached = cache[cacheKey];
      if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        return new Response(JSON.stringify({ ...cached.data, fromCache: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Fetch all index quotes
      const indexSymbols = INDEX_SYMBOLS.map(i => i.symbol);
      const quotes = await fetchQuotes(indexSymbols);

      // Fetch NIFTY 50 chart history
      const niftyHistory = await fetchChartHistory('^NSEI');

      const indices = INDEX_SYMBOLS.map(idx => {
        const q = quotes.find(q => q?.symbol === idx.symbol);
        if (!q) return null;
        const change = q.regularMarketChange;
        const changePct = q.regularMarketChangePercent;
        const bullish = change >= 0;
        return {
          name: idx.name,
          value: q.regularMarketPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          rawValue: q.regularMarketPrice,
          change: `${bullish ? '+' : ''}${change.toFixed(2)}`,
          changePercent: `${bullish ? '+' : ''}${changePct.toFixed(2)}%`,
          bullish,
        };
      }).filter(Boolean);

      if (indices.length === 0) {
        if (cached) {
          return new Response(JSON.stringify({ ...cached.data, fromCache: true, stale: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        throw new Error('No index data could be fetched');
      }

      const responseData = {
        indices,
        niftyHistory: niftyHistory || [],
        fetchedAt: new Date().toISOString(),
      };
      cache[cacheKey] = { data: responseData, timestamp: Date.now() };

      return new Response(JSON.stringify(responseData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // === STOCKS endpoint (default) ===
    const symbols = exchange === 'BSE' ? BSE_SYMBOLS : NSE_SYMBOLS;
    const cacheKey = `stocks_${exchange}`;

    const cached = cache[cacheKey];
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return new Response(JSON.stringify({ ...cached.data, fromCache: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const quotes = await fetchQuotes(symbols);

    if (quotes.length === 0) {
      if (cached) {
        return new Response(JSON.stringify({ ...cached.data, fromCache: true, stale: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error('No stock data could be fetched');
    }

    const stocks = quotes.map((q: any) => {
      const sym = cleanSymbol(q.symbol || '');
      return {
        symbol: sym,
        name: q.longName || q.shortName || sym,
        exchange: exchange as 'NSE' | 'BSE',
        price: q.regularMarketPrice || 0,
        change: parseFloat((q.regularMarketChange || 0).toFixed(2)),
        changePercent: parseFloat((q.regularMarketChangePercent || 0).toFixed(2)),
        volume: formatVolume(q.regularMarketVolume || 0),
        marketCap: formatMarketCap(q.marketCap || 0),
        pe: q.trailingPE || 0,
        high52w: q.fiftyTwoWeekHigh || 0,
        low52w: q.fiftyTwoWeekLow || 0,
        sector: SECTOR_MAP[sym] || 'Other',
        open: q.regularMarketOpen || 0,
        prevClose: q.regularMarketPreviousClose || 0,
      };
    });

    const responseData = { stocks, fetchedAt: new Date().toISOString() };
    cache[cacheKey] = { data: responseData, timestamp: Date.now() };

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching stock data:', error);
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message, stocks: [], indices: [] }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
