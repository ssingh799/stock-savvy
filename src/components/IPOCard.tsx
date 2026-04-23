import { IPO } from '@/data/stockData';
import { TrendingUp, TrendingDown, Calendar, CheckCircle, XCircle, AlertTriangle, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const predictionConfig = {
  APPLY: {
    icon: CheckCircle,
    color: 'text-bullish',
    bg: 'bg-bullish-bg',
    border: 'border-bullish/30',
    badge: 'bg-bullish text-primary-foreground',
    glow: 'glow-green',
  },
  AVOID: {
    icon: XCircle,
    color: 'text-bearish',
    bg: 'bg-bearish-bg',
    border: 'border-bearish/30',
    badge: 'bg-bearish text-destructive-foreground',
    glow: 'glow-red',
  },
  RISKY: {
    icon: AlertTriangle,
    color: 'text-gold',
    bg: 'bg-gold-bg',
    border: 'border-gold/30',
    badge: 'bg-gold text-accent-foreground',
    glow: 'glow-gold',
  },
};

const statusConfig = {
  OPEN: { color: 'bg-bullish text-primary-foreground', label: '● OPEN' },
  UPCOMING: { color: 'bg-gold text-accent-foreground', label: '◆ UPCOMING' },
  LISTED: { color: 'bg-surface-3 text-muted-foreground', label: '✓ LISTED' },
  CLOSED: { color: 'bg-surface-3 text-muted-foreground', label: '✕ CLOSED' },
};

interface IPOCardProps {
  ipo: IPO;
}

export const IPOCard = ({ ipo }: IPOCardProps) => {
  const config = predictionConfig[ipo.prediction];
  const status = statusConfig[ipo.status];
  const PredIcon = config.icon;
  const gmpPositive = ipo.gmp >= 0;

  return (
    <div className={`bg-surface-1 border ${config.border} rounded-xl overflow-hidden card-hover tilt-3d`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <h3 className="font-bold text-foreground text-sm leading-tight">{ipo.company}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{ipo.sector}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${status.color}`}>
              {status.label}
            </span>
          </div>
        </div>

        {/* Price Range + GMP */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground">Price Range</p>
            <p className="font-mono font-bold text-foreground text-sm">{ipo.priceRange}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground">GMP (Grey Market)</p>
            <div className={`flex items-center justify-end gap-1 ${gmpPositive ? 'text-bullish' : 'text-bearish'}`}>
              {gmpPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span className="font-mono font-bold text-sm">{gmpPositive ? '+' : ''}₹{ipo.gmp}</span>
              <span className="font-mono text-xs">({gmpPositive ? '+' : ''}{ipo.gmpPercent}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Data */}
      <div className="grid grid-cols-4 divide-x divide-border border-b border-border">
        {[
          { label: 'Total', value: ipo.totalSubscription },
          { label: 'QIB', value: ipo.qib },
          { label: 'NII', value: ipo.nii },
          { label: 'RII', value: ipo.rii },
        ].map((sub) => (
          <div key={sub.label} className="text-center py-2.5 px-1">
            <p className="text-[10px] text-muted-foreground">{sub.label}</p>
            <p className={`font-mono font-bold text-xs ${sub.value !== 'N/A' && parseFloat(sub.value) > 1 ? 'text-bullish' : 'text-muted-foreground'}`}>
              {sub.value}
            </p>
          </div>
        ))}
      </div>

      {/* Details */}
      <div className="p-4 grid grid-cols-2 gap-2 text-xs border-b border-border">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3 h-3 text-muted-foreground" />
          <span className="text-muted-foreground">Open:</span>
          <span className="text-foreground font-medium">{ipo.openDate}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3 h-3 text-muted-foreground" />
          <span className="text-muted-foreground">Close:</span>
          <span className="text-foreground font-medium">{ipo.closeDate}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Lot Size:</span>
          <span className="text-foreground font-medium ml-1">{ipo.lotSize} shares</span>
        </div>
        <div>
          <span className="text-muted-foreground">Min Amt:</span>
          <span className="text-foreground font-medium ml-1">₹{ipo.minAmount.toLocaleString('en-IN')}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Issue Size:</span>
          <span className="text-foreground font-medium ml-1">{ipo.issueSize}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Listing:</span>
          <span className="text-foreground font-medium ml-1">{ipo.listingDate}</span>
        </div>
        {ipo.faceValue !== undefined && (
          <div>
            <span className="text-muted-foreground">Face Value:</span>
            <span className="text-foreground font-medium ml-1">₹{ipo.faceValue}</span>
          </div>
        )}
        {ipo.exchange && (
          <div>
            <span className="text-muted-foreground">Exchange:</span>
            <span className="text-foreground font-medium ml-1">{ipo.exchange}</span>
          </div>
        )}
        {ipo.leadManager && (
          <div className="col-span-2">
            <span className="text-muted-foreground">Lead Manager:</span>
            <span className="text-foreground font-medium ml-1">{ipo.leadManager}</span>
          </div>
        )}
        {ipo.registrar && (
          <div className="col-span-2">
            <span className="text-muted-foreground">Registrar:</span>
            <span className="text-foreground font-medium ml-1">{ipo.registrar}</span>
          </div>
        )}
      </div>

      {/* Listing result (for closed/listed IPOs) */}
      {ipo.listingPrice !== undefined && ipo.listingGainPercent !== undefined && (
        <div className={`px-4 py-3 border-b border-border ${ipo.listingGainPercent >= 0 ? 'bg-bullish-bg' : 'bg-bearish-bg'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Listing Price</p>
              <p className="font-mono font-bold text-foreground text-sm">₹{ipo.listingPrice}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Listing Gain</p>
              <p className={`font-mono font-bold text-sm flex items-center gap-1 ${ipo.listingGainPercent >= 0 ? 'text-bullish' : 'text-bearish'}`}>
                {ipo.listingGainPercent >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {ipo.listingGainPercent >= 0 ? '+' : ''}{ipo.listingGainPercent}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* AI Prediction */}
      <div className={`p-4 ${config.bg}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <PredIcon className={`w-4 h-4 ${config.color}`} />
            <span className={`font-bold text-sm ${config.color}`}>{ipo.prediction}</span>
          </div>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3 h-3 ${star <= ipo.rating ? 'text-gold fill-gold' : 'text-border'}`}
              />
            ))}
          </div>
        </div>
        <p className="text-xs text-foreground/80 leading-relaxed">{ipo.predictionReason}</p>
      </div>
    </div>
  );
};
