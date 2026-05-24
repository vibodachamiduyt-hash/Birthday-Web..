import { useState, useEffect } from "react";
import { 
  Heart, Sparkles, Gift, Camera, Trophy, Wand2, Star, 
  Cake as CakeIcon, RefreshCw, ChevronRight, Check, AlertCircle, Smile
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import BirthdayCake from "./components/BirthdayCake";
import Scrapbook from "./components/Scrapbook";
import LoveQuiz from "./components/LoveQuiz";
import WishingWell from "./components/WishingWell";
import LetterGenerator from "./components/LetterGenerator";
import MusicBox from "./components/MusicBox";
import { BirthdayWish } from "./types";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  speed: number;
}

export default function App() {
  const [girlfriendName, setGirlfriendName] = useState("Jessica");
  const [senderName, setSenderName] = useState("Alex");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<"letter" | "scrapbook" | "quiz" | "well">("letter");
  const [savedWish, setSavedWish] = useState<BirthdayWish | null>(null);
  
  // Confetti particles state
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  // Local storage caching for personalized names
  useEffect(() => {
    const cachedGf = localStorage.getItem("sweet16_gf_name");
    const cachedSender = localStorage.getItem("sweet16_sender_name");
    const cachedUnlocked = localStorage.getItem("sweet16_unlocked");
    const cachedWish = localStorage.getItem("sweet16_generated_wish");

    if (cachedGf) setGirlfriendName(cachedGf);
    if (cachedSender) setSenderName(cachedSender);
    if (cachedUnlocked === "true") setIsUnlocked(true);
    if (cachedWish) {
      try {
        setSavedWish(JSON.parse(cachedWish));
      } catch (e) {}
    }
  }, []);

  const handleSaveNames = (gf: string, sender: string) => {
    setGirlfriendName(gf);
    setSenderName(sender);
    localStorage.setItem("sweet16_gf_name", gf);
    localStorage.setItem("sweet16_sender_name", sender);
  };

  const handleWishCreated = (wish: BirthdayWish) => {
    setSavedWish(wish);
    localStorage.setItem("sweet16_generated_wish", JSON.stringify(wish));
  };

  // Run a lightweight beautiful custom confetti particle emitter simulation directly 
  const triggerConfettiExplosion = () => {
    const colors = ["#f43f5e", "#ec4899", "#d946ef", "#8b5cf6", "#a855f7", "#3b82f6", "#10b981", "#f59e0b"];
    const pieces: ConfettiPiece[] = [];
    
    // Create 120 confetti pieces radiating outwards
    for (let i = 0; i < 120; i++) {
      pieces.push({
        id: Math.random(),
        x: 50, // center index percentage
        y: 60,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.floor(Math.random() * 8) + 6,
        angle: Math.random() * 360,
        speed: Math.random() * 6 + 4
      });
    }
    
    setConfetti(pieces);

    // Animating cycle ticks
    let ticks = 0;
    const interval = setInterval(() => {
      setConfetti(prev => 
        prev
          .map(p => {
            const radAngle = (p.angle * Math.PI) / 180;
            // Gravity + speed calculations
            return {
              ...p,
              x: p.x + Math.cos(radAngle) * p.speed * 0.35,
              y: p.y + Math.sin(radAngle) * p.speed * 0.35 + 0.9, // fall downwards slightly
              speed: p.speed * 0.97 // friction friction
            };
          })
          .filter(p => p.y < 110 && p.x > -10 && p.x < 110) // clear offscreen particles
      );
      
      ticks++;
      if (ticks > 90) {
        clearInterval(interval);
        setConfetti([]);
      }
    }, 25);
  };

  const handleAllCandlesBlownOut = () => {
    setIsUnlocked(true);
    localStorage.setItem("sweet16_unlocked", "true");
    triggerConfettiExplosion();
  };

  const handleResetApp = () => {
    if (confirm("Are you sure you want to lock the app again to restart the experience? This is perfect for testing!")) {
      setIsUnlocked(false);
      localStorage.setItem("sweet16_unlocked", "false");
    }
  };

  const birthdayTips = [
    "Age 16 is a sparkling milestone where dreams start spreading wings.",
    "Blowing out 16 candles represents 16 gorgeous years of warmth and starlight.",
    "A custom love message is just a click away inside your AI generation desk!"
  ];

  return (
    <div 
      className="min-h-screen animate-bg-warm flex flex-col justify-between py-6 px-4 md:px-8 relative overflow-hidden font-sans"
      id="main-app-shell"
    >
      {/* Decorative Floating Bokeh Hearts/Stardust around border edges */}
      <div className="absolute top-12 left-[12%] w-24 h-24 bg-pink-100 rounded-full blur-3xl opacity-60 pointer-events-none animate-stardust" />
      <div className="absolute bottom-[15%] right-[10%] w-32 h-32 bg-rose-100 rounded-full blur-3xl opacity-60 pointer-events-none animate-stardust" style={{ animationDelay: "4s" }} />

      {/* Secondary Custom Particles */}
      {confetti.map(p => (
        <div 
          key={p.id}
          className="absolute rounded-full pointer-events-none z-50 transition-all duration-75"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 2px 8px ${p.color}44`,
            transform: `rotate(${p.angle}deg)`
          }}
        />
      ))}

      {/* Primary Navigation / Beautiful Bento Top-Bar */}
      <header className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 z-40 pb-5 mb-6 border-b border-rose-100/80">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-rose-200">
            <Heart className="h-6 w-6 fill-current animate-pulse" />
          </div>
          <div className="text-left">
            <h1 className="text-xl md:text-2xl font-display font-black text-rose-900 tracking-tight leading-none">
              For My Favorite Person
            </h1>
            <p className="text-xs text-rose-500 font-bold font-mono uppercase tracking-wider mt-1">
              ✦ Sweet 16 Celebration Desk ✦
            </p>
          </div>
        </div>

        {/* Music Box widget floated and layout action controls */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <MusicBox />
          
          <div className="bg-white px-4 py-2 rounded-full border-2 border-rose-100 text-rose-500 font-semibold text-xs shadow-xs flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
            Celebrating Now
          </div>

          {isUnlocked && (
            <button
              onClick={handleResetApp}
              className="px-4.5 py-2 bg-white border-2 border-rose-100 text-rose-600 hover:bg-rose-50 hover:border-rose-200 rounded-full text-xs font-mono font-extrabold uppercase tracking-widest flex items-center gap-1.5 transition shadow-xs cursor-pointer"
              id="lock-app-toggle"
              title="Lock app to re-play blowing out the candles"
            >
              <RefreshCw className="w-3 h-3" /> Re-lock
            </button>
          )}
        </div>
      </header>

      {/* Interactive Controller Arena */}
      <main className="flex-grow w-full max-w-6xl mx-auto flex flex-col items-center justify-center z-30 py-4">
        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            
            /* STAGE 1: Beautiful Bento Locked Grid containing Cake game */
            <motion.div
              key="stage-one"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96, y: -25 }}
              transition={{ duration: 0.5 }}
              className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
            >
              {/* Bento Card 1: Welcoming Sweet 16 Hero (col-span-8) */}
              <div 
                className="lg:col-span-8 bg-white rounded-[2rem] border-2 border-rose-100 p-8 md:p-10 flex flex-col justify-center relative overflow-hidden shadow-xs text-left"
              >
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-100 rounded-full opacity-50 pointer-events-none"></div>
                <div className="absolute top-20 left-10 w-4 h-4 bg-rose-400 rounded-full"></div>
                
                <span className="text-rose-500 font-extrabold text-xs uppercase tracking-widest mb-3 flex items-center gap-1.5 font-mono">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
                  Happy sweet 16 milestone
                </span>
                
                <h2 className="text-5xl md:text-7xl font-display font-black text-rose-600 leading-none tracking-tight">
                  Happy <br/>Sweet 16,
                </h2>
                <h3 className="text-5xl md:text-7xl font-display font-black text-rose-900 mt-1 mb-4">{girlfriendName}!</h3>
                <p className="text-rose-800 font-medium text-base md:text-lg max-w-md leading-relaxed">
                  Dearest {girlfriendName}, reaching sweet sixteen is a magical boundary of key starlight. It is a year for your dreams to bloom and your happiest smiles to rise. 
                </p>

                {/* Sandbox customizers in page body */}
                <div className="mt-8 border-t border-dashed border-rose-100 pt-5 flex flex-wrap items-center gap-3">
                  <span className="text-[10px] font-mono font-extrabold text-rose-400 uppercase tracking-widest">
                    ✏️ Name customizers:
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={girlfriendName}
                      onChange={e => handleSaveNames(e.target.value, senderName)}
                      placeholder="GF's name"
                      className="bg-rose-50/50 border-2 border-rose-100 rounded-xl px-3 py-1.5 text-xs font-bold text-rose-900 focus:outline-hidden focus:border-rose-400 w-28"
                    />
                    <input
                      type="text"
                      value={senderName}
                      onChange={e => handleSaveNames(girlfriendName, e.target.value)}
                      placeholder="Your name"
                      className="bg-rose-50/50 border-2 border-rose-100 rounded-xl px-3 py-1.5 text-xs font-bold text-rose-900 focus:outline-hidden focus:border-rose-400 w-28"
                    />
                  </div>
                </div>
              </div>

              {/* Bento Card 2: Age Level Badge (col-span-4) */}
              <div className="lg:col-span-4 bg-rose-500 rounded-[2rem] p-8 flex flex-col items-center justify-center text-white text-center shadow-lg shadow-rose-200">
                <span className="text-sm uppercase tracking-widest font-black opacity-80 mb-2">Level Unlocked</span>
                <span className="text-8xl font-black italic select-none">16</span>
                <span className="text-lg font-bold mt-2">Years of Perfection</span>
              </div>

              {/* Bento Card 3: Interactive Birthday Cake gameplay (col-span-8) */}
              <div className="lg:col-span-8 bg-white rounded-[2rem] border-2 border-rose-100 p-6 md:p-8 shadow-xs flex flex-col justify-center items-center">
                <div className="text-center mb-4">
                  <h4 className="text-rose-900 font-extrabold text-lg">Virtual Birthday Cake</h4>
                  <p className="text-rose-400 text-xs">Blow / activate microphone or click candles to extinguish all 16!</p>
                </div>
                <BirthdayCake 
                  girlfriendName={girlfriendName} 
                  onAllCandlesBlownOut={handleAllCandlesBlownOut} 
                />
              </div>

              {/* Bento Card 4: Stats milestone card (col-span-4) */}
              <div className="lg:col-span-4 flex flex-col gap-6 justify-between">
                <div className="bg-white rounded-[2rem] border-2 border-rose-100 p-8 shadow-xs text-left grow">
                  <h4 className="text-rose-900 font-black text-xl mb-4">The Stats</h4>
                  <ul className="space-y-4">
                    <li className="flex flex-col border-b border-rose-50 pb-2">
                      <span className="text-rose-400 text-xs font-extrabold uppercase">Days on Earth</span>
                      <span className="text-rose-900 font-extrabold text-2xl leading-none mt-1 font-mono">5,844</span>
                    </li>
                    <li className="flex flex-col border-b border-rose-50 pb-2">
                      <span className="text-rose-400 text-xs font-extrabold uppercase">Favorite Snacks eaten</span>
                      <span className="text-rose-900 font-extrabold text-2xl leading-none mt-1 font-mono">∞</span>
                    </li>
                    <li className="flex flex-col">
                      <span className="text-rose-400 text-xs font-extrabold uppercase">Hearts Stolen</span>
                      <span className="text-rose-900 font-extrabold text-base leading-snug mt-1">
                        Just {senderName || "Alex"}&apos;s (mostly)
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-rose-50 rounded-[2rem] border-2 border-dashed border-rose-300 p-6 flex flex-col items-center justify-center text-center shadow-inner">
                  <div className="text-4xl mb-2">🎁</div>
                  <p className="text-rose-900 font-extrabold text-sm">Special Surprise Waiting</p>
                  <p className="text-rose-500 text-xs mt-1">Blow out all 16 candles to unlock</p>
                </div>
              </div>
            </motion.div>

          ) : (

            /* STAGE 2: Unlocked Bento Gift chest */
            <motion.div
              key="stage-two"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full flex flex-col gap-6"
            >
              {/* Elegant Bento Header card */}
              <div className="bg-white rounded-[2rem] border-2 border-rose-100 p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-xs relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-50 rounded-full opacity-60"></div>
                <div>
                  <div className="inline-flex items-center gap-2 bg-emerald-50 px-3.5 py-1.5 rounded-full text-emerald-700 font-extrabold text-xs uppercase shadow-xs border border-emerald-100 mb-3 animate-bounce">
                    🎉 Candles blown! Gift chest Unlocked!
                  </div>
                  <h2 className="text-3xl md:text-4xl font-display font-black text-rose-900 tracking-tight leading-none">
                    Sweet Sixteen Gift Chest
                  </h2>
                  <p className="text-sm text-rose-500 font-medium mt-2">
                    Dearest {girlfriendName}, browse your personalized premium interactive presents or blow a kiss!
                  </p>
                </div>
                {/* Level indicator */}
                <div className="bg-rose-500 text-white rounded-[1.5rem] px-6 py-4 flex flex-col justify-center items-center shadow-md shadow-rose-200">
                  <span className="text-[10px] uppercase font-bold opacity-80 tracking-widest">Milestone</span>
                  <span className="text-4xl font-extrabold italic select-none">#16</span>
                </div>
              </div>

              {/* Grid content space */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
                
                {/* Left Side: Unlocked Presents Side tabs bar (col-span-4) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  
                  {/* Selectors panel designed as Unveiled gifts list */}
                  <div className="bg-white rounded-[2rem] border-2 border-rose-100 p-6 shadow-xs text-left">
                    <h3 className="text-rose-900 font-black text-xl mb-4 flex items-center gap-2">
                      <Gift className="w-5 h-5 text-rose-500 animate-bounce" />
                      Pick Your Present
                    </h3>
                    
                    <div className="flex flex-col gap-3" id="bento-navigation-tabs">
                      {[
                        { id: "letter", label: "AI Birthday Card 💌", desc: "Compose custom personalized letters", color: "from-rose-500 to-pink-500" },
                        { id: "scrapbook", label: "Memory Scrapbook 📸", desc: "Browse beautiful timeline memories", color: "from-pink-500 to-purple-500" },
                        { id: "quiz", label: "Chemistry Quiz 🏆", desc: "Test romantic relationship score", color: "from-purple-500 to-indigo-500" },
                        { id: "well", label: "Wishing Well 🌌", desc: "Cast wishes into the deep starry sky", color: "from-indigo-500 to-blue-500" }
                      ].map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`p-4 rounded-2xl border-2 text-left transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                              isActive
                                ? "border-rose-400 bg-rose-50/60 shadow-xs"
                                : "border-rose-100/50 bg-white hover:border-rose-200 hover:bg-rose-50/20"
                            }`}
                          >
                            {/* Inner ambient glow on active */}
                            {isActive && (
                              <div className="absolute right-3 top-3 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                            )}
                            <div className="font-sans font-black text-sm text-rose-950 group-hover:text-rose-600 transition">
                              {tab.label}
                            </div>
                            <div className="text-rose-400 font-medium text-xs mt-0.5">
                              {tab.desc}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Lovable signature card mirroring the James note card of Bento */}
                  <div className="bg-white rounded-[2rem] border-2 border-rose-100 p-6 shadow-xs text-left flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute -bottom-6 -right-6 text-rose-50 opacity-10">
                      <Heart className="w-24 h-24 fill-current" />
                    </div>
                    <p className="text-rose-800 leading-relaxed italic text-sm relative z-10">
                      &ldquo;To the girl who can light up a whole room just by walking in &mdash; Happy Birthday. I am so lucky to be standing by your side. Let&apos;s make sixteen unforgettable!&rdquo;
                    </p>
                    <div className="mt-4 flex items-center space-x-2 pt-4 border-t border-rose-100/60 relative z-10">
                      <div className="w-8 h-8 rounded-full bg-rose-200 flex items-center justify-center text-xs font-bold text-rose-700 font-mono">
                        {senderName ? senderName.substring(0, 2).toUpperCase() : "AL"}
                      </div>
                      <span className="text-rose-950 font-extrabold text-xs">Yours always, {senderName || "Alex"}</span>
                    </div>
                  </div>

                </div>

                {/* Right Side: Fully styled rendered present board bento panel (col-span-8) */}
                <div className="lg:col-span-8 bg-white rounded-[2rem] border-2 border-rose-100 p-6 md:p-8 shadow-xs text-left min-h-[500px]">
                  <AnimatePresence mode="wait">
                    {activeTab === "letter" && (
                      <motion.div 
                        key="letter-rendered" 
                        initial={{ opacity: 0, y: 15 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: -15 }}
                        className="w-full"
                      >
                        <LetterGenerator onWishCreated={handleWishCreated} savedWish={savedWish} />
                      </motion.div>
                    )}

                    {activeTab === "scrapbook" && (
                      <motion.div 
                        key="scrapbook-rendered" 
                        initial={{ opacity: 0, y: 15 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: -15 }}
                        className="w-full"
                      >
                        <Scrapbook />
                      </motion.div>
                    )}

                    {activeTab === "quiz" && (
                      <motion.div 
                        key="quiz-rendered" 
                        initial={{ opacity: 0, y: 15 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: -15 }}
                        className="w-full"
                      >
                        <LoveQuiz />
                      </motion.div>
                    )}

                    {activeTab === "well" && (
                      <motion.div 
                        key="well-rendered" 
                        initial={{ opacity: 0, y: 15 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: -15 }}
                        className="w-full"
                      >
                        <WishingWell />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            </motion.div>

          )}
        </AnimatePresence>
      </main>

      {/* Footer / Info tickers */}
      <footer className="w-full max-w-6xl mx-auto border-t border-pink-100/40 pt-5 mt-10 text-center z-40">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-mono font-medium text-gray-400">
            SWEET 16TH BIRTHDAY CELEBRATION © 2026. CREATED WITH ENDLESS LOVE & HIGH QUALITY AI MODELING.
          </p>

          {/* Random sweet tip text slider ticker */}
          <div className="bg-pink-50 border border-pink-100/50 px-3 py-1 rounded-lg">
            <span className="text-[10px] font-semibold font-sans text-pink-700 animate-pulse italic leading-none">
              “ {birthdayTips[Math.floor(Math.random() * birthdayTips.length)]} ”
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
