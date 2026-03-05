import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingTier {
  name: string;
  icon: React.ReactNode;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  color: string;
}

function CreativePricing({
  tag = "Simple Pricing",
  title = "Make Short Videos That Pop",
  description = "Edit, enhance, and go viral in minutes",
  tiers,
}: {
  tag?: string;
  title?: string;
  description?: string;
  tiers: PricingTier[];
}) {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        <div className="inline-flex items-center rounded-full border border-border bg-surface-1 px-4 py-1.5 text-sm text-muted-foreground">
          {tag}
        </div>

        <div className="mt-6">
          <h2 className="relative inline-block text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {title}
            <span className="absolute -right-8 -top-4 text-2xl animate-bounce">
              ✨
            </span>
            <span className="absolute -left-6 top-0 text-xl animate-pulse">
              ⭐️
            </span>
          </h2>
          <div className="mx-auto mt-1 h-1 w-24 rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-purple-500" />
        </div>

        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="relative z-10 mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-6 px-4 md:grid-cols-3">
        {tiers.map((tier, index) => (
          <div
            key={index}
            className={cn(
              "group relative rounded-3xl transition-all duration-300 hover:-translate-y-2",
              tier.popular && "md:-translate-y-2"
            )}
          >
            <div
              className={cn(
                "absolute -inset-[1px] rounded-3xl opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100",
                tier.color === "amber" && "bg-gradient-to-br from-amber-400/30 to-orange-400/30",
                tier.color === "blue" && "bg-gradient-to-br from-blue-400/30 to-cyan-400/30",
                tier.color === "purple" && "bg-gradient-to-br from-purple-400/30 to-pink-400/30"
              )}
            />

            <div
              className={cn(
                "relative flex h-full flex-col rounded-3xl border border-border bg-surface-1 p-6 md:p-8",
                tier.popular && "border-blue-500/40"
              )}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-1 text-xs font-bold text-white">
                  Popular!
                </div>
              )}

              <div className="mb-4">
                <div
                  className={cn(
                    "mb-3 inline-flex rounded-xl p-2.5",
                    tier.color === "amber" && "bg-amber-500/10 text-amber-400",
                    tier.color === "blue" && "bg-blue-500/10 text-blue-400",
                    tier.color === "purple" && "bg-purple-500/10 text-purple-400"
                  )}
                >
                  {tier.icon}
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {tier.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {tier.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">
                  ${tier.price}
                </span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <div
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                        tier.color === "amber" && "bg-amber-500/10 text-amber-400",
                        tier.color === "blue" && "bg-blue-500/10 text-blue-400",
                        tier.color === "purple" && "bg-purple-500/10 text-purple-400"
                      )}
                    >
                      <Check className="h-3 w-3" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className={cn(
                  "w-full rounded-xl font-semibold",
                  tier.popular
                    ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:from-blue-600 hover:to-cyan-500"
                    : ""
                )}
                variant={tier.popular ? "default" : "outline"}
              >
                Get Started
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Decorative elements */}
      <div className="pointer-events-none absolute bottom-10 left-10 text-6xl opacity-10 rotate-12">
        ✎
      </div>
      <div className="pointer-events-none absolute right-10 top-20 text-4xl opacity-10 -rotate-12">
        ✏️
      </div>
    </section>
  );
}

export { CreativePricing };
export type { PricingTier };
