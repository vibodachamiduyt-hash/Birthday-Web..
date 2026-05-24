import React, { useState, useEffect, useRef } from "react";
import { Send, Sparkles, Wand2, Star, Trash2 } from "lucide-react";
import { StarWish } from "../types";
import { motion, AnimatePresence } from "motion/react";

const skyBg = "/src/assets/images/dreamy_sky_bg_1779624878174.png";

export default function WishingWell() {
  const [wishes, setWishes] = useState<StarWish[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLaunching, setIsLaunching] = useState(false);
  const [hoveredWishId, setHoveredWishId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Default romantic wishes preloaded
  const defaultWishes: StarWish[] = [
    {
      id: "w1",
      wishText: "For you to always stay laughing and happy exactly like you are today",
      x: 30,
      y: 25,
      size: 4,
      color: "#fecdd3",
      speed: 1.2
    },
    {
      id: "w2",
      wishText: "For us to go on ten thousand more starry late nights",
      x: 75,
      y: 15,
      size: 5,
      color: "#fef08a",
      speed: 1.5
    },
    {
      id: "w3",
      wishText: "For your sweet sixteenth year to bring you infinite success and beautiful drawings",
      x: 20,
      y: 60,
      size: 4,
      color: "#bfdbfe",
      speed: 1.1
    }
  ];

  useEffect(() => {
    const cached = localStorage.getItem("sweet16_wishes");
    if (cached) {
      try {
        setWishes(JSON.parse(cached));
      } catch (e) {
        setWishes(defaultWishes);
      }
    } else {
      setWishes(defaultWishes);
      localStorage.setItem("sweet16_wishes", JSON.stringify(defaultWishes));
    }
  }, []);

  const saveWishes = (allWishes: StarWish[]) => {
    setWishes(allWishes);
    localStorage.setItem("sweet16_wishes", JSON.stringify(allWishes));
  };

  const handleSendWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLaunching) return;

    setIsLaunching(true);

    // Dynamic placement calculation in the sky container
    const randomX = Math.floor(Math.random() * 80) + 10; // 10% to 90%
    const randomY = Math.floor(Math.random() * 50) + 10; // 10% to 60%
    const randomSize = Math.floor(Math.random() * 3) + 4; // 4px to 6px
    const colors = ["#fecdd3", "#fef08a", "#bfdbfe", "#e9d5ff", "#fed7aa"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newWish: StarWish = {
      id: Date.now().toString(),
      wishText: inputText.trim(),
      x: randomX,
      y: randomY,
      size: randomSize,
      color: randomColor,
      speed: parseFloat((Math.random() * 0.8 + 0.8).toFixed(2))
    };

    // Delay addition to represent standard shooting star flying time
    setTimeout(() => {
      saveWishes([...wishes, newWish]);
      setInputText("");
      setIsLaunching(false);
    }, 1200);
  };

  const clearWish = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = wishes.filter(w => w.id !== id);
    saveWishes(updated);
    setHoveredWishId(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4" id="wishing-well-section">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-sans font-extrabold text-gray-800 flex items-center justify-center gap-2">
          🌟 Sweet Sixteen Wishing Well
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Type a secret sixteenth birthday wish, launch it as a shooting star, and lock it in your twinkling sky!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Sky View Visualization Canvas Card */}
        <div 
          ref={containerRef}
          className="lg:col-span-2 rounded-3xl h-96 relative border border-pink-100 overflow-hidden shadow-2xl bg-slate-950 flex flex-col justify-between"
          style={{
            backgroundImage: `url(${skyBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
          id="wishing-well-sky-card"
        >
          {/* Subtle backing gradients if image doesn't load */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-slate-900/60 to-black/80 pointer-events-none" />

          {/* Shooting Star Animated Overlay */}
          <AnimatePresence>
            {isLaunching && (
              <motion.div
                initial={{ x: "-10%", y: "15%", opacity: 0.8, scale: 0.5 }}
                animate={{ x: "110%", y: "55%", opacity: [0.8, 1, 0], scale: [0.5, 1, 0.2] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_15px_#fff,0_0_30px_#fbcfe8] z-30 pointer-events-none"
              >
                {/* Shooting tail */}
                <div className="w-24 h-0.5 bg-gradient-to-r from-transparent to-white absolute right-1 top-1/2 -translate-y-1/2 -rotate-30 origin-right rounded-full" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-4 z-10 flex items-center justify-between pointer-events-none">
            <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-pink-200/50 bg-white/5 px-2.5 py-1 rounded-md backdrop-blur-xs">
              ✦ Age 16 Constellation Registry
            </span>
            <span className="text-[10px] font-mono text-yellow-200/40">
              Hover stars to read wishes
            </span>
          </div>

          {/* Constellation stars display container */}
          <div className="absolute inset-0 z-20 overflow-hidden">
            {wishes.map((w) => {
              const isHovered = hoveredWishId === w.id;
              
              return (
                <div
                  key={w.id}
                  style={{
                    left: `${w.x}%`,
                    top: `${w.y}%`,
                  }}
                  className="absolute cursor-pointer group flex items-center justify-center"
                  onMouseEnter={() => setHoveredWishId(w.id)}
                  onMouseLeave={() => setHoveredWishId(null)}
                  onClick={() => setHoveredWishId(isHovered ? null : w.id)}
                >
                  {/* Glowing star element */}
                  <div 
                    className="rounded-full shadow-lg relative transition-all duration-300 group-hover:scale-130"
                    style={{
                      width: `${w.size}px`,
                      height: `${w.size}px`,
                      backgroundColor: w.color,
                      boxShadow: `0 0 ${w.size * 3}px ${w.color}, 0 0 ${w.size * 6}px ${w.color}`
                    }}
                  />
                  
                  {/* Pulsating surrounding halo */}
                  <div 
                    className="absolute w-6 h-6 rounded-full border border-white/20 scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 animate-ping"
                    style={{ borderColor: `${w.color}33` }}
                  />

                  {/* Tiny floating tail line connecting nodes if clicked/hovered */}
                  {isHovered && (
                    <div className="absolute top-[-4px] left-[-4px] w-8 h-8 rounded-full border border-dashed border-white/40 animate-spin" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Foreground wish bubble viewer overlay */}
          <div className="p-4 z-20 w-full min-h-24 bg-gradient-to-t from-slate-950/90 to-slate-950/10 backdrop-blur-xs flex items-center justify-center">
            <AnimatePresence mode="wait">
              {hoveredWishId ? (
                <motion.div
                  key={hoveredWishId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center px-6 max-w-md"
                >
                  <p className="text-yellow-200 text-xs font-mono font-bold flex justify-center gap-1.5 items-center mb-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-200" />
                    Star Wish Sealed
                  </p>
                  <p className="text-sm font-sans font-semibold text-white tracking-wide italic leading-normal">
                    &ldquo;{wishes.find(w => w.id === hoveredWishId)?.wishText}&rdquo;
                  </p>
                  
                  <button
                    onClick={(e) => clearWish(hoveredWishId, e)}
                    className="text-[10px] text-rose-400 hover:text-rose-300 transition-colors uppercase font-mono tracking-widest mt-2 px-2 py-0.5 rounded-md hover:bg-white/5 font-extrabold items-center gap-1 inline-flex"
                    id={`delete-wish-${hoveredWishId}`}
                  >
                    <Trash2 className="w-3 h-3" /> Remove Wish
                  </button>
                </motion.div>
              ) : (
                <p className="text-center text-xs font-mono font-semibold text-pink-200/40 select-none">
                  [ Hover or click an orbital constellation node to decipher a secret desire ]
                </p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Input Controls Card */}
        <div className="bg-white/95 border border-pink-100/60 p-6 rounded-3xl shadow-xl flex flex-col justify-between">
          <div className="text-left">
            <h4 className="font-extrabold text-gray-800 text-lg flex items-center gap-1.5">
              <Wand2 className="w-5 h-5 text-pink-500" /> Let&apos;s Launch a Desire
            </h4>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Desires are translated into physical coordinates, emitted as shooting stardust, and preserved on standard client-side secure systems forever.
            </p>

            <form onSubmit={handleSendWish} className="mt-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-extrabold text-gray-600 uppercase tracking-wider font-mono">
                  Your Wish at Age 16
                </label>
                <textarea
                  required
                  rows={4}
                  maxLength={180}
                  placeholder="e.g., I wish that we travel around Italy together next year, laughing like crazy and stuffing pizza slices..."
                  value={inputText}
                  disabled={isLaunching}
                  onChange={(e) => setInputText(e.target.value)}
                  className="border border-pink-100/80 rounded-2xl px-3.5 py-3 text-sm focus:outline-hidden focus:ring-1 focus:ring-pink-400 resize-none placeholder-gray-400"
                />
                <span className="text-[10px] font-mono text-gray-400 text-right">
                  {180 - inputText.length} letters left
                </span>
              </div>

              <button
                type="submit"
                disabled={!inputText.trim() || isLaunching}
                className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-400 text-white py-3.5 rounded-2xl text-xs font-extrabold tracking-widest uppercase shadow-md transition-all ${
                  isLaunching || !inputText.trim() 
                    ? "opacity-50 cursor-not-allowed" 
                    : "hover:from-pink-600 hover:to-rose-500 hover:shadow-lg"
                }`}
                id="submit-wish-btn"
              >
                {isLaunching ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Flying... 💫
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Wish to the Stars ✨
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 border-t border-gray-50 pt-4 text-left">
            <span className="text-[10px] uppercase font-mono tracking-widest font-extrabold text-pink-400">
              🌌 Constellation Density
            </span>
            <p className="text-xs font-bold text-gray-700 mt-1">
              {wishes.length} star wishes floating in outer orbit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
