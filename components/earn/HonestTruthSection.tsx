import React from 'react';

interface HonestTruthSectionProps {
  sectionRef?: React.RefObject<HTMLDivElement | null>;
  isInView?: boolean;
}

const HonestTruthSection: React.FC<HonestTruthSectionProps> = ({ sectionRef, isInView = true }) => {
  return (
    <section
      ref={sectionRef as any}
      className={`relative py-10 sm:py-14 md:py-16 overflow-hidden bg-[#141826] transition-opacity duration-1000 ${
        isInView ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Ambient Lighting Orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        {/* Header directly matching image.png */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Sounds too good, right?
          </h2>
          <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mt-1 sm:mt-2">
            Here&apos;s the <span className="text-[#00D26A]">honest answer.</span>
          </p>
        </div>

        {/* Vertical Flow with Connecting Serpentine Line */}
        <div className="relative">
          {/* Connecting Curved Green Line (desktop/tablet) */}
          <svg
            className="absolute top-8 bottom-8 left-1/2 -translate-x-1/2 w-28 h-full pointer-events-none hidden md:block z-0"
            viewBox="0 0 100 800"
            preserveAspectRatio="none"
          >
            <path
              d="M 50 30 C 58 160, 58 240, 50 380 C 42 500, 42 600, 50 740"
              fill="none"
              stroke="#00D26A"
              strokeWidth="3.5"
              strokeLinecap="round"
              className="drop-shadow-[0_0_10px_rgba(0,210,106,0.5)]"
            />
          </svg>

          <div className="space-y-10 sm:space-y-14 md:space-y-16 relative z-10">
            {/* Step 01 */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
              {/* Left: Card */}
              <div className="w-full md:w-[44%] text-left">
                <div className="bg-[#181d2c]/95 backdrop-blur-md border border-white/[0.08] hover:border-emerald-500/30 rounded-2xl sm:rounded-3xl p-6 sm:p-7 md:p-8 shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2.5 leading-snug">
                    Brands are constantly chasing your <span className="text-[#00D26A]">eyes and clicks</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    They spend big on advertising to reach people like you. We show them a better way: reward the people directly. That&apos;s the source of your cashback.
                  </p>
                </div>
              </div>

              {/* Center Node 01 */}
              <div className="md:w-[12%] flex items-center justify-center">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#00D26A] text-[#141826] font-black text-xs sm:text-sm flex items-center justify-center shadow-lg shadow-emerald-500/40 ring-4 ring-[#141826] select-none">
                  01
                </div>
              </div>

              {/* Right: Graphic (4 Game App Tiles Cluster matching image.png) */}
              <div className="w-full md:w-[44%] flex items-center justify-center md:justify-start md:pl-6">
                <div className="relative w-64 h-48 sm:w-72 sm:h-52">
                  {/* Tile 1: Monopoly Top-Hat Mascot */}
                  <div className="absolute top-2 left-2 w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 p-1.5 shadow-xl -rotate-12 border border-white/15 hover:rotate-0 hover:scale-110 transition-all duration-300 z-10 cursor-pointer overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1563089145-599997674d42?w=200&auto=format&fit=crop&q=80"
                      alt="Game 1"
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl flex items-end justify-center pb-1">
                      <span className="text-[10px] font-black text-white">GO!</span>
                    </div>
                  </div>

                  {/* Tile 2: Royal King Mascot (Center top) */}
                  <div className="absolute top-0 left-20 sm:left-22 w-24 h-24 sm:w-26 sm:h-26 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 p-1.5 shadow-2xl z-20 border border-white/20 hover:scale-110 transition-all duration-300 cursor-pointer overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=200&auto=format&fit=crop&q=80"
                      alt="Game 2"
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-amber-400 text-black text-[9px] font-black">
                      👑
                    </div>
                  </div>

                  {/* Tile 3: Puzzle Mascot (Right) */}
                  <div className="absolute top-3 right-2 w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 p-1.5 shadow-xl rotate-12 border border-white/15 hover:rotate-0 hover:scale-110 transition-all duration-300 z-10 cursor-pointer overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80"
                      alt="Game 3"
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl flex items-end justify-center pb-1">
                      <span className="text-[10px] font-black text-amber-300">STAR</span>
                    </div>
                  </div>

                  {/* Tile 4: Match-3 Ball (Bottom center-right) */}
                  <div className="absolute bottom-1 left-24 sm:left-28 w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-gradient-to-br from-rose-500 via-purple-600 to-indigo-700 p-1.5 shadow-2xl z-30 -rotate-3 border border-white/20 hover:rotate-0 hover:scale-110 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-white">
                    <span className="text-xl font-black italic tracking-tighter drop-shadow-md text-amber-300">
                      VS
                    </span>
                    <div className="flex gap-1 mt-0.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-sm" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" />
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 02 */}
            <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6 md:gap-0">
              {/* Left: Graphic (Center App Logo surrounded by 4 avatars matching image.png) */}
              <div className="w-full md:w-[44%] flex items-center justify-center md:justify-end md:pr-6">
                <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
                  {/* Connecting decorative ring */}
                  <div className="absolute inset-4 rounded-full border border-dashed border-emerald-500/25 animate-[spin_40s_linear_infinite]" />

                  {/* Center Green App Logo Tile */}
                  <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#00D26A] to-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-500/35 border border-emerald-300/40 z-20">
                    <svg className="w-10 h-10 text-[#141826]" viewBox="0 0 32 32" fill="currentColor">
                      <path d="M16 4C9.37 4 4 9.37 4 16s5.37 12 12 12 12-5.37 12-12S22.63 4 16 4zm1 20h-2v-2c-2.76 0-5-2.24-5-5h2.5c0 1.38 1.12 2.5 2.5 2.5h2c1.38 0 2.5-1.12 2.5-2.5s-1.12-2.5-2.5-2.5h-3C12.01 14.5 10 12.49 10 10s2.01-4.5 4.5-4.5v-2h2v2c2.48 0 4.5 2.02 4.5 4.5H18.5c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2s.9 2 2 2h3c2.76 0 5 2.24 5 5s-2.24 5-5 5v2z" />
                    </svg>
                  </div>

                  {/* Top Avatar (12 o'clock) */}
                  <img
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&h=120&q=80"
                    alt="User Top"
                    className="absolute top-1 left-1/2 -translate-x-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-emerald-500/40 shadow-lg z-10"
                  />

                  {/* Right Avatar (3 o'clock) */}
                  <img
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&h=120&q=80"
                    alt="User Right"
                    className="absolute top-1/2 right-1 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-emerald-500/40 shadow-lg z-10"
                  />

                  {/* Bottom Avatar (6 o'clock) */}
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                    alt="User Bottom"
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-emerald-500/40 shadow-lg z-10"
                  />

                  {/* Left Avatar (9 o'clock) */}
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80"
                    alt="User Left"
                    className="absolute top-1/2 left-1 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-emerald-500/40 shadow-lg z-10"
                  />
                </div>
              </div>

              {/* Center Node 02 */}
              <div className="md:w-[12%] flex items-center justify-center">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#00D26A] text-[#141826] font-black text-xs sm:text-sm flex items-center justify-center shadow-lg shadow-emerald-500/40 ring-4 ring-[#141826] select-none">
                  02
                </div>
              </div>

              {/* Right: Card */}
              <div className="w-full md:w-[44%] text-left">
                <div className="bg-[#181d2c]/95 backdrop-blur-md border border-white/[0.08] hover:border-emerald-500/30 rounded-2xl sm:rounded-3xl p-6 sm:p-7 md:p-8 shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2.5 leading-snug">
                    We connect you with brands you&apos;ll <span className="text-[#00D26A]">genuinely love</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    Games, products and brands you will actually love. Every single day. That&apos;s all we concentrate on because it only works if you really like what you get.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 03 */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
              {/* Left: Card */}
              <div className="w-full md:w-[44%] text-left">
                <div className="bg-[#181d2c]/95 backdrop-blur-md border border-white/[0.08] hover:border-emerald-500/30 rounded-2xl sm:rounded-3xl p-6 sm:p-7 md:p-8 shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2.5 leading-snug">
                    Keep doing what you&apos;d do anyway. Now there&apos;s a <span className="text-[#00D26A]">reward in it</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    Play games, use apps, complete surveys, shop at stores you already frequent – get involved and earn rewards. Not a fortune, but real money. And brands are happy: their budget comes directly to you. An approach to advertising that works better for everyone.
                  </p>
                </div>
              </div>

              {/* Center Node 03 */}
              <div className="md:w-[12%] flex items-center justify-center">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#00D26A] text-[#141826] font-black text-xs sm:text-sm flex items-center justify-center shadow-lg shadow-emerald-500/40 ring-4 ring-[#141826] select-none">
                  03
                </div>
              </div>

              {/* Right: Graphic (3 Overlapping Reward Cards: PayPal, Bitcoin, Amazon) */}
              <div className="w-full md:w-[44%] flex items-center justify-center md:justify-start md:pl-6">
                <div className="relative w-64 h-44 sm:w-72 sm:h-48 flex items-center justify-center">
                  {/* PayPal Blue Card (Left/Back) */}
                  <div className="absolute left-6 sm:left-8 w-26 sm:w-28 h-36 sm:h-40 rounded-2xl bg-gradient-to-b from-[#005fb8] to-[#003882] -rotate-15 shadow-xl border border-white/15 p-3 flex flex-col justify-between text-white hover:scale-105 transition-transform duration-300 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black tracking-wider uppercase text-blue-200">PayPal</span>
                      <span className="w-2 h-2 rounded-full bg-blue-300" />
                    </div>
                    <div className="flex items-center justify-center my-auto">
                      <i className="fab fa-paypal text-2xl text-white" />
                    </div>
                    <div className="text-[9px] text-blue-200 font-mono">•••• 8821</div>
                  </div>

                  {/* Bitcoin Gold Card (Center) */}
                  <div className="absolute left-20 sm:left-24 w-26 sm:w-28 h-36 sm:h-40 rounded-2xl bg-gradient-to-b from-[#f9a01b] to-[#d47805] -rotate-3 shadow-2xl border border-white/20 p-3 flex flex-col justify-between text-white hover:scale-105 transition-transform duration-300 z-10 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black tracking-wider uppercase text-amber-100">Crypto</span>
                      <span className="w-2 h-2 rounded-full bg-amber-200" />
                    </div>
                    <div className="flex items-center justify-center my-auto">
                      <span className="text-3xl font-black text-white">₿</span>
                    </div>
                    <div className="text-[9px] text-amber-100 font-mono">BTC Instant</div>
                  </div>

                  {/* Amazon Green Card (Right/Front) */}
                  <div className="absolute left-34 sm:left-40 w-26 sm:w-28 h-36 sm:h-40 rounded-2xl bg-gradient-to-b from-[#00D26A] to-emerald-600 rotate-15 shadow-2xl border border-white/20 p-3 flex flex-col justify-between text-black hover:scale-105 transition-transform duration-300 z-20 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black tracking-wider uppercase text-emerald-950">Gift Card</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-900" />
                    </div>
                    <div className="flex flex-col items-center justify-center my-auto">
                      <span className="text-base font-black tracking-tighter">amazon</span>
                      <div className="w-8 h-1.5 bg-black rounded-full mt-0.5" />
                    </div>
                    <div className="text-[9px] text-emerald-950 font-bold">$50.00</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default HonestTruthSection;
