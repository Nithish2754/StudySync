import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Timer, ClipboardList, CalendarDays,
  StickyNote, BarChart3, User, LogOut, Sparkles
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/pomodoro', icon: Timer, label: 'Pomodoro' },
  { to: '/planner', icon: ClipboardList, label: 'Study Planner' },
  { to: '/timetable', icon: CalendarDays, label: 'Timetable' },
  { to: '/notes', icon: StickyNote, label: 'Notes' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99] md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -280 }} animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 left-0 w-[280px] h-screen bg-bgSecondary/80 backdrop-blur-xl border-r border-white/5 z-[100] flex flex-col py-6"
      >
        {/* Logo */}
        <div className="px-8 mb-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-accentPurple to-neonBlue flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)]">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <div className="font-display font-black text-xl text-white tracking-tight">StudySync</div>
            <div className="text-[10px] text-neonPurple font-bold uppercase tracking-widest">OS</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-bold text-textMuted px-4 mb-4 uppercase tracking-widest">Workspace</div>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className="block group">
              {({ isActive }) => (
                <div className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${isActive ? 'text-white' : 'text-textSecondary hover:text-white hover:bg-white/5'}`}>
                  {isActive && (
                    <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-white/5 rounded-2xl border border-white/10" />
                  )}
                  <Icon size={18} className={`relative z-10 ${isActive ? 'text-neonPurple' : ''}`} />
                  <span className="relative z-10 font-medium text-sm">{label}</span>
                  {isActive && <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-neonPurple shadow-[0_0_10px_rgba(124,58,237,1)]" />}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Info */}
        <div className="px-4 mt-auto pt-6 border-t border-white/5">
          <div className="glass-card rounded-2xl p-3 flex items-center gap-3 mb-3 border-white/5 bg-bgPrimary/50">
            <div className="w-10 h-10 rounded-xl bg-bgSecondary flex items-center justify-center text-sm font-bold text-white border border-white/10">
              {user?.name?.[0]?.toUpperCase() || 'S'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-white truncate">{user?.name}</div>
              <div className="text-xs text-textMuted truncate">{user?.email}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </motion.aside>
    </>
  );
}
