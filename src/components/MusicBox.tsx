import { useState, useEffect, useRef } from "react";
import { Music, Play, Square, Volume2, VolumeX, Heart } from "lucide-react";

export default function MusicBox() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [waveforms, setWaveforms] = useState<number[]>(new Array(12).fill(15));
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<any>(null);
  const intervalRef = useRef<any>(null);

  // Play a simple synthesized note sequence for "Happy Birthday"
  const notes = [
    { note: "C4", dur: 0.3, freq: 261.63, delay: 0 },
    { note: "C4", dur: 0.3, freq: 261.63, delay: 0.4 },
    { note: "D4", dur: 0.5, freq: 293.66, delay: 0.8 },
    { note: "C4", dur: 0.5, freq: 261.63, delay: 1.4 },
    { note: "F4", dur: 0.5, freq: 349.23, delay: 2.0 },
    { note: "E4", dur: 0.8, freq: 329.63, delay: 2.6 },
    
    { note: "C4", dur: 0.3, freq: 261.63, delay: 3.6 },
    { note: "C4", dur: 0.3, freq: 261.63, delay: 4.0 },
    { note: "D4", dur: 0.5, freq: 293.66, delay: 4.4 },
    { note: "C4", dur: 0.5, freq: 261.63, delay: 5.0 },
    { note: "G4", dur: 0.5, freq: 392.00, delay: 5.6 },
    { note: "F4", dur: 0.8, freq: 349.23, delay: 6.2 },
    
    { note: "C4", dur: 0.3, freq: 261.63, delay: 7.2 },
    { note: "C4", dur: 0.3, freq: 261.63, delay: 7.6 },
    { note: "C5", dur: 0.5, freq: 523.25, delay: 8.0 },
    { note: "A4", dur: 0.5, freq: 440.00, delay: 8.6 },
    { note: "F4", dur: 0.5, freq: 349.23, delay: 9.2 },
    { note: "E4", dur: 0.5, freq: 329.63, delay: 9.8 },
    { note: "D4", dur: 0.8, freq: 293.66, delay: 10.4 },
    
    { note: "A#4", dur: 0.3, freq: 466.16, delay: 11.4 },
    { note: "A#4", dur: 0.3, freq: 466.16, delay: 11.8 },
    { note: "A4", dur: 0.5, freq: 440.00, delay: 12.2 },
    { note: "F4", dur: 0.5, freq: 349.23, delay: 12.8 },
    { note: "G4", dur: 0.5, freq: 392.00, delay: 13.4 },
    { note: "F4", dur: 0.9, freq: 349.23, delay: 14.0 }
  ];

  // Helper code to handle background animations/visual loops
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setWaveforms(prev => prev.map(() => Math.floor(Math.random() * 30) + 5));
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setWaveforms(new Array(12).fill(8));
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  // Cleanup helper on unmount
  useEffect(() => {
    return () => {
      stopMusic();
    };
  }, []);

  const playSynthesizerNote = (freq: number, duration: number, noteName: string) => {
    if (isMuted || !audioCtxRef.current) return;

    try {
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      // Soft cute triangular wave
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Cute envelope definition for soft piano/bell sound
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.05);
      gainNode.gain.setValueAtTime(0.25, ctx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
      
      setActiveNote(noteName);
      setTimeout(() => {
        setActiveNote(null);
      }, duration * 1000);
    } catch (e) {
      console.warn("Audio scheduling failed", e);
    }
  };

  const startMusic = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    setIsPlaying(true);
    let totalTime = 15; // Total length of Happy Birthday sequence in seconds
    
    // Schedule all notes in the array
    notes.forEach(item => {
      const timer = setTimeout(() => {
        playSynthesizerNote(item.freq, item.dur, item.note);
      }, item.delay * 1000);
      
      timerRef.current = timerRef.current || [];
      timerRef.current.push(timer);
    });

    // Loop the music sequence
    const loopTimer = setTimeout(() => {
      startMusic();
    }, totalTime * 1000);
    timerRef.current.push(loopTimer);
  };

  const stopMusic = () => {
    setIsPlaying(false);
    if (timerRef.current) {
      timerRef.current.forEach((t: any) => clearTimeout(t));
      timerRef.current = null;
    }
    setActiveNote(null);
  };

  const togglePlayback = () => {
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div 
      className="bg-white/70 backdrop-blur-md rounded-2xl p-4 shadow-md border border-pink-100 flex items-center justify-between gap-6 relative overflow-hidden max-w-sm w-full transition-all duration-300 hover:shadow-lg hover:border-pink-200"
      id="music-box"
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full ${isPlaying ? "bg-gradient-to-r from-pink-400 to-rose-400 text-white animate-spin" : "bg-pink-50 text-pink-400"}`}>
          <Music className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-800">Music Box</h4>
          <p className="text-xs text-gray-500 font-mono">
            {isPlaying ? `Playing: ${activeNote || "Happy Birthday ♪"}` : "Soft Retro Synthesizer"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Dynamic Waveform Visualizer */}
        {isPlaying && (
          <div className="flex items-end gap-0.5 h-6">
            {waveforms.map((h, i) => (
              <div 
                key={i} 
                className="w-0.5 bg-gradient-to-t from-pink-400 to-rose-400 rounded-full transition-all duration-100" 
                style={{ height: `${h}px` }}
              />
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={togglePlayback}
            className={`p-2 rounded-xl transition-all duration-200 ${isPlaying ? "bg-rose-500 hover:bg-rose-600 text-white" : "bg-pink-100 hover:bg-pink-100/80 text-pink-600"}`}
            title={isPlaying ? "Stop" : "Play"}
            id="toggle-playback-btn"
          >
            {isPlaying ? <Square className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-current" />}
          </button>
          
          <button
            onClick={toggleMute}
            className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500 transition-all duration-200"
            title={isMuted ? "Unmute" : "Mute"}
            id="toggle-mute-btn"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      {/* Absolute hearts animation */}
      {isPlaying && (
        <div className="absolute top-1 right-2 pointer-events-none animate-bounce">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-300 animate-pulse" />
        </div>
      )}
    </div>
  );
}
