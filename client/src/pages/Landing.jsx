import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, BrainCircuit, CalendarClock, LineChart, BookOpen, Clock, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: <Clock size={24} />, title: 'Deep Focus', desc: 'Immersive Pomodoro sessions with ambient backgrounds and analytics.' },
  { icon: <CalendarClock size={24} />, title: 'Smart Planner', desc: 'Asymmetric task management tailored for student workflows.' },
  { icon: <Activity size={24} />, title: 'Study Analytics', desc: 'Track your neuro-plasticity with beautiful bento-grid insights.' },
  { icon: <BookOpen size={24} />, title: 'Notebook', desc: 'Distraction-free markdown notes for active recall.' },
];

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bgPrimary text-textPrimary overflow-hidden font-sans relative">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accentPurple/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-neonBlue/10 blur-[150px]" />
        <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] rounded-full bg-neonPink/5 blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-bgPrimary/40 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-accentPurple to-neonBlue flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)]">
              <Sparkles size={20} className="text-white" />
            </div>
            <span className="font-display font-black text-2xl tracking-tight text-white">StudySync</span>
          </div>
          <div className="flex gap-4">
            {user ? (
              <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
                Workspace <ArrowRight size={16} />
              </button>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost hidden sm:flex">Log in</Link>
                <Link to="/register" className="btn btn-primary">Start Free <ArrowRight size={16} /></Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-neonBlue mb-8 tracking-widest uppercase">
            <BrainCircuit size={14} /> Next-Gen Productivity
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-[80px] font-display font-black leading-[1.1] tracking-tight mb-6 text-white max-w-4xl mx-auto">
            Rewire your <br className="hidden sm:block"/>
            <span className="gradient-text">Study Habits.</span>
          </h1>
          <p className="text-lg md:text-xl text-textSecondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Forget generic planners. StudySync is a handcrafted environment designed to keep you in the flow state using science-backed focus tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn btn-primary px-8 py-4 text-lg">
              Initialize Workspace <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="btn btn-ghost px-8 py-4 text-lg">
              Sign In
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Bento */}
      <section className="relative z-10 py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-black text-white mb-4">Engineered for Focus</h2>
          <p className="text-textSecondary">A beautiful, asymmetric suite of tools to elevate your academic performance.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="md:col-span-2 glass-card p-8 md:p-12 curved-container bg-gradient-to-br from-bgCard to-bgSecondary relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-accentPurple/20 rounded-full blur-[80px] group-hover:bg-accentPurple/30 transition-colors" />
            <Clock size={32} className="text-neonPurple mb-6" />
            <h3 className="text-2xl font-display font-black text-white mb-3">Immersive Pomodoro</h3>
            <p className="text-textSecondary max-w-md">Our timer isn't just a clock. It's a full-screen focus room with ambient sounds, breathing visuals, and strict session tracking.</p>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="glass-card p-8 md:p-10 rounded-[30px] bg-gradient-to-br from-bgCard to-bgSecondary group"
          >
            <LineChart size={32} className="text-neonBlue mb-6" />
            <h3 className="text-2xl font-display font-black text-white mb-3">Neural Analytics</h3>
            <p className="text-textSecondary">Visualize your consistency with interactive heatmaps and circular progress trackers.</p>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="glass-card p-8 md:p-10 rounded-[30px] bg-gradient-to-br from-bgCard to-bgSecondary group"
          >
            <BookOpen size={32} className="text-neonGreen mb-6" />
            <h3 className="text-2xl font-display font-black text-white mb-3">Active Recall Notes</h3>
            <p className="text-textSecondary">Rich-text markdown notes designed to help you synthesize information faster.</p>
          </motion.div>

          {/* Card 4 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="md:col-span-2 glass-card p-8 md:p-12 curved-container bg-gradient-to-bl from-bgCard to-bgSecondary relative overflow-hidden group"
          >
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-neonBlue/20 rounded-full blur-[80px] group-hover:bg-neonBlue/30 transition-colors" />
            <CalendarClock size={32} className="text-neonPink mb-6" />
            <h3 className="text-2xl font-display font-black text-white mb-3">Asymmetric Scheduler</h3>
            <p className="text-textSecondary max-w-md">Break free from rigid rows. Manage your tasks and weekly timetable in a fluid, drag-friendly interface.</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-10 text-center text-textMuted text-sm mt-20 bg-bgPrimary/50">
        <p>© 2026 StudySync OS. Designed for the focused mind.</p>
      </footer>
    </div>
  );
}
