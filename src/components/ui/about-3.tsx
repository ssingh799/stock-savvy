import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";

interface About3Props {
  title?: string;
  description?: string;
  mainImage?: {
    src: string;
    alt: string;
  };
  secondaryImage?: {
    src: string;
    alt: string;
  };
  breakout?: {
    src: string;
    alt: string;
    title?: string;
    description?: string;
    buttonText?: string;
    buttonUrl?: string;
  };
  companiesTitle?: string;
  companies?: Array<{
    src: string;
    alt: string;
  }>;
  achievementsTitle?: string;
  achievementsDescription?: string;
  achievements?: Array<{
    label: string;
    value: string;
  }>;
}

const defaultCompanies = [
  { src: "https://shadcnblocks.com/images/block/logos/company/fictional-company-logo-1.svg", alt: "NSE" },
  { src: "https://shadcnblocks.com/images/block/logos/company/fictional-company-logo-2.svg", alt: "BSE" },
  { src: "https://shadcnblocks.com/images/block/logos/company/fictional-company-logo-3.svg", alt: "SEBI" },
  { src: "https://shadcnblocks.com/images/block/logos/company/fictional-company-logo-4.svg", alt: "Bloomberg" },
  { src: "https://shadcnblocks.com/images/block/logos/company/fictional-company-logo-5.svg", alt: "Reuters" },
  { src: "https://shadcnblocks.com/images/block/logos/company/fictional-company-logo-6.svg", alt: "Moneycontrol" },
];

const defaultAchievements = [
  { label: "Active Traders", value: "50K+" },
  { label: "Predictions Accuracy", value: "87%" },
  { label: "Stocks Tracked", value: "5000+" },
  { label: "AI Models Deployed", value: "12+" },
];

export const About3 = ({
  title = "About StockSense AI",
  description = "StockSense AI is a passionate team of data scientists, financial analysts, and engineers dedicated to democratizing stock market intelligence through cutting-edge AI technology.",
  mainImage = {
    src: "",
    alt: "StockSense AI Trading Floor",
  },
  secondaryImage = {
    src: "",
    alt: "AI Analytics Dashboard",
  },
  breakout = {
    src: "",
    alt: "StockSense AI logo",
    title: "AI-Powered Market Intelligence",
    description: "Real-time predictions, deep analytics, and actionable insights for NSE & BSE markets — powered by machine learning models trained on decades of market data.",
    buttonText: "Explore Features",
    buttonUrl: "/",
  },
  companiesTitle = "Trusted by leading financial institutions",
  companies = defaultCompanies,
  achievementsTitle = "Our Impact in Numbers",
  achievementsDescription = "Empowering traders and investors with AI-driven insights to make smarter, faster, and more confident market decisions.",
  achievements = defaultAchievements,
}: About3Props = {}) => {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-16 lg:gap-24">
          {/* Title Section */}
          <div className="flex flex-col gap-4 lg:gap-6">
            <h1 className="max-w-2xl text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
              {title}
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground lg:text-lg">
              {description}
            </p>
          </div>

          {/* Images + Breakout Section */}
          <div className="grid gap-6 md:grid-cols-2">
            <img
              src={mainImage.src}
              alt={mainImage.alt}
              className="aspect-[4/3] w-full rounded-xl object-cover"
            />
            <div className="flex flex-col gap-6">
              <div className="flex flex-col justify-between gap-6 rounded-xl border border-border bg-card p-6 lg:p-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-bullish rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="font-bold text-foreground text-lg">
                    Stock<span className="text-bullish">Sense</span>
                    <span className="text-xs font-mono text-muted-foreground ml-1">AI</span>
                  </span>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground lg:text-xl">
                    {breakout.title}
                  </h3>
                  <p className="text-sm text-muted-foreground lg:text-base">
                    {breakout.description}
                  </p>
                </div>
                <div>
                  <Button asChild className="bg-bullish text-primary-foreground hover:bg-bullish/90">
                    <a href={breakout.buttonUrl}>{breakout.buttonText}</a>
                  </Button>
                </div>
              </div>
              <img
                src={secondaryImage.src}
                alt={secondaryImage.alt}
                className="aspect-video w-full grow rounded-xl object-cover"
              />
            </div>
          </div>

          {/* Companies Section */}
          <div className="flex flex-col gap-8">
            <p className="text-center text-sm font-medium text-muted-foreground lg:text-base">
              {companiesTitle}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
              {companies.map((company, idx) => (
                <div key={idx} className="flex items-center">
                  <img
                    src={company.src}
                    alt={company.alt}
                    className="h-6 w-auto lg:h-8 brightness-0 invert opacity-60 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Achievements Section */}
          <div className="grid gap-8 rounded-xl border border-border bg-card p-8 md:grid-cols-2 lg:p-12">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                {achievementsTitle}
              </h2>
              <p className="text-muted-foreground">{achievementsDescription}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-1 rounded-lg border border-border bg-background p-4"
                >
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <span className="text-2xl font-bold text-bullish lg:text-3xl font-mono">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
