import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API from '../utils/api';
import Loader from '../components/ui/Loader';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import { Activity, Target, Zap, Clock } from 'lucide-react';

const PIE_COLORS = ['#7c3aed', '#34d399', '#fbbf24', '#f472b6', '#60a5fa'];

const Tip = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div className="bg-bgCard border border-white/10 rounded-xl p-3 shadow-xl">
      <p className="text-xs font-bold text-textMuted uppercase tracking-widest mb-2">{label}</p>
      {payload.map((p, i) => <p key={i} style={{ color: p.color }} className="font-bold text-sm">{p.name}: {p.value}</p>)}
    </div>
  );
  return null;
};

const DEMO_STATS = {
  totalTasks: 24, completedTasks: 18, completionRate: 75,
  todayHours: 4.5, weekHours: 22, totalStudyHours: 186,
  totalPomodoroSessions: 112, streak: { current: 7, longest: 21 },
  last7Days: [
    { date: 'Mon', hours: 3 }, { date: 'Tue', hours: 5 },
    { date: 'Wed', hours: 2 }, { date: 'Thu', hours: 4.5 },
    { date: 'Fri', hours: 6 }, { date: 'Sat', hours: 1.5 },
    { date: 'Sun', hours: 4.5 }
  ]
};

const DEMO_WEEKLY = [
  { day: 'Mon', studyHours: 3, sessionsCount: 6, tasksCompleted: 2 },
  { day: 'Tue', studyHours: 5, sessionsCount: 10, tasksCompleted: 4 },
  { day: 'Wed', studyHours: 2, sessionsCount: 4, tasksCompleted: 1 },
  { day: 'Thu', studyHours: 4.5, sessionsCount: 9, tasksCompleted: 3 },
  { day: 'Fri', studyHours: 6, sessionsCount: 12, tasksCompleted: 5 },
  { day: 'Sat', studyHours: 1.5, sessionsCount: 3, tasksCompleted: 1 },
  { day: 'Sun', studyHours: 4.5, sessionsCount: 9, tasksCompleted: 2 },
];

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [weekly, setWeekly] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [d, w] = await Promise.all([ API.get('/analytics/dashboard'), API.get('/analytics/weekly') ]);
        setStats(d.data.stats); setWeekly(w.data.weekly);
      } catch { setStats(DEMO_STATS); setWeekly(DEMO_WEEKLY); } finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <Loader />;

  const pieData = [
    { name: 'Completed', value: stats.completedTasks },
    { name: 'Pending', value: stats.totalTasks - stats.completedTasks }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-display font-black text-white tracking-tight mb-2">Insights</h1>
        <p className="text-textSecondary">Deep dive into your neural learning patterns.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Hours', value: `${stats.totalStudyHours}h`, icon: Clock, color: 'text-neonBlue', bg: 'bg-neonBlue/10', glow: 'shadow-[0_0_20px_rgba(96,165,250,0.15)]' },
          { label: 'Weekly Hours', value: `${stats.weekHours}h`, icon: Activity, color: 'text-neonPurple', bg: 'bg-neonPurple/10', glow: 'shadow-[0_0_20px_rgba(124,58,237,0.15)]' },
          { label: 'Completion', value: `${stats.completionRate}%`, icon: Target, color: 'text-neonGreen', bg: 'bg-neonGreen/10', glow: 'shadow-[0_0_20px_rgba(52,211,153,0.15)]' },
          { label: 'Best Streak', value: `${stats.streak.longest}d`, icon: Zap, color: 'text-neonOrange', bg: 'bg-neonOrange/10', glow: 'shadow-[0_0_20px_rgba(251,191,36,0.15)]' },
        ].map((item, i) => (
          <motion.div key={i} className={`glass-card p-6 border-white/5 rounded-3xl ${item.glow}`}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-4`}>
              <item.icon size={24} />
            </div>
            <div className="text-3xl font-display font-black text-white mb-1">{item.value}</div>
            <div className="text-xs font-bold text-textMuted uppercase tracking-widest">{item.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Large Area Chart */}
        <motion.div className="lg:col-span-2 glass-card p-8 border-white/5 rounded-[32px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h3 className="text-sm font-bold text-textMuted uppercase tracking-widest mb-6 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neonPurple" /> Daily Focus Trajectory
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.last7Days}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip content={<Tip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="hours" name="Hours" stroke="#7c3aed" strokeWidth={3} fill="url(#colorHours)" activeDot={{ r: 6, fill: '#7c3aed', stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Task Completion Pie */}
        <motion.div className="glass-card p-8 border-white/5 rounded-[32px] flex flex-col items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <h3 className="text-sm font-bold text-textMuted uppercase tracking-widest mb-2 self-start flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neonGreen" /> Task Matrix
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip content={<Tip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 w-full justify-center">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-bold text-textSecondary uppercase">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} /> {d.name}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Bar Chart */}
        <motion.div className="lg:col-span-3 glass-card p-8 border-white/5 rounded-[32px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <h3 className="text-sm font-bold text-textMuted uppercase tracking-widest mb-6 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neonBlue" /> Volume vs Tasks Completed
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly} barGap={8} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis yAxisId="left" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} />
                <Tooltip content={<Tip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                <Bar yAxisId="left" dataKey="studyHours" name="Study Hours" fill="#60a5fa" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar yAxisId="right" dataKey="tasksCompleted" name="Tasks Done" fill="#34d399" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
