import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import Loader from '../components/ui/Loader';
import { Target, Flame, BrainCircuit, Clock, Zap, CheckCircle2 } from 'lucide-react';

// Circular Progress Component
const CircularProgress = ({ value, max, color, size = 120, label, subtitle }) => {
  const radius = (size - 16) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (value / max) * 100;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
        <circle 
          cx={size/2} cy={size/2} r={radius} 
          stroke={color} strokeWidth="8" fill="none" 
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-black text-2xl text-white">{value}</span>
        {label && <span className="text-[10px] uppercase font-bold text-textMuted tracking-wider">{label}</span>}
      </div>
      {subtitle && <div className="mt-4 text-xs font-bold text-textSecondary uppercase tracking-widest">{subtitle}</div>}
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [statsRes, tasksRes] = await Promise.all([
          API.get('/analytics/dashboard'),
          API.get('/tasks?status=pending')
        ]);
        setStats(statsRes.data.stats);
        setTasks(tasksRes.data.tasks.slice(0, 4));
      } catch (e) {
        setStats({
          totalTasks: 15, completedTasks: 9, completionRate: 60,
          todayHours: 3.2, weekHours: 18.5, totalStudyHours: 142,
          totalPomodoroSessions: 89, streak: { current: 5, longest: 14 }
        });
        setTasks([
          { _id: '1', title: 'Calculus Assignment 4', subject: 'Math', priority: 'High' },
          { _id: '2', title: 'Read Physics Chapter 8', subject: 'Physics', priority: 'Medium' },
          { _id: '3', title: 'Draft History Essay', subject: 'History', priority: 'High' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-4xl md:text-5xl font-display font-black text-white tracking-tight mb-2">
          Overview
        </h1>
        <p className="text-textSecondary flex items-center gap-2">
          <BrainCircuit size={16} className="text-neonPurple" /> Welcome back to your neural workspace, {user?.name?.split(' ')[0]}.
        </p>
      </motion.div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Main Focus Widget (Spans 8 cols) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="md:col-span-8 glass-card p-8 rounded-[32px] bg-gradient-to-br from-bgSecondary to-bgPrimary relative overflow-hidden border-white/5"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-accentPurple/10 rounded-full blur-[80px]" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-neonPurple font-bold text-xs uppercase tracking-widest mb-4">
                <Clock size={14} /> Today's Focus
              </div>
              <h2 className="text-5xl font-display font-black text-white mb-2">{stats.todayHours} <span className="text-2xl text-textMuted">hours</span></h2>
              <p className="text-textSecondary">You're making great progress today. Keep the momentum going.</p>
            </div>
            
            <div className="flex gap-6">
              <CircularProgress value={stats.todayHours} max={8} color="#7c3aed" label="Hours" subtitle="Daily Goal" size={140} />
            </div>
          </div>
        </motion.div>

        {/* Streak Widget (Spans 4 cols) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          className="md:col-span-4 glass-card p-8 rounded-[32px] bg-gradient-to-bl from-[#1e222d] to-bgPrimary relative overflow-hidden flex flex-col justify-center items-center text-center"
        >
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-neonOrange/10 rounded-full blur-[50px]" />
          <Flame size={48} className="text-neonOrange mb-4 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
          <div className="text-5xl font-display font-black text-white mb-1">{stats.streak.current}</div>
          <div className="text-xs font-bold text-textMuted uppercase tracking-widest mb-4">Day Streak</div>
          <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-textSecondary">
            Longest: {stats.streak.longest} days
          </div>
        </motion.div>

        {/* Tasks List (Spans 6 cols) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="md:col-span-6 glass-card p-8 rounded-[32px] border-white/5"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-black text-xl text-white">Priority Queue</h3>
            <button className="text-xs font-bold text-neonBlue uppercase tracking-widest hover:text-white transition-colors">View All</button>
          </div>
          
          {tasks.length === 0 ? (
            <div className="py-10 text-center text-textMuted flex flex-col items-center">
              <CheckCircle2 size={40} className="mb-4 opacity-50" />
              <p>Queue is empty. Relax or add more tasks.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task, i) => (
                <div key={task._id} className="group flex items-center gap-4 p-4 rounded-2xl bg-bgSecondary border border-white/5 hover:border-white/10 transition-all hover:bg-[#1e222d]">
                  <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${task.priority === 'High' ? 'text-neonPink bg-neonPink' : task.priority === 'Medium' ? 'text-neonOrange bg-neonOrange' : 'text-neonGreen bg-neonGreen'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-white truncate">{task.title}</div>
                    <div className="text-xs text-textMuted">{task.subject}</div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 p-2 rounded-xl bg-white/5 text-textSecondary hover:text-white hover:bg-neonBlue/20 hover:text-neonBlue transition-all">
                    <Zap size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Stats Grid (Spans 6 cols) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="md:col-span-6 grid grid-cols-2 gap-6"
        >
          <div className="glass-card p-6 rounded-[32px] border-white/5 flex flex-col justify-between">
            <Target className="text-neonGreen mb-4" size={24} />
            <div>
              <div className="text-3xl font-display font-black text-white mb-1">{stats.completionRate}%</div>
              <div className="text-xs font-bold text-textMuted uppercase tracking-widest">Completion</div>
            </div>
          </div>
          <div className="glass-card p-6 rounded-[32px] border-white/5 flex flex-col justify-between">
            <BrainCircuit className="text-neonPink mb-4" size={24} />
            <div>
              <div className="text-3xl font-display font-black text-white mb-1">{stats.totalPomodoroSessions}</div>
              <div className="text-xs font-bold text-textMuted uppercase tracking-widest">Pomodoros</div>
            </div>
          </div>
          <div className="col-span-2 glass-card p-6 rounded-[32px] border-white/5 flex items-center justify-between bg-gradient-to-r from-bgSecondary to-accentPurple/10">
            <div>
              <div className="text-xs font-bold text-textMuted uppercase tracking-widest mb-1">Total Lifetime Hours</div>
              <div className="text-2xl font-display font-black text-white">{stats.totalStudyHours}</div>
            </div>
            <div className="w-12 h-12 rounded-full bg-accentPurple/20 flex items-center justify-center border border-accentPurple/30">
              <Clock className="text-neonPurple" size={20} />
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
