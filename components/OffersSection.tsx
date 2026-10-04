import React, { useMemo, useState } from "react";
import { mockOffers } from "./mockData/mockData";
import SignUpModal from "./SignupModal";

type OfferCategory = "apps" | "games" | "surveys";

type Offer = {
  id: string | number;
  title: string;
  description: string;
  reward: number;
  rating: number;
  category: OfferCategory;
  icon: string;
};

const CATEGORIES: Array<"all" | OfferCategory> = ["all", "apps", "games", "surveys"];

// simple inline star icon (no external lib)
const StarIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 2.5l2.95 5.98 6.6.96-4.78 4.66 1.13 6.58L12 17.9l-5.9 3.1 1.13-6.58L2.45 9.44l6.6-.96L12 2.5z" />
  </svg>
);

const OffersSection: React.FC = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [filter, setFilter] = useState<"all" | OfferCategory>("all");

  const filteredOffers = useMemo(() => {
    const offers = mockOffers as Offer[];
    return filter === "all" ? offers : offers.filter((o) => o.category === filter);
  }, [filter]);

  return (
    <>
      <section className="relative py-24 px-4 text-center overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white dark:from-[#0b111e] dark:via-[#0f172a] dark:to-[#0b111e]">
        {/* soft glow background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-20 -top-24 h-96 w-96 bg-gradient-to-br from-green-400/20 via-emerald-500/15 to-transparent blur-[120px]" />
          <div className="absolute -right-20 bottom-0 h-96 w-96 bg-gradient-to-tr from-emerald-500/15 via-teal-400/15 to-transparent blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          {/* Header */}
          <div className="max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
              Offers
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mt-6 mb-4">
              Explore top earning offers
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Choose apps, games, or surveys you like. Complete simple tasks and cash out fast.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap justify-center mb-10 gap-3">
            {CATEGORIES.map((cat) => {
              const active = filter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all text-sm md:text-base ${
                    active
                      ? "bg-[#00D26A] text-white shadow-lg shadow-green-500/20"
                      : "bg-slate-200/60 text-slate-600 hover:bg-slate-300/70 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                  }`}
                  aria-pressed={active}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              );
            })}
          </div>

          {/* Offers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredOffers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white/90 dark:bg-[#131926]/80 backdrop-blur rounded-2xl p-6 border border-slate-200/70 dark:border-slate-800/70 hover:border-[#00D26A]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer group text-left"
                onClick={() => setShowSignUp(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" ? setShowSignUp(true) : null)}
                aria-label={`Open signup for ${offer.title}`}
              >
                {/* Icon */}
                <div className="mb-4 flex justify-center">
                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-slate-200 dark:border-slate-700 group-hover:border-[#00D26A] transition-colors">
                    {offer.icon && offer.icon.trim() !== '' ? (
                      <img
                        src={offer.icon}
                        alt={`${offer.title} icon`}
                        className="w-12 h-12 object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-xl font-bold text-[#00D26A]">{offer.title.charAt(0)}</span>
                    )}
                  </div>
                </div>

                {/* Title and Description */}
                <div className="text-center mb-4">
                  <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-1">
                    {offer.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">
                    {offer.description}
                  </p>
                </div>

                {/* Reward and Rating */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="text-[#00D26A] font-bold text-xl">
                    ${offer.reward.toLocaleString()}
                  </div>
                  <div className="flex items-center space-x-1">
                    <StarIcon className="w-4 h-4 text-yellow-400" />
                    <span className="text-slate-900 dark:text-white font-semibold text-sm">
                      {offer.rating}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 md:py-5 text-lg rounded-xl font-semibold transition-colors dark:bg-slate-800 dark:hover:bg-slate-700"
              onClick={() => setShowSignUp(true)}
            >
              View All {mockOffers.length}+ Offers
            </button>
          </div>
        </div>
      </section>

      <SignUpModal open={showSignUp} onClose={() => setShowSignUp(false)} />
    </>
  );
};

export default OffersSection;
