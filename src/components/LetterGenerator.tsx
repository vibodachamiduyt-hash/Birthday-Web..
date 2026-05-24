import React, { useState } from "react";
import { Sparkles, Heart, Wand2, Copy, Send, HelpCircle, Check, Loader2, RefreshCw } from "lucide-react";
import { BirthdayWish } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface LetterGeneratorProps {
  onWishCreated: (wish: BirthdayWish) => void;
  savedWish: BirthdayWish | null;
}

export default function LetterGenerator({ onWishCreated, savedWish }: LetterGeneratorProps) {
  const [girlfriendName, setGirlfriendName] = useState("Chloe");
  const [senderName, setSenderName] = useState("");
  const [favoriteThings, setFavoriteThings] = useState("Cute cats, vanilla cupcakes, acoustic guitar music, and sleeping late");
  const [tone, setTone] = useState<"romantic" | "poetic" | "funny" | "sweet">("romantic");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMess, setErrorMess] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [promptOffset, setPromptOffset] = useState(1);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!girlfriendName.trim()) return;

    setIsLoading(true);
    setErrorMess(null);

    try {
      const response = await fetch("/api/generate-wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          girlfriendName: girlfriendName.trim(),
          senderName: senderName.trim(),
          favoriteThings: favoriteThings.trim(),
          tone: tone,
          promptOffset: `Offset seed: ${promptOffset}`
        }),
      });

      if (!response.ok) {
        throw new Error("Stardust synthesis failed. Please try again!");
      }

      const data = await response.json();
      onWishCreated(data);
      setPromptOffset(prev => prev + 1); // increment seed offset to get fresh outputs next time
    } catch (e: any) {
      console.error(e);
      setErrorMess(e?.message || "Something went wrong while generating card wishes.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyQuote = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const loadingMessages = [
    "Summoning matching romantic metaphors...",
    "Collecting pastel pink stardust particles...",
    "Querying the stars for the sweetest wishes...",
    "Basking in 16th birthday magical glow...",
    "Pencil writing the card with golden ink..."
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4" id="letter-generator-section">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Input Configuration Desk (left) */}
        <div className="lg:col-span-5 bg-white border-2 border-rose-100 rounded-[2rem] p-6 shadow-xs text-left flex flex-col gap-5">
          <div>
            <h4 className="font-sans font-extrabold text-rose-950 text-xl flex items-center gap-1.5">
              <Wand2 className="w-5 h-5 text-rose-500 animate-pulse" /> Sweet AI Writer
            </h4>
            <p className="text-xs text-rose-500 mt-1">
              Personalize cards dynamically under AI modeling to craft custom memories that feel completely her!
            </p>
          </div>

          <form onSubmit={handleGenerate} className="flex flex-col gap-4">
            
            {/* GF Name Input */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-rose-700">
                Girlfriend&apos;s First Name *
              </label>
              <input
                type="text"
                required
                value={girlfriendName}
                onChange={e => setGirlfriendName(e.target.value)}
                placeholder="e.g., Chloe"
                className="border-2 border-rose-100 rounded-xl px-3.5 py-2.5 text-sm focus:outline-hidden focus:border-rose-300 placeholder-gray-400 font-sans font-semibold text-rose-900 bg-rose-50/20"
              />
            </div>

            {/* Sender Name Input */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-rose-700">
                Your Name 
              </label>
              <input
                type="text"
                value={senderName}
                onChange={e => setSenderName(e.target.value)}
                placeholder="e.g., Alex"
                className="border-2 border-rose-100 rounded-xl px-3.5 py-2.5 text-sm focus:outline-hidden focus:border-rose-300 placeholder-gray-400 font-sans font-semibold text-rose-900 bg-rose-50/20"
              />
            </div>

            {/* Hobbies / Fav things Input */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-rose-700 flex items-center justify-between">
                <span>Her Favorite Things</span>
                <HelpCircle className="w-3.5 h-3.5 text-rose-300 hover:text-rose-500 transition-colors cursor-pointer" title="List her hobbies, sweets, favorite color or books to personalize predictions!" />
              </label>
              <textarea
                rows={3}
                value={favoriteThings}
                onChange={e => setFavoriteThings(e.target.value)}
                placeholder="e.g., vanilla cupcakes, fluffy white cats, lavender color"
                className="border-2 border-rose-100 rounded-xl px-3.5 py-2.5 text-sm focus:outline-hidden focus:border-rose-300 placeholder-gray-400 resize-none font-medium text-rose-900 bg-rose-50/20 leading-relaxed"
              />
            </div>

            {/* Tone Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-rose-700">
                Acoustic Tone Choice
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: "romantic", label: "Romantic ❤️" },
                  { key: "poetic", label: "Poetic 📜" },
                  { key: "funny", label: "Playful 🤪" },
                  { key: "sweet", label: "Cute & Sweet Sugar 🌸" }
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setTone(item.key as any)}
                    className={`border-2 rounded-xl py-2.5 text-xs font-semibold leading-none transition-all duration-300 cursor-pointer ${
                      tone === item.key 
                        ? "border-rose-400 text-rose-700 bg-rose-50 scale-102" 
                        : "border-rose-50 hover:bg-rose-50/40 text-rose-500"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit generate button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-3 bg-rose-500 hover:bg-rose-600 text-white font-extrabold uppercase tracking-widest text-xs py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-rose-200"
              id="generate-wishes-ai-btn"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Wishes...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  Sculpt Card Wishes ✨
                </>
              )}
            </button>
          </form>

          {/* Inline Loading Messages Spinner */}
          {isLoading && (
            <div className="bg-rose-50/40 p-3.5 rounded-2xl border-2 border-rose-100 text-center animate-pulse">
              <span className="text-xs font-semibold text-rose-700 font-sans italic leading-none flex items-center justify-center gap-1.5">
                {loadingMessages[Math.floor(Math.random() * loadingMessages.length)]}
              </span>
            </div>
          )}

          {errorMess && (
            <div className="bg-rose-50 border border-rose-100 p-3.5 rounded-2xl text-center text-xs text-rose-700 font-semibold leading-relaxed">
              {errorMess}
            </div>
          )}
        </div>

        {/* Display Card Reveal (right) */}
        <div className="lg:col-span-7" id="display-wish-card-panel">
          <AnimatePresence mode="wait">
            {savedWish ? (
              <motion.div
                key="wish-render"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-stone-50 border-r-4 border-b-4 border-stone-200 border rounded-3xl p-6 md:p-8 shadow-xl text-left relative overflow-hidden"
                style={{
                  fontFamily: "var(--font-sans)"
                }}
              >
                {/* Washi ribbon effects at card corners */}
                <div className="absolute top-[-30px] right-[-30px] w-15 h-15 bg-pink-100/40 rotate-45" />

                <div className="border-b border-dashed border-stone-200 pb-5 mb-5 flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[9px] uppercase font-mono tracking-widest font-extrabold bg-stone-200/50 px-2.5 py-1 rounded-md text-stone-600">
                      ✧ Milestones: Age 16 Letter ✧
                    </span>
                    <h5 className="font-serif italic font-extrabold text-stone-800 text-xl md:text-2xl mt-2 tracking-tight">
                      {savedWish.title}
                    </h5>
                  </div>
                  
                  {/* Regeneration button */}
                  <button 
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="p-2.5 rounded-full hover:bg-stone-100 text-stone-500 hover:text-pink-600 transition shadow-xs flex-shrink-0"
                    title="Generate alternative wishes with same configuration"
                    id="regenerate-card-btn"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-pink-500" : ""}`} />
                  </button>
                </div>

                {/* Main letter block */}
                <div 
                  className="text-stone-700 text-sm md:text-base leading-relaxed space-y-4 font-sans font-medium whitespace-pre-wrap max-h-96 overflow-y-auto pr-2 custom-scrollbar border-b border-dashed border-stone-200 pb-5 mb-5"
                  id="card-rich-letter-body"
                >
                  {savedWish.message}
                </div>

                {/* Sub-block short caption for copy */}
                <div className="bg-pink-50/25 border border-pink-100/40 p-4 rounded-2xl mb-6 relative">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[9px] uppercase font-mono tracking-widest font-extrabold text-pink-600">
                      🌸 Captions / Cute Snippet
                    </span>
                    <button
                      onClick={() => handleCopyQuote(savedWish.shortQuote)}
                      className="p-1 px-2 border border-pink-200/30 rounded-lg text-[9px] font-mono hover:bg-white text-pink-600 flex items-center gap-1 transition-all"
                      id="copy-sweet-caption-btn"
                    >
                      {copiedText ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" /> Coined!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs font-mono font-bold text-gray-700 italic pr-6 select-all">
                    &ldquo;{savedWish.shortQuote}&rdquo;
                  </p>
                </div>

                {/* Three Wishes display grid */}
                <div className="mb-6">
                  <span className="text-[10px] uppercase font-mono tracking-widest font-extrabold text-stone-500 block mb-3">
                    ✨ Her 3 Sweet Sixteen Wishes:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {savedWish.threeWishes?.map((wish, idx) => (
                      <div 
                        key={idx} 
                        className="bg-white border border-stone-100 p-3 rounded-2xl shadow-xs transition duration-300 hover:shadow-md hover:border-pink-100/60"
                      >
                        <Heart className="w-4 h-4 text-rose-400 fill-rose-100 mb-1.5" />
                        <p className="text-xs font-sans font-semibold text-gray-700 leading-normal">
                          {wish}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Predictions display slider row */}
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest font-extrabold text-stone-500 block mb-3">
                    🔮 Predictions for Year 16:
                  </span>
                  <div className="space-y-2">
                    {savedWish.predictions?.map((pred, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center gap-2.5 bg-stone-100/60 p-2.5 rounded-xl border border-stone-200/30"
                      >
                        <span className="w-5 h-5 bg-pink-100 rounded-full flex items-center justify-center font-mono text-[10px] font-bold text-pink-700">
                          {idx + 1}
                        </span>
                        <p className="text-xs font-sans font-bold text-gray-600 leading-normal flex-1 text-left">
                          {pred}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            ) : (
              /* Splash block before wishes are generated */
              <motion.div
                key="splash-render"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/70 border border-dashed border-pink-100/80 rounded-3xl p-12 text-center text-gray-400 h-full flex flex-col justify-center items-center"
              >
                <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mb-4 border border-pink-100 shadow-xs">
                  <Wand2 className="w-8 h-8 text-pink-400" />
                </div>
                <h5 className="font-sans font-extrabold text-gray-700 text-base">Write Her Magical Birthday Card</h5>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto leading-relaxed">
                  Fill out her details on the desk and click the sparkling generate button to synthesize highly-tailored aesthetic milestone letters, predictions, and captions!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
