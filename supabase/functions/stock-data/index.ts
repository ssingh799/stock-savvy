const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

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

// Step 1: Get a crumb + cookies from Yahoo Finance
async function getCrumb(): Promise<{ crumb: string; cookie: string }> {
  // First, visit Yahoo Finance to get cookies
  const initRes = await fetch('https://fc.yahoo.com', {
    redirect: 'manual',
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
  });
  await initRes.text(); // consume body

  const setCookies = initRes.headers.get('set-cookie') || '';
  
  // Now get the crumb using the cookies
  const crumbRes = await fetch('https://query2.finance.yahoo.com/v1/test/getcrumb', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Cookie': setCookies,
    },
  });
  
  const crumb = await crumbRes.text();
  const crumbCookies = crumbRes.headers.get('set-cookie') || setCookies;
  
  return { crumb, cookie: crumbCookies };
}

async function fetchQuotes(symbols: string[]): Promise<any[]> {
  // Try crumb-based auth first
  try {
    const { crumb, cookie } = await getCrumb();
    
    if (crumb && !crumb.includes('error')) {
      const symbolList = symbols.join(',');
      const url = `https://query2.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbolList)}&crumb=${encodeURIComponent(crumb)}`;
      
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Cookie': cookie,
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        return data?.quoteResponse?.result || [];
      }
      await res.text(); // consume body
    }
  } catch (e) {
    console.log('Crumb auth failed, trying fallback:', e.message);
  }

  // Fallback: use individual chart endpoint (no auth needed)
  const results: any[] = [];
  
  // Fetch in parallel batches
  const batchSize = 5;
  for (let i = 0; i < symbols.length; i += batchSize) {
    const batch = symbols.slice(i, i + batchSize);
    const promises = batch.map(async (sym) => {
      try {
        const url = `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1d&range=1d`;
        const res = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        });
        
        if (!res.ok) {
          await res.text();
          return null;
        }
        
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
        return null;
      }
    });
    
    const batchResults = await Promise.all(promises);
    results.push(...batchResults.filter(Boolean));
  }
  
  return results;
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
