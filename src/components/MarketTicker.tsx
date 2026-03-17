import { marketIndices } from '@/data/stockData';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

export const MarketTicker = () => {
  const doubled = [...marketIndices, ...marketIndices];

  return (
    <div className="bg-surface-1 border-b border-border overflow-hidden py-2">
      <div className="ticker-track">
        {doubled.map((index, i) => (
          <span key={i} className="inline-flex items-center gap-2 px-6 text-sm">
            <span className="text-muted-foreground font-medium">{index.name}</span>
            <span className="font-mono font-semibold text-foreground">{index.value}</span>
            <span className={`flex items-center gap-1 font-mono text-xs ${index.bullish ? 'text-bullish' : 'text-bearish'}`}>
              {index.bullish ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {index.changePercent}
            </span>
            <span className="text-border mx-2">|</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export const MarketOverviewCards = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {marketIndices.slice(0, 4).map((index) => (
        <div key={index.name} className={`bg-surface-1 border rounded-lg p-4 card-hover tilt-3d cursor-default ${index.bullish ? 'border-bullish/20' : 'border-bearish/20'}`}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground font-medium">{index.name}</p>
            <Activity className={`w-3.5 h-3.5 ${index.bullish ? 'text-bullish' : 'text-bearish'}`} />
          </div>
          <p className="font-mono font-bold text-lg text-foreground leading-none mb-1">{index.value}</p>
          <div className={`flex items-center gap-1 text-xs font-mono ${index.bullish ? 'text-bullish' : 'text-bearish'}`}>
            {index.bullish ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{index.change}</span>
            <span>({index.changePercent})</span>
          </div>
        </div>
      ))}
    </div>
  );
};
