import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, CalendarClock } from 'lucide-react';
import API from '../utils/api';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import Loader from '../components/ui/Loader';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const COLORS = ['#7c3aed', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

const emptyBlock = { day: 'Mon', startTime: '09:00', endTime: '10:00', subject: '', color: '#7c3aed', location: '' };

export default function Timetable() {
  const [timetable, setTimetable] = useState(null);
  const [modal, setModal] = useState(false);
  const [editBlock, setEditBlock] = useState(null);
  const [form, setForm] = useState(emptyBlock);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      const res = await API.get('/timetable');
      // Fix full days to short days for compatibility if needed, but our new UI uses short days.
      let data = res.data.timetable;
      if (data && data.blocks) {
        data.blocks = data.blocks.map(b => ({ ...b, day: b.day.substring(0,3) }));
      }
      setTimetable(data);
    } catch (_) { setTimetable({ blocks: [] }); } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const openAdd = (day = 'Mon') => { setEditBlock(null); setForm({ ...emptyBlock, day }); setModal(true); };
  const openEdit = (block) => { setEditBlock(block); setForm({ ...block }); setModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, day: form.day === 'Mon' ? 'Monday' : form.day === 'Tue' ? 'Tuesday' : form.day === 'Wed' ? 'Wednesday' : form.day === 'Thu' ? 'Thursday' : form.day === 'Fri' ? 'Friday' : form.day === 'Sat' ? 'Saturday' : 'Sunday' };
      if (editBlock) {
        await API.put(`/timetable/${editBlock._id}`, payload);
        toast.success('Schedule updated');
      } else {
        await API.post('/timetable', payload);
        toast.success('Block added');
      }
      setModal(false);
      fetch();
    } catch (err) { toast.error('Error saving'); }
  };

  const deleteBlock = async (id) => {
    if(!confirm('Delete this block?')) return;
    try {
      await API.delete(`/timetable/${id}`);
      setTimetable(t => ({ ...t, blocks: t.blocks.filter(b => b._id !== id) }));
    } catch (_) { }
  };

  const getBlocksForDay = (day) => timetable?.blocks?.filter(b => b.day === day) || [];

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-display font-black text-white tracking-tight mb-2">Schedule</h1>
          <p className="text-textSecondary">Your weekly academic blocks.</p>
        </div>
        <button className="btn btn-primary" onClick={() => openAdd()}>
          <Plus size={18} /> New Block
        </button>
      </div>

      <div className="flex-1 glass-card p-6 overflow-x-auto relative rounded-[32px] border-white/5">
        <div className="min-w-[1000px] h-full flex flex-col">
          {/* Header */}
          <div className="grid grid-cols-7 gap-4 mb-4">
            {DAYS.map(day => (
              <div key={day} className="text-center group">
                <div className="text-xs font-bold text-textMuted uppercase tracking-widest mb-2">{day}</div>
                <button onClick={() => openAdd(day)} className="w-full py-2 rounded-xl bg-white/5 text-textSecondary hover:bg-white/10 hover:text-white transition-colors border border-white/5 border-dashed flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Plus size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 gap-4 flex-1">
            {DAYS.map(day => {
              const blocks = getBlocksForDay(day).sort((a,b) => a.startTime.localeCompare(b.startTime));
              return (
                <div key={day} className="flex flex-col gap-3 h-full rounded-2xl bg-bgPrimary/30 p-2 border border-white/5">
                  <AnimatePresence>
                    {blocks.map(block => (
                      <motion.div key={block._id}
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="group relative p-3 rounded-xl border border-white/10 overflow-hidden"
                        style={{ backgroundColor: `${block.color}15` }}
                      >
                        <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: block.color }} />
                        <div className="text-[10px] font-bold tracking-widest mb-1 opacity-80" style={{ color: block.color }}>
                          {block.startTime} - {block.endTime}
                        </div>
                        <div className="font-bold text-white text-sm truncate mb-1">{block.subject}</div>
                        {block.location && <div className="text-xs text-textSecondary truncate">{block.location}</div>}
                        
                        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(block)} className="p-1.5 rounded-md bg-black/40 text-white hover:bg-black/60"><Edit2 size={10} /></button>
                          <button onClick={() => deleteBlock(block._id)} className="p-1.5 rounded-md bg-black/40 text-red-400 hover:bg-black/60"><Trash2 size={10} /></button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {blocks.length === 0 && (
                    <div className="flex-1 flex items-center justify-center border-2 border-dashed border-white/5 rounded-xl text-textMuted/50 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => openAdd(day)}>
                      <CalendarClock size={20} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editBlock ? 'Edit Block' : 'Add Timetable Block'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-textMuted uppercase tracking-wider mb-2">Subject *</label>
            <input className="input" placeholder="e.g. Linear Algebra" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-textMuted uppercase tracking-wider mb-2">Day</label>
              <select className="input" value={form.day} onChange={e => setForm({ ...form, day: e.target.value })}>
                {DAYS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-textMuted uppercase tracking-wider mb-2">Location</label>
              <input className="input" placeholder="e.g. Room 302" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-textMuted uppercase tracking-wider mb-2">Start Time</label>
              <input className="input" type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs font-bold text-textMuted uppercase tracking-wider mb-2">End Time</label>
              <input className="input" type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-textMuted uppercase tracking-wider mb-2">Color Label</label>
            <div className="flex gap-3">
              {COLORS.map(c => (
                <button type="button" key={c} onClick={() => setForm({ ...form, color: c })}
                  className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                  style={{ backgroundColor: c, borderColor: form.color === c ? 'white' : 'transparent', boxShadow: form.color === c ? `0 0 15px ${c}` : 'none' }} 
                />
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full mt-2">{editBlock ? 'Update' : 'Save Block'}</button>
        </form>
      </Modal>
    </div>
  );
}
