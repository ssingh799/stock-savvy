const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface YahooQuote {
  symbol: string;
  shortName?: string;
  longName?: string;
  regularMarketPrice?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  regularMarketVolume?: number;
  marketCap?: number;
  trailingPE?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  regularMarketOpen?: number;
  regularMarketPreviousClose?: number;
}

// NSE symbols with Yahoo Finance suffix
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

async function fetchQuotes(symbols: string[]): Promise<YahooQuote[]> {
  const symbolList = symbols.join(',');
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbolList)}`;

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Yahoo Finance API error: ${res.status} - ${text}`);
  }

  const data = await res.json();
  return data?.quoteResponse?.result || [];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const exchange = url.searchParams.get('exchange') || 'NSE';
    const symbols = exchange === 'BSE' ? BSE_SYMBOLS : NSE_SYMBOLS;

    const quotes = await fetchQuotes(symbols);

    const stocks = quotes.map((q) => {
      const sym = cleanSymbol(q.symbol || '');
      return {
        symbol: sym,
        name: q.longName || q.shortName || sym,
        exchange: exchange as 'NSE' | 'BSE',
        price: q.regularMarketPrice || 0,
        change: q.regularMarketChange || 0,
        changePercent: q.regularMarketChangePercent || 0,
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

    return new Response(JSON.stringify({ stocks, fetchedAt: new Date().toISOString() }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return new Response(JSON.stringify({ error: error.message, stocks: [] }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
