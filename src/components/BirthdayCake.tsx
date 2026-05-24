import { useState, useEffect, useRef } from "react";
import { Sparkles, Flame, Volume2, Mic, MicOff, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface BirthdayCakeProps {
  girlfriendName: string;
  onAllCandlesBlownOut: () => void;
}

export default function BirthdayCake({ girlfriendName, onAllCandlesBlownOut }: BirthdayCakeProps) {
  const [candles, setCandles] = useState<boolean[]>(new Array(16).fill(true));
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [micVolume, setMicVolume] = useState(0);
  const [isBlownOut, setIsBlownOut] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Trigger synth celebratory sweep when all candles are blown out
  const playWinChord = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = audioCtx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25]; // C major chord notes
      
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.15, now + idx * 0.1 + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 1.2);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(now + 2.0);
      });
    } catch (e) {
      console.warn("Win chord play failed", e);
    }
  };

  // Sound feedback for single candle extinguishing
  const playExtinguishSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(500, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.15);
      
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch (e) {
      // Ignored
    }
  };

  const extinguishCandle = (index: number) => {
    if (!candles[index]) return;
    
    setCandles(prev => {
      const updated = [...prev];
      updated[index] = false;
      playExtinguishSound();
      return updated;
    });
  };

  // Re-light all candles
  const resetCandles = () => {
    setCandles(new Array(16).fill(true));
    setIsBlownOut(false);
  };

  // Check if all candles are blown out
  useEffect(() => {
    const activeCount = candles.filter(c => c).length;
    if (activeCount === 0 && !isBlownOut) {
      setIsBlownOut(true);
      playWinChord();
      // Delay callback to let user see candles extinguish and celebrate
      setTimeout(() => {
        onAllCandlesBlownOut();
      }, 1000);
    }
  }, [candles, isBlownOut, onAllCandlesBlownOut]);

  // Clean up mic on unmount
  useEffect(() => {
    return () => {
      stopMicrophone();
    };
  }, []);

  const startMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      sourceRef.current = source;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      dataArrayRef.current = dataArray;

      setIsMicEnabled(true);
      monitorMicVolume();
    } catch (err) {
      console.warn("Microphone access denied or error", err);
      setIsMicEnabled(false);
    }
  };

  const stopMicrophone = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setIsMicEnabled(false);
    setMicVolume(0);
  };

  const monitorMicVolume = () => {
    if (!analyserRef.current || !dataArrayRef.current) return;

    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    
    // Compute simple average amplitude
    const arrayData = dataArrayRef.current;
    let total = 0;
    for (let i = 0; i < arrayData.length; i++) {
      total += arrayData[i];
    }
    const average = total / arrayData.length;
    
    // Normalize volume between 0 and 100
    const normalizedVol = Math.round((average / 128) * 100);
    setMicVolume(normalizedVol);

    // If volume is high enough (blowing sound), progressively extinguish lit candles
    if (normalizedVol > 45) {
      // Find a lit candle and extinguish it
      setCandles(prev => {
        const litIndices = prev.map((isLit, idx) => (isLit ? idx : -1)).filter(idx => idx !== -1);
        if (litIndices.length > 0) {
          // Select random lit index to extinguish
          const randomIndex = litIndices[Math.floor(Math.random() * litIndices.length)];
          const updated = [...prev];
          updated[randomIndex] = false;
          playExtinguishSound();
          return updated;
        }
        return prev;
      });
    }

    animationFrameRef.current = requestAnimationFrame(monitorMicVolume);
  };

  const handleMicToggle = () => {
    if (isMicEnabled) {
      stopMicrophone();
    } else {
      startMicrophone();
    }
  };

  // Blow out candles instantly (Cheat button for convenience)
  const blowAllInstantly = () => {
    setCandles(new Array(16).fill(false));
  };

  const litCount = candles.filter(c => c).length;

  return (
    <div 
      className="bg-white/90 shadow-2xl rounded-3xl p-6 md:p-8 border border-pink-100/50 max-w-2xl w-full flex flex-col items-center gap-6 relative overflow-hidden"
      id="birthday-cake-container"
    >
      {/* Sparkles / Twinkles in background */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-radial-[radial-gradient(circle_at_center,var(--color-pink-100)_0%,transparent_70%)]" />

      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-pink-50 px-3 py-1.5 rounded-full text-pink-600 font-medium text-xs md:text-sm mb-2 shadow-xs border border-pink-100">
          <Sparkles className="w-4 h-4 text-pink-500 animate-pulse" />
          Make 16 Birthday Wishes For {girlfriendName || "Her"}!
        </div>
        <h3 className="text-xl md:text-2xl font-sans font-bold text-gray-800">
          Blow Out 16 Glowing Candles!
        </h3>
        <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
          Hover/tap individual flames to blow them out, or turn on your microphone and <span className="text-pink-600 font-semibold font-sans">blow physically</span>!
        </p>
      </div>

      {/* Mic controller block */}
      <div className="flex items-center gap-4 bg-pink-50/50 px-4 py-2.5 rounded-2xl border border-pink-100/60 w-full max-w-sm justify-between transition-all duration-300">
        <button
          onClick={handleMicToggle}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300 ${isMicEnabled ? "bg-pink-500 hover:bg-pink-600 text-white shadow-md animate-pulse" : "bg-pink-100 text-pink-700 hover:bg-pink-200"}`}
          title={isMicEnabled ? "Disable microphone blowing" : "Configure mic for physical blowing detection"}
          id="toggle-mic-blowing"
        >
          {isMicEnabled ? (
            <>
              <Mic className="w-4 h-4" />
              Blowing: ON
            </>
          ) : (
            <>
              <MicOff className="w-4 h-4" />
              Mic blowing: OFF
            </>
          )}
        </button>

        {isMicEnabled ? (
          <div className="flex items-center gap-2 flex-1 ml-4">
            <div className="h-2 bg-pink-200 rounded-full flex-1 overflow-hidden relative border border-pink-200">
              <div 
                className="h-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all duration-100"
                style={{ width: `${Math.min(micVolume, 100)}%` }}
              />
            </div>
            <span className="text-[10px] font-mono font-medium text-pink-600 min-w-8 text-right">
              {micVolume}%
            </span>
          </div>
        ) : (
          <span className="text-[11px] text-gray-500 italic max-w-xs leading-tight ml-3">
            Click/tap fallback always works!
          </span>
        )}
      </div>

      {/* The Birthday Cake Visual Section */}
      <div className="relative flex flex-col items-center justify-end w-full h-80 mt-4" id="cake-interactive-visuals">
        
        {/* Absolute 16 candles row layout floating above cake */}
        <div className="absolute top-2 left-0 right-0 z-30 flex flex-wrap justify-center gap-3 max-w-md mx-auto px-4">
          {candles.map((isLit, idx) => (
            <div key={idx} className="flex flex-col items-center relative h-20 w-5">
              
              {/* Lit Flame Area */}
              <AnimatePresence>
                {isLit ? (
                  <motion.div
                    initial={{ scale: 0, y: 15 }}
                    animate={{ scale: [1, 1.15, 0.95, 1], y: 0 }}
                    exit={{ scale: 0, y: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute -top-1.5 cursor-pointer"
                    onMouseEnter={() => extinguishCandle(idx)}
                    onClick={() => extinguishCandle(idx)}
                  >
                    <Flame className="w-6 h-6 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.7)] hover:scale-125 transition-transform animate-pulse" />
                  </motion.div>
                ) : (
                  // Sweet smoke visual effect upon extinction
                  <motion.div
                    initial={{ opacity: 0.8, y: -5, scale: 0.5 }}
                    animate={{ opacity: 0, y: -30, scale: 2 }}
                    transition={{ duration: 0.8 }}
                    className="absolute -top-3 w-4 h-4 bg-gray-300 rounded-full blur-xs pointer-events-none"
                  />
                )}
              </AnimatePresence>

              {/* Little Candlestick details with pastel colored stripes */}
              <div 
                className={`w-2 h-14 rounded-b-md transition-all duration-300 relative top-4 shadow-[inset_0_1px_4px_rgba(255,255,255,0.4)] ${
                  isLit ? "opacity-100" : "opacity-40"
                }`}
                style={{
                  background: idx % 4 === 0 
                    ? "linear-gradient(to bottom, #fecdd3, #fda4af, #fecdd3)" 
                    : idx % 4 === 1
                    ? "linear-gradient(to bottom, #d9f99d, #a3e635, #d9f99d)"
                    : idx % 4 === 2
                    ? "linear-gradient(to bottom, #bfdbfe, #60a5fa, #bfdbfe)"
                    : "linear-gradient(to bottom, #fef08a, #facc15, #fef08a)"
                }}
              >
                {/* Candle wick */}
                <div className="absolute top-[-3px] left-1/2 -translate-x-1/2 w-[1px] h-[4px] bg-gray-800" />
                
                {/* Cute number labels on candle */}
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[7px] font-sans font-extrabold text-white select-none">
                  {idx + 1}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 3D-effect Pastel Cake Visual tiers */}
        <div className="w-72 md:w-80 h-36 relative mt-16 z-10 flex flex-col justify-end">
          
          {/* Top frosting tier */}
          <div className="w-60 md:w-64 h-15 bg-gradient-to-r from-pink-100 via-pink-200 to-pink-100 rounded-lg mx-auto relative bottom-[-8px] shadow-sm flex items-center justify-between px-6 border border-pink-100">
            {/* Cute mini strawberry shapes on cake */}
            {new Array(6).fill(null).map((_, i) => (
              <div key={i} className="w-3.5 h-3 bg-rose-500 rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)] relative -top-1 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="absolute top-0.5 left-1 w-0.5 h-0.5 bg-yellow-200 rounded-full" />
              </div>
            ))}
          </div>

          {/* Main big tier */}
          <div className="w-full h-24 bg-gradient-to-r from-pink-300 via-rose-200 to-pink-300 rounded-xl relative shadow-md border-b-6 border-pink-400 border-x border-t border-pink-200 flex flex-col justify-between overflow-hidden">
            
            {/* Flowing frosting dripping effect */}
            <div className="flex justify-between w-full h-6 pr-1 relative top-[-1px]">
              {new Array(15).fill(null).map((_, i) => (
                <div key={i} className="w-6 h-5 bg-pink-100 rounded-b-full shadow-xs border-b border-pink-200" style={{ marginTop: i % 2 === 0 ? "0px" : "-3px" }} />
              ))}
            </div>

            {/* Glowing gold text label for her birthday */}
            <div className="absolute inset-x-0 top-10 flex flex-col items-center justify-center pointer-events-none select-none">
              <span className="text-xl md:text-2xl font-sans font-extrabold text-rose-500/80 tracking-widest drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
                {girlfriendName ? `${girlfriendName.toUpperCase()}` : "MY GIRL"}
              </span>
              <span className="font-mono text-[9px] font-extrabold text-pink-700/60 uppercase tracking-widest mt-0.5">
                ✦ Sweet Sixteen Celebration ✦
              </span>
            </div>

            {/* Nice decorative cake base plate */}
            <div className="w-full h-3 bg-white border-t border-pink-200 z-20" />
          </div>
        </div>

        {/* Outer cake stand base tray shadow */}
        <div className="w-80 md:w-96 h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full relative bottom-[-1px] shadow-lg border border-gray-200" />
      </div>

      {/* Progress display / cheat panel */}
      <div className="flex flex-col items-center gap-3 mt-4 w-full border-t border-pink-50 pt-4">
        <div className="text-xs font-semibold text-gray-500 font-mono tracking-wide">
          Candles Lit: <span className="text-pink-600 font-sans text-sm font-bold">{litCount}</span>/16
        </div>

        <div className="flex gap-4">
          <button
            onClick={resetCandles}
            className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 text-xs font-semibold transition"
            id="reset-candles-btn"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Candles
          </button>
          
          <button
            onClick={blowAllInstantly}
            className="flex items-center gap-1 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-lg px-3 py-1 text-xs font-semibold transition border border-pink-100/30"
            id="blow-candles-cheat"
          >
            Blow All Instantly 💨
          </button>
        </div>
      </div>
    </div>
  );
}
