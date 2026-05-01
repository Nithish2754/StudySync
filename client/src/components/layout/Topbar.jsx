import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/dashboard': 'Overview',
  '/pomodoro': 'Focus Room',
  '/planner': 'Study Planner',
  '/timetable': 'Schedule',
  '/notes': 'Notebook',
  '/analytics': 'Insights',
  '/profile': 'Settings',
};

export default function Topbar({ onMenuClick }) {
  const { user } = useAuth();
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'StudySync';

  return (
    <motion.header
      initial={{ y: -80 }} animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 20 }}
      className="fixed top-0 right-0 left-0 h-[80px] bg-transparent backdrop-blur-md z-50 flex items-center justify-between px-6 md:px-10 border-b border-white/5"
    >
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="p-2 rounded-xl bg-bgSecondary/50 text-textSecondary hover:text-white border border-white/5 hover:border-white/10 transition-colors">
          <Menu size={20} />
        </button>
        <div className="hidden md:block">
          <h1 className="text-xl font-display font-black text-white tracking-tight">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar - Visual only for header */}
        <div className="hidden md:flex relative items-center">
          <Search size={16} className="absolute left-3 text-textMuted" />
          <input 
            type="text" 
            placeholder="Quick search..." 
            className="bg-bgSecondary/50 border border-white/5 rounded-full py-2 pl-10 pr-4 text-sm text-textPrimary w-64 focus:outline-none focus:border-white/20 transition-all"
          />
          <div className="absolute right-3 flex gap-1">
            <kbd className="px-1.5 py-0.5 rounded text-[10px] bg-bgPrimary border border-white/10 text-textMuted font-sans">⌘</kbd>
            <kbd className="px-1.5 py-0.5 rounded text-[10px] bg-bgPrimary border border-white/10 text-textMuted font-sans">K</kbd>
          </div>
        </div>

        <button className="relative p-2.5 rounded-xl bg-bgSecondary/50 text-textSecondary hover:text-white border border-white/5 hover:border-white/10 transition-colors">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-neonPink shadow-[0_0_10px_rgba(244,114,182,0.8)]" />
        </button>

        <div className="w-10 h-10 rounded-xl bg-bgSecondary border border-white/10 flex items-center justify-center text-sm font-bold text-white cursor-pointer shadow-lg">
          {user?.name?.[0]?.toUpperCase() || 'S'}
        </div>
      </div>
    </motion.header>
  );
}
