import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Settings, Volume2, VolumeX, Brain } from 'lucide-react';
import API from '../utils/api';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';

const MODES = {
  focus: { label: 'Deep Focus', color: '#7c3aed', glow: 'rgba(124, 58, 237, 0.4)' },
  'short-break': { label: 'Short Break', color: '#34d399', glow: 'rgba(52, 211, 153, 0.4)' },
  'long-break': { label: 'Long Break', color: '#60a5fa', glow: 'rgba(96, 165, 250, 0.4)' },
};

export default function Pomodoro() {
  const { user } = useAuth();
  const settings = user?.pomodoroSettings || { focusDuration: 25, shortBreak: 5, longBreak: 15, longBreakInterval: 4 };

  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(settings.focusDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sessionCount, setSessionCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [config, setConfig] = useState(settings);
  const intervalRef = useRef(null);

  const getDuration = useCallback((m) => {
    if (m === 'focus') return config.focusDuration * 60;
    if (m === 'short-break') return config.shortBreak * 60;
    return config.longBreak * 60;
  }, [config]);

  useEffect(() => {
    setTimeLeft(getDuration(mode));
    setIsRunning(false);
  }, [mode, getDuration]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            handleSessionEnd();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const handleSessionEnd = async () => {
    setIsRunning(false);
    toast.success(mode === 'focus' ? 'Session complete!' : 'Break over!');
    if (soundEnabled) {
      try { new Audio('/notification.mp3').play(); } catch (_) {}
    }

    if (mode === 'focus') {
      const newCount = sessionCount + 1;
      setSessionCount(newCount);
      try {
        await API.post('/pomodoro/session', { type: 'focus', duration: config.focusDuration });
      } catch (_) {}
      setTimeout(() => setMode(newCount % config.longBreakInterval === 0 ? 'long-break' : 'short-break'), 1000);
    } else {
      setTimeout(() => setMode('focus'), 1000);
    }
  };

  const reset = () => { setIsRunning(false); setTimeLeft(getDuration(mode)); };

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');
  const progress = 1 - timeLeft / getDuration(mode);
  
  // SVG Ring calculation
  const size = 340;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[80vh] relative">
      
      {/* Ambient background glow that pulses when running */}
      <motion.div 
        animate={{ 
          scale: isRunning ? [1, 1.05, 1] : 1,
          opacity: isRunning ? [0.3, 0.5, 0.3] : 0.2 
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none"
        style={{ backgroundColor: MODES[mode].color }}
      />

      <div className="z-10 w-full flex flex-col items-center">
        {/* Mode Selector */}
        <div className="glass-card p-2 rounded-full mb-12 inline-flex bg-bgSecondary/80 backdrop-blur-md border-white/10">
          {Object.entries(MODES).map(([key, val]) => (
            <button key={key} onClick={() => !isRunning && setMode(key)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${mode === key ? 'bg-bgCard text-white shadow-lg border border-white/10' : 'text-textMuted hover:text-textPrimary'}`}
            >
              {val.label}
            </button>
          ))}
        </div>

        {/* Timer UI */}
        <div className="relative mb-12">
          {/* Outer rotating dashed ring */}
          <motion.svg 
            width={size + 40} height={size + 40} 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none"
            animate={{ rotate: isRunning ? 360 : 0 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            <circle cx={(size+40)/2} cy={(size+40)/2} r={(size+10)/2} stroke="white" strokeWidth="1" strokeDasharray="4 8" fill="none" />
          </motion.svg>

          {/* Main Ring */}
          <svg width={size} height={size} className="transform -rotate-90 filter drop-shadow-xl">
            <circle cx={size/2} cy={size/2} r={radius} stroke="rgba(255,255,255,0.03)" strokeWidth={strokeWidth} fill="none" />
            <circle 
              cx={size/2} cy={size/2} r={radius} 
              stroke={MODES[mode].color} strokeWidth={strokeWidth} fill="none" 
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
              style={{ filter: `drop-shadow(0 0 10px ${MODES[mode].glow})` }}
            />
          </svg>

          {/* Time Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="font-display font-black text-white tracking-tighter" style={{ fontSize: '90px', lineHeight: 1 }}>
              {minutes}:{seconds}
            </div>
            <div className="mt-2 text-sm font-bold text-textMuted uppercase tracking-[0.2em]">
              {isRunning ? 'Focusing...' : 'Paused'}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-4 rounded-full bg-white/5 text-textSecondary hover:text-white hover:bg-white/10 transition-colors border border-white/5">
            {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>
          
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsRunning(!isRunning)}
            className="w-20 h-20 rounded-full flex items-center justify-center text-white border-4 border-bgPrimary relative group"
            style={{ backgroundColor: MODES[mode].color, boxShadow: `0 0 30px ${MODES[mode].glow}` }}
          >
            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            {isRunning ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </motion.button>

          <button onClick={reset} className="p-4 rounded-full bg-white/5 text-textSecondary hover:text-white hover:bg-white/10 transition-colors border border-white/5">
            <RotateCcw size={24} />
          </button>
        </div>

        {/* Bottom Info & Settings */}
        <div className="mt-16 w-full max-w-md flex items-center justify-between px-6 py-4 glass-card rounded-2xl border-white/5">
          <div className="flex items-center gap-2 text-sm font-bold text-textSecondary">
            <Brain size={16} className="text-neonPurple" />
            Sessions Today: <span className="text-white">{sessionCount}</span>
          </div>
          <button onClick={() => setShowSettings(true)} className="text-textMuted hover:text-white transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </div>

      <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title="Timer Configuration">
        <div className="space-y-4">
          {['focusDuration', 'shortBreak', 'longBreak'].map((key) => (
            <div key={key}>
              <label className="block text-xs font-bold text-textMuted uppercase tracking-wider mb-2">
                {key.replace(/([A-Z])/g, ' $1').trim()} (min)
              </label>
              <input type="number" className="input" value={config[key]} onChange={e => setConfig({...config, [key]: Number(e.target.value)})} />
            </div>
          ))}
          <button className="btn btn-primary w-full mt-4" onClick={() => { setShowSettings(false); reset(); toast.success('Config saved'); }}>
            Apply Changes
          </button>
        </div>
      </Modal>
    </div>
  );
}
