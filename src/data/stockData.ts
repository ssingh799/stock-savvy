export interface Stock {
  symbol: string;
  name: string;
  exchange: 'NSE' | 'BSE';
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  pe: number;
  high52w: number;
  low52w: number;
  sector: string;
  open: number;
  prevClose: number;
}

export interface StockPrediction {
  symbol: string;
  signal: 'STRONG BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG SELL';
  targetPrice: number;
  stopLoss: number;
  support1: number;
  support2: number;
  resistance1: number;
  resistance2: number;
  rsi: number;
  macd: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  confidence: number;
  news: NewsItem[];
  technicals: TechnicalIndicator[];
}

export interface NewsItem {
  headline: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  time: string;
  source: string;
}

export interface TechnicalIndicator {
  name: string;
  value: string;
  signal: 'BUY' | 'SELL' | 'NEUTRAL';
}

export interface IPO {
  company: string;
  symbol: string;
  priceRange: string;
  gmp: number;
  gmpPercent: number;
  openDate: string;
  closeDate: string;
  listingDate: string;
  subscriptionStatus: string;
  qib: string;
  nii: string;
  rii: string;
  totalSubscription: string;
  lotSize: number;
  minAmount: number;
  issueSize: string;
  sector: string;
  prediction: 'APPLY' | 'AVOID' | 'RISKY';
  predictionReason: string;
  rating: number;
  status: 'OPEN' | 'UPCOMING' | 'LISTED' | 'CLOSED';
  exchange?: 'NSE' | 'BSE' | 'NSE & BSE';
  leadManager?: string;
  registrar?: string;
  listingPrice?: number;
  listingGainPercent?: number;
  faceValue?: number;
}

export const nseStocks: Stock[] = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', exchange: 'NSE', price: 2847.65, change: 42.30, changePercent: 1.51, volume: '8.2M', marketCap: '19.2T', pe: 27.4, high52w: 3024.90, low52w: 2220.50, sector: 'Energy', open: 2810.00, prevClose: 2805.35 },
  { symbol: 'TCS', name: 'Tata Consultancy Services', exchange: 'NSE', price: 4218.40, change: -28.75, changePercent: -0.68, volume: '2.1M', marketCap: '15.4T', pe: 31.2, high52w: 4592.25, low52w: 3601.65, sector: 'IT', open: 4240.00, prevClose: 4247.15 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', exchange: 'NSE', price: 1724.80, change: 18.45, changePercent: 1.08, volume: '6.8M', marketCap: '13.1T', pe: 22.8, high52w: 1880.00, low52w: 1363.45, sector: 'Banking', open: 1710.00, prevClose: 1706.35 },
  { symbol: 'INFY', name: 'Infosys', exchange: 'NSE', price: 1842.60, change: -15.20, changePercent: -0.82, volume: '4.5M', marketCap: '7.7T', pe: 28.6, high52w: 2006.45, low52w: 1358.35, sector: 'IT', open: 1855.00, prevClose: 1857.80 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', exchange: 'NSE', price: 1298.75, change: 22.10, changePercent: 1.73, volume: '9.1M', marketCap: '9.1T', pe: 19.4, high52w: 1362.30, low52w: 970.20, sector: 'Banking', open: 1280.00, prevClose: 1276.65 },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', exchange: 'NSE', price: 1687.45, change: 31.80, changePercent: 1.92, volume: '3.4M', marketCap: '10.1T', pe: 45.2, high52w: 1779.00, low52w: 1087.95, sector: 'Telecom', open: 1658.00, prevClose: 1655.65 },
  { symbol: 'WIPRO', name: 'Wipro', exchange: 'NSE', price: 578.30, change: -8.40, changePercent: -1.43, volume: '5.2M', marketCap: '3.0T', pe: 24.1, high52w: 640.20, low52w: 408.40, sector: 'IT', open: 584.00, prevClose: 586.70 },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance', exchange: 'NSE', price: 7842.50, change: 94.30, changePercent: 1.22, volume: '1.8M', marketCap: '4.7T', pe: 36.8, high52w: 8192.00, low52w: 6187.80, sector: 'NBFC', open: 7750.00, prevClose: 7748.20 },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical', exchange: 'NSE', price: 1847.20, change: 24.60, changePercent: 1.35, volume: '2.6M', marketCap: '4.4T', pe: 39.7, high52w: 1960.80, low52w: 1234.60, sector: 'Pharma', open: 1825.00, prevClose: 1822.60 },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India', exchange: 'NSE', price: 12640.85, change: -145.20, changePercent: -1.14, volume: '0.9M', marketCap: '3.8T', pe: 30.5, high52w: 13680.00, low52w: 9832.55, sector: 'Auto', open: 12780.00, prevClose: 12786.05 },
  { symbol: 'ASIANPAINT', name: 'Asian Paints', exchange: 'NSE', price: 2648.35, change: -42.80, changePercent: -1.59, volume: '1.2M', marketCap: '2.5T', pe: 55.4, high52w: 3394.00, low52w: 2025.00, sector: 'Consumer', open: 2688.00, prevClose: 2691.15 },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', exchange: 'NSE', price: 1978.60, change: 28.40, changePercent: 1.46, volume: '2.3M', marketCap: '3.9T', pe: 21.2, high52w: 2130.50, low52w: 1544.25, sector: 'Banking', open: 1952.00, prevClose: 1950.20 },
  { symbol: 'LTIM', name: 'LTIMindtree', exchange: 'NSE', price: 5842.70, change: 68.90, changePercent: 1.19, volume: '0.8M', marketCap: '1.7T', pe: 33.6, high52w: 6349.00, low52w: 4297.00, sector: 'IT', open: 5780.00, prevClose: 5773.80 },
  { symbol: 'ADANIENT', name: 'Adani Enterprises', exchange: 'NSE', price: 2456.80, change: -78.40, changePercent: -3.09, volume: '3.1M', marketCap: '2.8T', pe: 84.2, high52w: 3743.90, low52w: 2025.00, sector: 'Conglomerate', open: 2530.00, prevClose: 2535.20 },
  { symbol: 'HCLTECH', name: 'HCL Technologies', exchange: 'NSE', price: 1924.35, change: 18.75, changePercent: 0.98, volume: '2.9M', marketCap: '5.2T', pe: 26.8, high52w: 1975.25, low52w: 1235.80, sector: 'IT', open: 1908.00, prevClose: 1905.60 },
  { symbol: 'TITAN', name: 'Titan Company', exchange: 'NSE', price: 3456.90, change: 42.15, changePercent: 1.23, volume: '1.4M', marketCap: '3.1T', pe: 80.4, high52w: 3886.75, low52w: 2525.00, sector: 'Consumer', open: 3415.00, prevClose: 3414.75 },
  { symbol: 'AXISBANK', name: 'Axis Bank', exchange: 'NSE', price: 1187.45, change: 15.80, changePercent: 1.35, volume: '7.2M', marketCap: '3.7T', pe: 17.8, high52w: 1339.65, low52w: 970.65, sector: 'Banking', open: 1175.00, prevClose: 1171.65 },
  { symbol: 'NTPC', name: 'NTPC', exchange: 'NSE', price: 368.45, change: 6.20, changePercent: 1.71, volume: '12.4M', marketCap: '3.5T', pe: 16.2, high52w: 448.45, low52w: 280.20, sector: 'Power', open: 363.00, prevClose: 362.25 },
  { symbol: 'NESTLEIND', name: 'Nestle India', exchange: 'NSE', price: 2248.60, change: -18.40, changePercent: -0.81, volume: '0.5M', marketCap: '2.2T', pe: 68.7, high52w: 2778.00, low52w: 2118.00, sector: 'FMCG', open: 2264.00, prevClose: 2267.00 },
  { symbol: 'ONGC', name: 'Oil & Natural Gas Corp', exchange: 'NSE', price: 282.75, change: 4.85, changePercent: 1.75, volume: '15.8M', marketCap: '3.6T', pe: 7.8, high52w: 345.00, low52w: 180.25, sector: 'Energy', open: 278.00, prevClose: 277.90 },
];

export const bseStocks: Stock[] = [
  { symbol: '500325', name: 'Reliance Industries', exchange: 'BSE', price: 2847.45, change: 42.10, changePercent: 1.50, volume: '2.1M', marketCap: '19.2T', pe: 27.4, high52w: 3024.90, low52w: 2220.50, sector: 'Energy', open: 2810.00, prevClose: 2805.35 },
  { symbol: '532540', name: 'Tata Consultancy Services', exchange: 'BSE', price: 4218.20, change: -28.55, changePercent: -0.67, volume: '0.5M', marketCap: '15.4T', pe: 31.2, high52w: 4592.25, low52w: 3601.65, sector: 'IT', open: 4240.00, prevClose: 4247.15 },
  { symbol: '500180', name: 'HDFC Bank', exchange: 'BSE', price: 1724.60, change: 18.25, changePercent: 1.07, volume: '1.8M', marketCap: '13.1T', pe: 22.8, high52w: 1880.00, low52w: 1363.45, sector: 'Banking', open: 1710.00, prevClose: 1706.35 },
  { symbol: '500209', name: 'Infosys', exchange: 'BSE', price: 1842.40, change: -15.00, changePercent: -0.81, volume: '1.1M', marketCap: '7.7T', pe: 28.6, high52w: 2006.45, low52w: 1358.35, sector: 'IT', open: 1855.00, prevClose: 1857.80 },
  { symbol: '532174', name: 'ICICI Bank', exchange: 'BSE', price: 1298.55, change: 21.90, changePercent: 1.72, volume: '2.3M', marketCap: '9.1T', pe: 19.4, high52w: 1362.30, low52w: 970.20, sector: 'Banking', open: 1280.00, prevClose: 1276.65 },
  { symbol: '532454', name: 'Bharti Airtel', exchange: 'BSE', price: 1687.25, change: 31.60, changePercent: 1.91, volume: '0.8M', marketCap: '10.1T', pe: 45.2, high52w: 1779.00, low52w: 1087.95, sector: 'Telecom', open: 1658.00, prevClose: 1655.65 },
  { symbol: '507685', name: 'Wipro', exchange: 'BSE', price: 578.10, change: -8.20, changePercent: -1.40, volume: '1.2M', marketCap: '3.0T', pe: 24.1, high52w: 640.20, low52w: 408.40, sector: 'IT', open: 584.00, prevClose: 586.70 },
  { symbol: '500034', name: 'Bajaj Finance', exchange: 'BSE', price: 7842.30, change: 94.10, changePercent: 1.21, volume: '0.4M', marketCap: '4.7T', pe: 36.8, high52w: 8192.00, low52w: 6187.80, sector: 'NBFC', open: 7750.00, prevClose: 7748.20 },
  { symbol: '524715', name: 'Sun Pharmaceutical', exchange: 'BSE', price: 1847.00, change: 24.40, changePercent: 1.34, volume: '0.6M', marketCap: '4.4T', pe: 39.7, high52w: 1960.80, low52w: 1234.60, sector: 'Pharma', open: 1825.00, prevClose: 1822.60 },
  { symbol: '532500', name: 'Maruti Suzuki India', exchange: 'BSE', price: 12640.65, change: -145.00, changePercent: -1.14, volume: '0.2M', marketCap: '3.8T', pe: 30.5, high52w: 13680.00, low52w: 9832.55, sector: 'Auto', open: 12780.00, prevClose: 12786.05 },
];

export const stockPredictions: Record<string, StockPrediction> = {
  'RELIANCE': {
    symbol: 'RELIANCE',
    signal: 'BUY',
    targetPrice: 3050.00,
    stopLoss: 2720.00,
    support1: 2780.00,
    support2: 2650.00,
    resistance1: 2920.00,
    resistance2: 3050.00,
    rsi: 58.4,
    macd: '+12.4',
    sentiment: 'Bullish',
    confidence: 76,
    news: [
      { headline: 'Reliance Jio 5G rollout accelerates, subscriber base hits 150M', sentiment: 'positive', time: '2h ago', source: 'ET Markets' },
      { headline: 'RIL Q3 net profit rises 11% YoY on retail, telecom growth', sentiment: 'positive', time: '5h ago', source: 'Moneycontrol' },
      { headline: 'Reliance new energy project faces regulatory headwinds', sentiment: 'negative', time: '1d ago', source: 'Business Standard' },
    ],
    technicals: [
      { name: 'RSI (14)', value: '58.4', signal: 'BUY' },
      { name: 'MACD', value: '+12.4', signal: 'BUY' },
      { name: 'EMA 20', value: '2798', signal: 'BUY' },
      { name: 'EMA 50', value: '2724', signal: 'BUY' },
      { name: 'Bollinger Bands', value: 'Mid Band', signal: 'NEUTRAL' },
      { name: 'Stochastic', value: '68.2', signal: 'NEUTRAL' },
    ],
  },
  'TCS': {
    symbol: 'TCS',
    signal: 'HOLD',
    targetPrice: 4450.00,
    stopLoss: 4050.00,
    support1: 4120.00,
    support2: 3980.00,
    resistance1: 4320.00,
    resistance2: 4450.00,
    rsi: 44.2,
    macd: '-8.6',
    sentiment: 'Neutral',
    confidence: 62,
    news: [
      { headline: 'TCS wins $800M deal from European banking giant', sentiment: 'positive', time: '3h ago', source: 'NDTV Profit' },
      { headline: 'IT sector headwinds persist, deal ramp-ups slower than expected', sentiment: 'negative', time: '8h ago', source: 'ET Markets' },
      { headline: 'TCS to hire 40,000 freshers in FY26, campus placement begins', sentiment: 'positive', time: '2d ago', source: 'Business Line' },
    ],
    technicals: [
      { name: 'RSI (14)', value: '44.2', signal: 'NEUTRAL' },
      { name: 'MACD', value: '-8.6', signal: 'SELL' },
      { name: 'EMA 20', value: '4265', signal: 'SELL' },
      { name: 'EMA 50', value: '4198', signal: 'BUY' },
      { name: 'Bollinger Bands', value: 'Lower Band', signal: 'BUY' },
      { name: 'Stochastic', value: '32.8', signal: 'NEUTRAL' },
    ],
  },
  'HDFCBANK': {
    symbol: 'HDFCBANK',
    signal: 'STRONG BUY',
    targetPrice: 1920.00,
    stopLoss: 1640.00,
    support1: 1680.00,
    support2: 1580.00,
    resistance1: 1820.00,
    resistance2: 1920.00,
    rsi: 62.8,
    macd: '+18.2',
    sentiment: 'Bullish',
    confidence: 84,
    news: [
      { headline: 'HDFC Bank Q3 NII grows 10%, asset quality remains pristine', sentiment: 'positive', time: '1h ago', source: 'Moneycontrol' },
      { headline: 'RBI lifts restrictions on HDFC Bank credit card issuance', sentiment: 'positive', time: '4h ago', source: 'Economic Times' },
      { headline: 'HDFC Bank expands rural banking with 500 new branches', sentiment: 'positive', time: '1d ago', source: 'Business Standard' },
    ],
    technicals: [
      { name: 'RSI (14)', value: '62.8', signal: 'BUY' },
      { name: 'MACD', value: '+18.2', signal: 'BUY' },
      { name: 'EMA 20', value: '1698', signal: 'BUY' },
      { name: 'EMA 50', value: '1645', signal: 'BUY' },
      { name: 'Bollinger Bands', value: 'Upper Band', signal: 'NEUTRAL' },
      { name: 'Stochastic', value: '74.5', signal: 'BUY' },
    ],
  },
};

export const ipoData: IPO[] = [
  // ============== OPEN IPOs ==============
  {
    company: 'CapGrid Technologies',
    symbol: 'CAPGRID',
    priceRange: '₹420 - ₹445',
    gmp: 68, gmpPercent: 15.3,
    openDate: '20 Feb 2026', closeDate: '24 Feb 2026', listingDate: '28 Feb 2026',
    subscriptionStatus: '24.8x', qib: '42.6x', nii: '28.4x', rii: '14.2x', totalSubscription: '24.8x',
    lotSize: 33, minAmount: 14685, issueSize: '₹1,240 Cr', faceValue: 10,
    sector: 'SaaS / Cloud', exchange: 'NSE & BSE',
    leadManager: 'Kotak Mahindra Capital, Axis Capital', registrar: 'KFin Technologies',
    prediction: 'APPLY', rating: 4,
    predictionReason: 'Strong GMP of 15.3%, healthy QIB subscription, profitable for last 3 years, growing SaaS revenue. Good listing pop expected.',
    status: 'OPEN',
  },
  {
    company: 'Bharat Green Energy',
    symbol: 'BGREEN',
    priceRange: '₹280 - ₹295',
    gmp: 42, gmpPercent: 14.2,
    openDate: '22 Feb 2026', closeDate: '26 Feb 2026', listingDate: '3 Mar 2026',
    subscriptionStatus: '12.4x', qib: '18.2x', nii: '14.6x', rii: '8.4x', totalSubscription: '12.4x',
    lotSize: 50, minAmount: 14750, issueSize: '₹860 Cr', faceValue: 5,
    sector: 'Renewable Energy', exchange: 'NSE & BSE',
    leadManager: 'ICICI Securities, JM Financial', registrar: 'Link Intime India',
    prediction: 'APPLY', rating: 4,
    predictionReason: 'Favorable govt policy for green energy, strong order book, decent GMP. Sector tailwinds strong. Good for long-term holding.',
    status: 'OPEN',
  },
  {
    company: 'Aero Defence Systems',
    symbol: 'AERODEF',
    priceRange: '₹512 - ₹540',
    gmp: 95, gmpPercent: 17.6,
    openDate: '21 Feb 2026', closeDate: '25 Feb 2026', listingDate: '2 Mar 2026',
    subscriptionStatus: '38.2x', qib: '64.8x', nii: '42.6x', rii: '18.4x', totalSubscription: '38.2x',
    lotSize: 27, minAmount: 14580, issueSize: '₹2,750 Cr', faceValue: 10,
    sector: 'Defence / Aerospace', exchange: 'NSE & BSE',
    leadManager: 'SBI Capital, Motilal Oswal', registrar: 'KFin Technologies',
    prediction: 'APPLY', rating: 5,
    predictionReason: 'Massive oversubscription, strong defence sector tailwinds, govt indigenisation push, healthy order book of ₹18,000 Cr. Strong listing gains likely.',
    status: 'OPEN',
  },
  {
    company: 'Urban Logistics Hub',
    symbol: 'URBLOG',
    priceRange: '₹148 - ₹158',
    gmp: 6, gmpPercent: 3.8,
    openDate: '23 Feb 2026', closeDate: '27 Feb 2026', listingDate: '5 Mar 2026',
    subscriptionStatus: '2.1x', qib: '1.8x', nii: '2.6x', rii: '2.0x', totalSubscription: '2.1x',
    lotSize: 94, minAmount: 14852, issueSize: '₹680 Cr', faceValue: 2,
    sector: 'Logistics / Warehousing', exchange: 'NSE & BSE',
    leadManager: 'HDFC Bank, IIFL Securities', registrar: 'Bigshare Services',
    prediction: 'RISKY', rating: 3,
    predictionReason: 'Low GMP, modest subscription, niche play. Margins under pressure from fuel costs. Apply only if you have long-term horizon.',
    status: 'OPEN',
  },

  // ============== UPCOMING IPOs ==============
  {
    company: 'Pharma Innovations Ltd',
    symbol: 'PHARINN',
    priceRange: '₹620 - ₹650',
    gmp: 28, gmpPercent: 4.3,
    openDate: '5 Mar 2026', closeDate: '8 Mar 2026', listingDate: '13 Mar 2026',
    subscriptionStatus: 'N/A', qib: 'N/A', nii: 'N/A', rii: 'N/A', totalSubscription: 'N/A',
    lotSize: 23, minAmount: 14950, issueSize: '₹1,850 Cr', faceValue: 10,
    sector: 'Pharmaceuticals', exchange: 'NSE & BSE',
    leadManager: 'Axis Capital, Nomura', registrar: 'Link Intime India',
    prediction: 'RISKY', rating: 3,
    predictionReason: 'Moderate GMP. Revenue growth is strong but profitability thin. Watch for more subscription data. Can apply for listing gains with caution.',
    status: 'UPCOMING',
  },
  {
    company: 'Digital Infra REIT',
    symbol: 'DIREIT',
    priceRange: '₹340 - ₹355',
    gmp: 52, gmpPercent: 14.6,
    openDate: '10 Mar 2026', closeDate: '13 Mar 2026', listingDate: '18 Mar 2026',
    subscriptionStatus: 'N/A', qib: 'N/A', nii: 'N/A', rii: 'N/A', totalSubscription: 'N/A',
    lotSize: 42, minAmount: 14910, issueSize: '₹3,200 Cr', faceValue: 10,
    sector: 'Data Centers / REIT', exchange: 'NSE & BSE',
    leadManager: 'Morgan Stanley, Citi, Kotak', registrar: 'KFin Technologies',
    prediction: 'APPLY', rating: 5,
    predictionReason: 'Strong GMP, booming data center sector in India, backed by marquee institutional investors. Good long-term bet with stable dividend yield.',
    status: 'UPCOMING',
  },
  {
    company: 'AgriTech Bharat',
    symbol: 'AGRIBH',
    priceRange: '₹196 - ₹208',
    gmp: 18, gmpPercent: 8.7,
    openDate: '12 Mar 2026', closeDate: '14 Mar 2026', listingDate: '20 Mar 2026',
    subscriptionStatus: 'N/A', qib: 'N/A', nii: 'N/A', rii: 'N/A', totalSubscription: 'N/A',
    lotSize: 72, minAmount: 14976, issueSize: '₹740 Cr', faceValue: 5,
    sector: 'AgriTech', exchange: 'NSE & BSE',
    leadManager: 'JM Financial, Equirus', registrar: 'Bigshare Services',
    prediction: 'APPLY', rating: 4,
    predictionReason: 'Govt rural focus, growing farmer SaaS adoption, profitable since FY24. Decent GMP. Good medium-term play.',
    status: 'UPCOMING',
  },
  {
    company: 'Quantum AI Labs',
    symbol: 'QAILABS',
    priceRange: '₹880 - ₹920',
    gmp: 145, gmpPercent: 15.8,
    openDate: '15 Mar 2026', closeDate: '18 Mar 2026', listingDate: '24 Mar 2026',
    subscriptionStatus: 'N/A', qib: 'N/A', nii: 'N/A', rii: 'N/A', totalSubscription: 'N/A',
    lotSize: 16, minAmount: 14720, issueSize: '₹4,800 Cr', faceValue: 1,
    sector: 'AI / Deep Tech', exchange: 'NSE & BSE',
    leadManager: 'Goldman Sachs, JP Morgan, Kotak', registrar: 'KFin Technologies',
    prediction: 'APPLY', rating: 5,
    predictionReason: 'Hot AI sector, massive grey market premium, marquee anchor investors lined up (SoftBank, Tiger Global). Listing pop expected to be strong.',
    status: 'UPCOMING',
  },

  // ============== CLOSED / LISTED IPOs ==============
  {
    company: 'QuickCommerce India',
    symbol: 'QCOMM',
    priceRange: '₹180 - ₹195',
    gmp: -8, gmpPercent: -4.1,
    openDate: '15 Feb 2026', closeDate: '18 Feb 2026', listingDate: '24 Feb 2026',
    subscriptionStatus: '3.2x', qib: '2.8x', nii: '4.1x', rii: '2.4x', totalSubscription: '3.2x',
    lotSize: 76, minAmount: 14820, issueSize: '₹2,100 Cr', faceValue: 5,
    sector: 'E-Commerce', exchange: 'NSE & BSE',
    leadManager: 'BofA Securities, Morgan Stanley', registrar: 'Link Intime India',
    listingPrice: 178, listingGainPercent: -8.7,
    prediction: 'AVOID', rating: 2,
    predictionReason: 'Negative GMP indicated weak demand. Listed at a discount as predicted. Loss-making fundamentals, intense competition.',
    status: 'CLOSED',
  },
  {
    company: 'Solaris Power Tech',
    symbol: 'SOLARIS',
    priceRange: '₹375 - ₹395',
    gmp: 88, gmpPercent: 22.3,
    openDate: '5 Feb 2026', closeDate: '8 Feb 2026', listingDate: '14 Feb 2026',
    subscriptionStatus: '54.6x', qib: '92.4x', nii: '64.8x', rii: '22.4x', totalSubscription: '54.6x',
    lotSize: 37, minAmount: 14615, issueSize: '₹1,580 Cr', faceValue: 10,
    sector: 'Solar / Renewable', exchange: 'NSE & BSE',
    leadManager: 'ICICI Securities, Axis Capital', registrar: 'KFin Technologies',
    listingPrice: 498, listingGainPercent: 26.1,
    prediction: 'APPLY', rating: 5,
    predictionReason: 'Massive subscription, high GMP. Listed at 26% premium delivering strong listing gains. Continues to trade well.',
    status: 'CLOSED',
  },
  {
    company: 'MetroFin Capital',
    symbol: 'METROFIN',
    priceRange: '₹240 - ₹252',
    gmp: 14, gmpPercent: 5.5,
    openDate: '28 Jan 2026', closeDate: '31 Jan 2026', listingDate: '6 Feb 2026',
    subscriptionStatus: '8.4x', qib: '12.2x', nii: '9.6x', rii: '5.1x', totalSubscription: '8.4x',
    lotSize: 59, minAmount: 14868, issueSize: '₹920 Cr', faceValue: 10,
    sector: 'NBFC / Fintech', exchange: 'NSE & BSE',
    leadManager: 'HDFC Bank, IIFL Securities', registrar: 'Bigshare Services',
    listingPrice: 264, listingGainPercent: 4.8,
    prediction: 'APPLY', rating: 4,
    predictionReason: 'Decent listing gains as predicted. Profitable NBFC with healthy AUM growth. Long-term hold candidate.',
    status: 'CLOSED',
  },
  {
    company: 'Heritage Hotels Ltd',
    symbol: 'HERITHL',
    priceRange: '₹530 - ₹560',
    gmp: 32, gmpPercent: 5.7,
    openDate: '20 Jan 2026', closeDate: '23 Jan 2026', listingDate: '29 Jan 2026',
    subscriptionStatus: '6.8x', qib: '8.2x', nii: '7.4x', rii: '4.6x', totalSubscription: '6.8x',
    lotSize: 26, minAmount: 14560, issueSize: '₹1,420 Cr', faceValue: 10,
    sector: 'Hospitality', exchange: 'NSE & BSE',
    leadManager: 'Kotak Mahindra Capital, JM Financial', registrar: 'Link Intime India',
    listingPrice: 582, listingGainPercent: 3.9,
    prediction: 'APPLY', rating: 3,
    predictionReason: 'Modest listing gains. Recovery in tourism sector aiding revenue. Premium hotel chain with prestigious portfolio.',
    status: 'CLOSED',
  },
];

export const marketIndices = [
  { name: 'NIFTY 50', value: '23,842.80', change: '+284.35', changePercent: '+1.21%', bullish: true },
  { name: 'SENSEX', value: '78,548.25', change: '+918.60', changePercent: '+1.18%', bullish: true },
  { name: 'NIFTY BANK', value: '51,284.60', change: '+648.90', changePercent: '+1.28%', bullish: true },
  { name: 'NIFTY IT', value: '42,618.45', change: '-218.70', changePercent: '-0.51%', bullish: false },
  { name: 'NIFTY PHARMA', value: '22,486.30', change: '+142.80', changePercent: '+0.64%', bullish: true },
  { name: 'NIFTY AUTO', value: '24,128.75', change: '-184.20', changePercent: '-0.76%', bullish: false },
  { name: 'NIFTY METAL', value: '8,926.40', change: '+186.30', changePercent: '+2.13%', bullish: true },
  { name: 'INDIA VIX', value: '13.42', change: '-0.84', changePercent: '-5.89%', bullish: false },
];
