import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { MarketTicker, MarketOverviewCards } from '@/components/MarketTicker';
import { StockList } from '@/components/StockList';
import { Cell } from 'recharts';
import { PredictionPanel } from '@/components/PredictionPanel';
import { IPOCard } from '@/components/IPOCard';
import { nseStocks, bseStocks, stockPredictions, ipoData, marketIndices, Stock } from '@/data/stockData';
import { useStockData } from '@/hooks/useStockData';
import { Search, TrendingUp, TrendingDown, BarChart3, RefreshCw, Info, Cpu, Wifi, WifiOff, Database } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import dashboardPreview from '@/assets/dashboard-preview.jpg';
import Hero from '@/components/ui/animated-shader-hero';

// Simulate live price changes
const useLivePrices = (stocks: Stock[]) => {
  const [prices, setPrices] = useState<Record<string, { price: number; change: number; changePercent: number }>>({});

  useEffect(() => {
    // init
    const init: typeof prices = {};
    stocks.forEach((s) => { init[s.symbol] = { price: s.price, change: s.change, changePercent: s.changePercent }; });
    setPrices(init);

    const interval = setInterval(() => {
      setPrices((prev) => {
        const next = { ...prev };
        // randomly update 3-5 stocks
        const toUpdate = stocks.sort(() => 0.5 - Math.random()).slice(0, 4);
        toUpdate.forEach((s) => {
          const delta = (Math.random() - 0.5) * s.price * 0.004;
          const newPrice = parseFloat((s.price + delta).toFixed(2));
          const newChange = parseFloat((s.change + delta).toFixed(2));
          next[s.symbol] = { price: newPrice, change: newChange, changePercent: parseFloat(((newChange / s.prevClose) * 100).toFixed(2)) };
        });
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [stocks]);

  return prices;
};

// Sector performance data
const sectorData = [
  { sector: 'Banking', change: 1.28 },
  { sector: 'IT', change: -0.51 },
  { sector: 'Pharma', change: 0.64 },
  { sector: 'Auto', change: -0.76 },
  { sector: 'Metal', change: 2.13 },
  { sector: 'Energy', change: 1.51 },
  { sector: 'FMCG', change: 0.24 },
  { sector: 'Telecom', change: 1.92 },
];

const niftyHistory = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  value: 22800 + Math.sin(i * 0.3) * 400 + i * 35 + (Math.random() - 0.5) * 150,
}));

const MarketView = () => (
  <div className="space-y-6">
    {/* Shader Hero */}
    <div className="-mx-4 sm:-mx-4 -mt-6">
      <Hero
        trustBadge={{ text: "Markets Open · NSE & BSE", icons: ["🟢"] }}
        headline={{ line1: "Market Intelligence", line2: "Powered by AI" }}
        subtitle="AI-powered predictions · Real-time prices · IPO insights"
        className="min-h-[70vh]"
      >
        <p className="text-4xl font-bold font-mono text-primary mt-6 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          23,842 <span className="text-sm text-muted-foreground font-normal">NIFTY 50 · +1.21%</span>
        </p>
      </Hero>
    </div>

    <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden border border-border shadow-2xl mb-8 card-hover tilt-3d">
      <img
        src={dashboardPreview}
        alt="Market dashboard preview"
        className="w-full h-auto object-cover"
        loading="lazy"
      />
    </div>

    <MarketOverviewCards />

    {/* Charts row */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* NIFTY 50 Chart */}
      <div className="bg-surface-1 border border-border rounded-xl p-4 card-hover tilt-3d">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground">NIFTY 50</p>
            <p className="font-mono font-bold text-xl text-foreground">23,842.80</p>
          </div>
          <span className="text-bullish text-sm font-mono font-bold">+1.21%</span>
        </div>
        <ResponsiveContainer width="100%" height={150}>
          <AreaChart data={niftyHistory}>
            <defs>
              <linearGradient id="niftyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(152,69%,42%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(152,69%,42%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" hide />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{ background: 'hsl(220,18%,11%)', border: '1px solid hsl(220,15%,18%)', borderRadius: '8px', fontSize: '11px' }}
              itemStyle={{ color: 'hsl(152,69%,42%)' }}
              formatter={(v: number) => [v.toFixed(0), 'NIFTY']}
            />
            <Area type="monotone" dataKey="value" stroke="hsl(152,69%,42%)" fill="url(#niftyGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Sector Performance */}
      <div className="bg-surface-1 border border-border rounded-xl p-4 card-hover tilt-3d">
        <p className="text-sm font-medium text-foreground mb-4">Sector Performance (Today)</p>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={sectorData} layout="vertical" margin={{ left: 10, right: 20 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="sector" tick={{ fontSize: 10, fill: 'hsl(215,16%,55%)' }} width={55} />
            <Tooltip
              contentStyle={{ background: 'hsl(220,18%,11%)', border: '1px solid hsl(220,15%,18%)', borderRadius: '8px', fontSize: '11px' }}
              formatter={(v: number) => [`${v > 0 ? '+' : ''}${v}%`, 'Change']}
            />
            <Bar dataKey="change" radius={[0, 4, 4, 0]} label={false}>
              {sectorData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.change >= 0 ? 'hsl(152,69%,42%)' : 'hsl(4,90%,58%)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Top Movers */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Top Gainers */}
      <div className="bg-surface-1 border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-bullish" />
          <p className="text-sm font-semibold text-foreground">Top Gainers</p>
        </div>
        <div className="space-y-2">
          {[...nseStocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5).map((s) => (
            <div key={s.symbol} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
              <div>
                <p className="text-xs font-mono font-bold text-foreground">{s.symbol}</p>
                <p className="text-[10px] text-muted-foreground">{s.sector}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-xs text-foreground">₹{s.price.toLocaleString('en-IN')}</p>
                <p className="font-mono text-xs text-bullish">+{s.changePercent.toFixed(2)}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Losers */}
      <div className="bg-surface-1 border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingDown className="w-4 h-4 text-bearish" />
          <p className="text-sm font-semibold text-foreground">Top Losers</p>
        </div>
        <div className="space-y-2">
          {[...nseStocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5).map((s) => (
            <div key={s.symbol} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
              <div>
                <p className="text-xs font-mono font-bold text-foreground">{s.symbol}</p>
                <p className="text-[10px] text-muted-foreground">{s.sector}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-xs text-foreground">₹{s.price.toLocaleString('en-IN')}</p>
                <p className="font-mono text-xs text-bearish">{s.changePercent.toFixed(2)}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* All Market Indices */}
    <div className="bg-surface-1 border border-border rounded-xl p-4">
      <p className="text-sm font-semibold text-foreground mb-3">All Indices</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {marketIndices.map((idx) => (
          <div key={idx.name} className={`rounded-lg p-3 ${idx.bullish ? 'bg-bullish-bg' : 'bg-bearish-bg'}`}>
            <p className="text-[10px] text-muted-foreground mb-1">{idx.name}</p>
            <p className="font-mono font-bold text-foreground text-sm">{idx.value}</p>
            <p className={`font-mono text-xs ${idx.bullish ? 'text-bullish' : 'text-bearish'}`}>{idx.changePercent}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Disclaimer */}
    <div className="flex gap-2 bg-gold-bg border border-gold/20 rounded-xl p-3">
      <Info className="w-4 h-4 text-gold shrink-0 mt-0.5" />
      <p className="text-xs text-muted-foreground">
        <span className="text-gold font-medium">Data Notice:</span> Prices shown are simulated for demonstration. 
        Real-time NSE/BSE data requires a licensed data provider API (NSEpy, MarketStack, etc.) connected via backend. 
        AI predictions are for educational purposes only — not financial advice.
      </p>
    </div>
  </div>
);

interface StockViewProps {
  stocks: Stock[];
  exchange: 'NSE' | 'BSE';
}

const StockView = ({ stocks: fallbackStocks, exchange }: StockViewProps) => {
  const { stocks: liveStocks, loading, error, lastUpdated, refetch, isLive, fromCache } = useStockData(exchange);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('All');

  const stocks = liveStocks.length > 0 ? liveStocks : fallbackStocks;
  const sectors = ['All', ...Array.from(new Set(stocks.map((s) => s.sector)))];
  const prediction = selectedStock ? stockPredictions[selectedStock.symbol] : null;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">{exchange} Stocks</h2>
          <p className="text-xs text-muted-foreground">
            {stocks.length} stocks · Click to get AI prediction
            {lastUpdated && <span className="ml-1 text-muted-foreground/60">· Updated {new Date(lastUpdated).toLocaleTimeString('en-IN')}</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={refetch} className="p-1.5 rounded-lg bg-surface-1 border border-border hover:border-bullish/30 transition-colors" title="Refresh">
            <RefreshCw className={`w-3.5 h-3.5 text-muted-foreground ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${isLive ? (fromCache ? 'bg-gold-bg border border-gold/20' : 'bg-bullish-bg border border-bullish/20') : 'bg-bearish-bg border border-bearish/20'}`}>
            {isLive ? (fromCache ? <Database className="w-3 h-3 text-gold" /> : <Wifi className="w-3 h-3 text-bullish" />) : <WifiOff className="w-3 h-3 text-bearish" />}
            <span className={`text-xs font-mono ${isLive ? (fromCache ? 'text-gold' : 'text-bullish') : 'text-bearish'}`}>
              {isLive ? (fromCache ? 'CACHED' : 'LIVE') : 'OFFLINE'}
            </span>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stocks, sectors..."
            className="w-full bg-surface-1 border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-bullish/50"
          />
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
          {sectors.slice(0, 6).map((sector) => (
            <button
              key={sector}
              onClick={() => setSectorFilter(sector)}
              className={`shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                sectorFilter === sector
                  ? 'bg-bullish text-primary-foreground'
                  : 'bg-surface-1 text-muted-foreground border border-border hover:border-bullish/30'
              }`}
            >
              {sector}
            </button>
          ))}
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Stock list */}
        <div className={`${selectedStock ? 'lg:col-span-3' : 'lg:col-span-5'}`}>
          <StockList
            stocks={stocks.filter((s) => sectorFilter === 'All' || s.sector === sectorFilter)}
            onSelect={(stock) => setSelectedStock(stock)}
            selectedSymbol={selectedStock?.symbol}
            searchQuery={search}
          />
        </div>

        {/* Prediction panel */}
        {selectedStock && (
          <div className="lg:col-span-2">
            <div className="sticky top-20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-bullish" />
                  <p className="text-sm font-semibold text-foreground">AI Prediction</p>
                </div>
                <button
                  onClick={() => setSelectedStock(null)}
                  className="text-muted-foreground hover:text-foreground p-1"
                >
                  ✕
                </button>
              </div>
              {prediction ? (
                <PredictionPanel
                  prediction={prediction}
                  stockName={selectedStock.name}
                  currentPrice={selectedStock.price}
                />
              ) : (
                <div className="bg-surface-1 border border-border rounded-xl p-6 text-center">
                  <BarChart3 className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">{selectedStock.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">Full prediction coming soon for this stock</p>
                  <p className="font-mono font-bold text-2xl text-bullish mt-3">
                    ₹{selectedStock.price.toLocaleString('en-IN')}
                  </p>
                  <p className={`text-sm font-mono mt-1 ${selectedStock.changePercent >= 0 ? 'text-bullish' : 'text-bearish'}`}>
                    {selectedStock.changePercent >= 0 ? '+' : ''}
                    {selectedStock.changePercent.toFixed(2)}%
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const IPOView = () => {
  const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'UPCOMING' | 'CLOSED'>('ALL');
  const filters = ['ALL', 'OPEN', 'UPCOMING', 'CLOSED'] as const;

  const filtered = ipoData.filter((ipo) => filter === 'ALL' || ipo.status === filter);

  return (
    <div className="animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">IPO Hub</h2>
          <p className="text-xs text-muted-foreground">AI predictions · GMP tracker · Apply or avoid recommendations</p>
        </div>
        <Badge variant="outline" className="text-gold border-gold/30 bg-gold-bg">
          {ipoData.filter((i) => i.status === 'OPEN').length} Live
        </Badge>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              filter === f
                ? 'bg-bullish text-primary-foreground'
                : 'bg-surface-1 border border-border text-muted-foreground hover:border-bullish/30'
            }`}
          >
            {f} {f === 'ALL' ? `(${ipoData.length})` : `(${ipoData.filter((i) => i.status === f).length})`}
          </button>
        ))}
      </div>

      {/* IPO cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((ipo) => (
          <IPOCard key={ipo.symbol} ipo={ipo} />
        ))}
      </div>

      {/* GMP Explanation */}
      <div className="mt-6 bg-surface-1 border border-border rounded-xl p-4">
        <h3 className="text-sm font-semibold text-foreground mb-2">Understanding GMP (Grey Market Premium)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
          <div className="bg-bullish-bg rounded-lg p-3">
            <p className="text-bullish font-semibold mb-1">High GMP (&gt;10%)</p>
            <p>Strong listing gains expected. High demand in grey market. Generally safe to apply.</p>
          </div>
          <div className="bg-gold-bg rounded-lg p-3">
            <p className="text-gold font-semibold mb-1">Moderate GMP (1-10%)</p>
            <p>Decent listing likely. Apply based on company fundamentals and subscription data.</p>
          </div>
          <div className="bg-bearish-bg rounded-lg p-3">
            <p className="text-bearish font-semibold mb-1">Negative GMP</p>
            <p>Listing below issue price expected. High risk. Avoid unless strong long-term thesis.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  const [activeTab, setActiveTab] = useState('market');

  return (
    <div className="min-h-screen bg-background">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <MarketTicker />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {activeTab === 'market' && <MarketView />}
        {activeTab === 'nse' && <StockView stocks={nseStocks} exchange="NSE" />}
        {activeTab === 'bse' && <StockView stocks={bseStocks} exchange="BSE" />}
        {activeTab === 'ipo' && <IPOView />}
      </main>

      <footer className="border-t border-border mt-10 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            StockSense AI · For educational purposes only · Not financial advice ·
            <span className="text-muted-foreground/60 ml-1">Data is simulated · Consult SEBI-registered advisors</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
