import { Link } from 'react-router-dom';
import { CreativePricing } from '@/components/ui/creative-pricing';
import type { PricingTier } from '@/components/ui/creative-pricing';
import { TrendingUp, BarChart3, Zap, Crown } from 'lucide-react';

const tiers: PricingTier[] = [
  {
    name: 'Free',
    icon: <BarChart3 className="w-6 h-6" />,
    price: 0,
    description: 'Get started with market basics',
    color: 'amber',
    features: [
      'Live market overview',
      'Top 10 NSE & BSE stocks',
      'Basic AI predictions',
      'IPO listings',
    ],
  },
  {
    name: 'Pro Trader',
    icon: <Zap className="w-6 h-6" />,
    price: 49,
    description: 'For serious market participants',
    color: 'blue',
    popular: true,
    features: [
      'Full stock screener access',
      'Advanced AI predictions',
      'Real-time price alerts',
      'Sector analysis & heatmaps',
    ],
  },
  {
    name: 'Institutional',
    icon: <Crown className="w-6 h-6" />,
    price: 199,
    description: 'Enterprise-grade intelligence',
    color: 'purple',
    features: [
      'API access & webhooks',
      'Portfolio risk analytics',
      'Custom AI model tuning',
      'Dedicated support',
    ],
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-bullish rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground text-base tracking-tight">
              Stock<span className="text-bullish">Sense</span>
              <span className="text-[10px] font-mono text-muted-foreground ml-1.5">AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sign in
            </Link>
            <Link
              to="/signup"
              className="text-sm font-medium bg-bullish text-primary-foreground px-4 py-1.5 rounded-lg hover:bg-bullish/90 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <CreativePricing
        tag="Pricing Plans"
        title="Unlock Market Intelligence"
        description="Choose the plan that fits your trading style"
        tiers={tiers}
      />

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">← Back to Dashboard</Link>
      </footer>
    </div>
  );
};

export default Pricing;
