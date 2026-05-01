import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, Edit2, Check, Filter } from 'lucide-react';
import API from '../utils/api';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import Loader from '../components/ui/Loader';

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'English', 'Computer Science', 'Economics', 'General'];
const PRIORITIES = ['High', 'Medium', 'Low'];

const emptyForm = { title: '', description: '', subject: 'General', priority: 'Medium', deadline: '', estimatedHours: 1 };

export default function Planner() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await API.get(`/tasks${search ? `?search=${search}` : ''}`);
      setTasks(res.data.tasks);
    } catch (_) { setTasks([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetchTasks(); }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editTask) {
        await API.put(`/tasks/${editTask._id}`, form);
        toast.success('Task updated');
      } else {
        await API.post('/tasks', form);
        toast.success('Task created');
      }
      setModal(false);
      fetchTasks();
    } catch (err) { toast.error('Error saving task'); }
  };

  const toggleStatus = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await API.put(`/tasks/${task._id}`, { status: newStatus });
      setTasks(t => t.map(tk => tk._id === task._id ? { ...tk, status: newStatus } : tk));
    } catch (_) { }
  };

  const deleteTask = async (id) => {
    if(!confirm('Delete task?')) return;
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(t => t.filter(tk => tk._id !== id));
    } catch (_) { }
  };

  if (loading) return <Loader />;

  // Group tasks into columns for Kanban feel
  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-display font-black text-white tracking-tight mb-2">Planner</h1>
          <p className="text-textSecondary">Organize your workflow and track assignments.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
            <input className="input pl-10 w-64 bg-bgSecondary/50 border-white/5" placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={() => { setEditTask(null); setForm(emptyForm); setModal(true); }}>
            <Plus size={18} /> New Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 items-start">
        {/* Pending Column */}
        <div className="bg-bgSecondary/30 rounded-[32px] p-6 border border-white/5 min-h-[500px]">
          <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neonPurple shadow-[0_0_8px_rgba(167,139,250,0.8)]" /> Active Queue
            </h2>
            <span className="text-xs font-bold text-textMuted bg-white/5 px-2 py-1 rounded-md">{pendingTasks.length}</span>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {pendingTasks.map(task => (
                <motion.div key={task._id} 
                  layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-card p-5 border-white/5 bg-bgCard hover:bg-[#1e222d] transition-colors group relative overflow-hidden"
                >
                  <div className={`absolute top-0 left-0 w-1 h-full ${task.priority === 'High' ? 'bg-neonPink' : task.priority === 'Medium' ? 'bg-neonOrange' : 'bg-neonGreen'}`} />
                  
                  <div className="flex gap-4">
                    <button onClick={() => toggleStatus(task)} className="mt-1 w-5 h-5 rounded-md border-2 border-textMuted hover:border-neonGreen hover:bg-neonGreen/10 flex items-center justify-center transition-colors flex-shrink-0">
                    </button>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-base mb-1 truncate">{task.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-textMuted mb-3">
                        <span className="bg-white/5 px-2 py-1 rounded-md">{task.subject}</span>
                        {task.deadline && <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>}
                      </div>
                      {task.description && <p className="text-sm text-textSecondary line-clamp-2">{task.description}</p>}
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditTask(task); setForm(task); setModal(true); }} className="p-1.5 rounded-lg bg-white/5 text-textSecondary hover:text-white hover:bg-white/10"><Edit2 size={14} /></button>
                    <button onClick={() => deleteTask(task._id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"><Trash2 size={14} /></button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {pendingTasks.length === 0 && <div className="text-center py-10 text-textMuted text-sm font-medium">No active tasks. You're all caught up!</div>}
          </div>
        </div>

        {/* Completed Column */}
        <div className="bg-bgSecondary/20 rounded-[32px] p-6 border border-white/5 border-dashed min-h-[500px]">
          <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-sm font-bold text-textMuted uppercase tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neonGreen/50" /> Completed
            </h2>
            <span className="text-xs font-bold text-textMuted bg-white/5 px-2 py-1 rounded-md">{completedTasks.length}</span>
          </div>

          <div className="space-y-3 opacity-60 hover:opacity-100 transition-opacity duration-500">
            <AnimatePresence>
              {completedTasks.map(task => (
                <motion.div key={task._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="p-4 rounded-2xl bg-bgPrimary border border-white/5 flex items-center gap-4"
                >
                  <button onClick={() => toggleStatus(task)} className="w-5 h-5 rounded-md bg-neonGreen text-bgPrimary flex items-center justify-center flex-shrink-0">
                    <Check size={14} strokeWidth={3} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-textSecondary font-bold text-sm line-through truncate">{task.title}</h3>
                  </div>
                  <button onClick={() => deleteTask(task._id)} className="p-1.5 rounded-lg text-textMuted hover:text-red-400 hover:bg-red-500/10"><Trash2 size={14} /></button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editTask ? 'Edit Task' : 'New Assignment'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-textMuted uppercase tracking-wider mb-2">Title</label>
            <input className="input" placeholder="e.g. Read Chapter 5" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} required />
          </div>
          <div>
            <label className="block text-xs font-bold text-textMuted uppercase tracking-wider mb-2">Description</label>
            <textarea className="input" rows={2} value={form.description} onChange={e=>setForm({...form, description: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-textMuted uppercase tracking-wider mb-2">Subject</label>
              <select className="input" value={form.subject} onChange={e=>setForm({...form, subject: e.target.value})}>
                {SUBJECTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-textMuted uppercase tracking-wider mb-2">Priority</label>
              <select className="input" value={form.priority} onChange={e=>setForm({...form, priority: e.target.value})}>
                {PRIORITIES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full mt-2">{editTask ? 'Save Changes' : 'Create Task'}</button>
        </form>
      </Modal>
    </div>
  );
}
