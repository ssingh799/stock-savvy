import { useState } from 'react';
import { Stock } from '@/data/stockData';
import { TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StockRowProps {
  stock: Stock;
  onClick: (stock: Stock) => void;
  selected: boolean;
}

export const StockRow = ({ stock, onClick, selected }: StockRowProps) => {
  const bullish = stock.change >= 0;

  return (
    <div
      onClick={() => onClick(stock)}
      className={`flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-lg cursor-pointer transition-all border ${
        selected
          ? 'bg-bullish/5 border-bullish/40'
          : 'bg-surface-1 border-transparent hover:border-border hover:bg-surface-2'
      }`}
    >
      {/* Symbol + Name */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-sm text-foreground truncate">{stock.symbol}</span>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-border text-muted-foreground hidden sm:inline-flex">
            {stock.exchange}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">{stock.name}</p>
      </div>

      {/* Sector */}
      <div className="hidden md:block w-24">
        <span className="text-xs text-muted-foreground bg-surface-3 px-2 py-0.5 rounded-full">{stock.sector}</span>
      </div>

      {/* Volume */}
      <div className="hidden lg:block w-16 text-right">
        <p className="text-xs text-muted-foreground">{stock.volume}</p>
        <p className="text-[10px] text-muted-foreground/60">Vol</p>
      </div>

      {/* Price + Change */}
      <div className="text-right min-w-[90px]">
        <p className="font-mono font-bold text-sm text-foreground">₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
        <div className={`flex items-center justify-end gap-0.5 text-xs font-mono ${bullish ? 'text-bullish' : 'text-bearish'}`}>
          {bullish ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{bullish ? '+' : ''}{stock.changePercent.toFixed(2)}%</span>
        </div>
      </div>

      <ChevronRight className={`w-4 h-4 shrink-0 transition-colors ${selected ? 'text-bullish' : 'text-border'}`} />
    </div>
  );
};

interface StockListProps {
  stocks: Stock[];
  onSelect: (stock: Stock) => void;
  selectedSymbol?: string;
  searchQuery: string;
}

export const StockList = ({ stocks, onSelect, selectedSymbol, searchQuery }: StockListProps) => {
  const filtered = stocks.filter(
    (s) =>
      s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filtered.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-sm">No stocks match "{searchQuery}"</p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {filtered.map((stock) => (
        <StockRow
          key={`${stock.exchange}-${stock.symbol}`}
          stock={stock}
          onClick={onSelect}
          selected={selectedSymbol === stock.symbol}
        />
      ))}
    </div>
  );
};
