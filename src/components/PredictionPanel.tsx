import { StockPrediction } from '@/data/stockData';
import { TrendingUp, TrendingDown, Newspaper, BarChart3, Target, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const generatePriceData = (currentPrice: number, support: number, resistance: number) => {
  const data = [];
  let price = support + (currentPrice - support) * 0.3;
  for (let i = 0; i < 30; i++) {
    price += (Math.random() - 0.45) * (currentPrice * 0.012);
    price = Math.max(support * 0.98, Math.min(resistance * 1.02, price));
    if (i === 29) price = currentPrice;
    data.push({ day: i + 1, price: parseFloat(price.toFixed(2)) });
  }
  return data;
};

const signalConfig = {
  'STRONG BUY': { bg: 'bg-bullish', text: 'text-primary-foreground', glow: 'glow-green' },
  'BUY': { bg: 'bg-bullish/80', text: 'text-primary-foreground', glow: '' },
  'HOLD': { bg: 'bg-gold/80', text: 'text-accent-foreground', glow: '' },
  'SELL': { bg: 'bg-bearish/80', text: 'text-destructive-foreground', glow: '' },
  'STRONG SELL': { bg: 'bg-bearish', text: 'text-destructive-foreground', glow: 'glow-red' },
};

interface PredictionPanelProps {
  prediction: StockPrediction;
  stockName: string;
  currentPrice: number;
}

export const PredictionPanel = ({ prediction, stockName, currentPrice }: PredictionPanelProps) => {
  const config = signalConfig[prediction.signal];
  const chartData = generatePriceData(currentPrice, prediction.support2, prediction.resistance2);
  const upside = (((prediction.targetPrice - currentPrice) / currentPrice) * 100).toFixed(1);
  const downside = (((prediction.stopLoss - currentPrice) / currentPrice) * 100).toFixed(1);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header Signal */}
      <div className={`rounded-xl p-4 ${config.bg} ${config.glow}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-xs font-medium opacity-80 ${config.text}`}>AI Signal — {stockName}</p>
            <p className={`text-2xl font-bold mt-0.5 ${config.text}`}>{prediction.signal}</p>
          </div>
          <div className="text-right">
            <p className={`text-xs opacity-80 ${config.text}`}>Confidence</p>
            <p className={`text-2xl font-bold font-mono ${config.text}`}>{prediction.confidence}%</p>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1">
            <span className={`opacity-70 ${config.text}`}>Confidence Score</span>
          </div>
          <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/60 rounded-full transition-all duration-1000"
              style={{ width: `${prediction.confidence}%` }}
            />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-surface-1 border border-border rounded-xl p-4">
        <p className="text-xs text-muted-foreground mb-3">30-Day Price Simulation</p>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(152,69%,42%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(152,69%,42%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" hide />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{ background: 'hsl(220,18%,11%)', border: '1px solid hsl(220,15%,18%)', borderRadius: '8px', fontSize: '12px' }}
              labelStyle={{ color: 'hsl(215,16%,55%)' }}
              itemStyle={{ color: 'hsl(152,69%,42%)' }}
              formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, 'Price']}
            />
            <Area type="monotone" dataKey="price" stroke="hsl(152,69%,42%)" fill="url(#priceGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Targets */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-bullish-bg border border-bullish/20 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Target className="w-3.5 h-3.5 text-bullish" />
            <p className="text-xs text-bullish font-medium">Target Price</p>
          </div>
          <p className="font-mono font-bold text-lg text-bullish">₹{prediction.targetPrice.toLocaleString('en-IN')}</p>
          <p className="text-xs text-bullish/70 mt-0.5">+{upside}% upside</p>
        </div>
        <div className="bg-bearish-bg border border-bearish/20 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Shield className="w-3.5 h-3.5 text-bearish" />
            <p className="text-xs text-bearish font-medium">Stop Loss</p>
          </div>
          <p className="font-mono font-bold text-lg text-bearish">₹{prediction.stopLoss.toLocaleString('en-IN')}</p>
          <p className="text-xs text-bearish/70 mt-0.5">{downside}% downside</p>
        </div>
      </div>

      {/* Support & Resistance */}
      <div className="bg-surface-1 border border-border rounded-xl p-4">
        <p className="text-xs text-muted-foreground font-medium mb-3 flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5" /> Support & Resistance Levels
        </p>
        <div className="space-y-2">
          {[
            { label: 'Resistance 2', value: prediction.resistance2, type: 'R2' },
            { label: 'Resistance 1', value: prediction.resistance1, type: 'R1' },
            { label: 'Current Price', value: currentPrice, type: 'CMP' },
            { label: 'Support 1', value: prediction.support1, type: 'S1' },
            { label: 'Support 2', value: prediction.support2, type: 'S2' },
          ].map((level) => {
            const isResistance = level.type.startsWith('R');
            const isCurrent = level.type === 'CMP';
            return (
              <div key={level.type} className="flex items-center gap-3">
                <span className={`text-[10px] font-mono font-bold w-6 ${isResistance ? 'text-bearish' : isCurrent ? 'text-gold' : 'text-bullish'}`}>
                  {level.type}
                </span>
                <div className="flex-1 h-px bg-border relative">
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 h-2 rounded-full ${isResistance ? 'bg-bearish' : isCurrent ? 'bg-gold' : 'bg-bullish'}`}
                    style={{ width: `${Math.min(100, Math.max(0, ((level.value - prediction.support2) / (prediction.resistance2 - prediction.support2)) * 100))}%` }}
                  />
                </div>
                <span className={`font-mono text-xs font-semibold w-24 text-right ${isResistance ? 'text-bearish' : isCurrent ? 'text-gold' : 'text-bullish'}`}>
                  ₹{level.value.toLocaleString('en-IN')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technical Indicators */}
      <div className="bg-surface-1 border border-border rounded-xl p-4">
        <p className="text-xs text-muted-foreground font-medium mb-3">Technical Indicators</p>
        <div className="grid grid-cols-2 gap-2">
          {prediction.technicals.map((tech) => (
            <div key={tech.name} className="flex items-center justify-between bg-surface-2 rounded-lg px-3 py-2">
              <span className="text-xs text-muted-foreground">{tech.name}</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs text-foreground">{tech.value}</span>
                <Badge
                  variant="outline"
                  className={`text-[9px] px-1 py-0 border-0 font-bold ${
                    tech.signal === 'BUY' ? 'bg-bullish-bg text-bullish' :
                    tech.signal === 'SELL' ? 'bg-bearish-bg text-bearish' :
                    'bg-gold-bg text-gold'
                  }`}
                >
                  {tech.signal}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* News Sentiment */}
      <div className="bg-surface-1 border border-border rounded-xl p-4">
        <p className="text-xs text-muted-foreground font-medium mb-3 flex items-center gap-1.5">
          <Newspaper className="w-3.5 h-3.5" /> News & Sentiment
        </p>
        <div className="space-y-2.5">
          {prediction.news.map((item, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                item.sentiment === 'positive' ? 'bg-bullish' :
                item.sentiment === 'negative' ? 'bg-bearish' : 'bg-gold'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground leading-snug">{item.headline}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{item.source} · {item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
