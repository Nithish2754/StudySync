import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, Edit2, Pin, PinOff, FileText } from 'lucide-react';
import API from '../utils/api';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import Loader from '../components/ui/Loader';

const COLORS = ['#7c3aed', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
const emptyForm = { title: '', content: '', subject: 'General', color: '#7c3aed', isPinned: false };

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');

  const fetchNotes = async () => {
    try {
      const res = await API.get(`/notes${search ? `?search=${search}` : ''}`);
      setNotes(res.data.notes);
    } catch (_) { setNotes([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetchNotes(); }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editNote) { await API.put(`/notes/${editNote._id}`, form); toast.success('Note updated'); } 
      else { await API.post('/notes', form); toast.success('Note saved'); }
      setModal(false); fetchNotes();
    } catch (err) { toast.error('Failed to save note'); }
  };

  const deleteNote = async (id) => {
    if(!confirm('Delete this note?')) return;
    try { await API.delete(`/notes/${id}`); setNotes(n => n.filter(nt => nt._id !== id)); } catch (_) {}
  };

  const togglePin = async (note) => {
    try { await API.put(`/notes/${note._id}`, { isPinned: !note.isPinned }); fetchNotes(); } catch (_) {}
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-display font-black text-white tracking-tight mb-2">Notebook</h1>
          <p className="text-textSecondary">Distraction-free active recall space.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
            <input className="input pl-10 w-64 bg-bgSecondary/50 border-white/5" placeholder="Search notes..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={() => { setEditNote(null); setForm(emptyForm); setModal(true); }}>
            <Plus size={18} /> Compose
          </button>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-textMuted">
          <FileText size={48} className="mb-4 opacity-20" />
          <p>Your notebook is empty. Time to capture some ideas.</p>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence>
            {notes.map((note, i) => (
              <motion.div key={note._id}
                layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="break-inside-avoid glass-card p-6 border-white/5 group relative hover:border-white/20 transition-all paper-texture"
                style={{ backgroundColor: `${note.color}0a` }}
              >
                <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: note.color }} />
                
                {note.isPinned && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-bgCard border border-white/10 flex items-center justify-center shadow-lg" style={{ color: note.color }}>
                    <Pin size={14} className="rotate-45 fill-current" />
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md bg-white/5" style={{ color: note.color }}>
                    {note.subject}
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                    <button onClick={() => togglePin(note)} className="p-1.5 rounded-lg text-textSecondary hover:text-white hover:bg-white/10"><PinOff size={14} /></button>
                    <button onClick={() => { setEditNote(note); setForm(note); setModal(true); }} className="p-1.5 rounded-lg text-textSecondary hover:text-white hover:bg-white/10"><Edit2 size={14} /></button>
                    <button onClick={() => deleteNote(note._id)} className="p-1.5 rounded-lg text-textSecondary hover:text-red-400 hover:bg-red-500/10"><Trash2 size={14} /></button>
                  </div>
                </div>

                <h3 className="text-xl font-display font-black text-white mb-3 leading-tight">{note.title}</h3>
                
                <div className="prose prose-invert prose-sm max-w-none text-textSecondary/90 font-medium leading-relaxed">
                  {note.content ? (
                    <p className="whitespace-pre-wrap">{note.content}</p>
                  ) : (
                    <span className="italic opacity-50">Empty note...</span>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 text-[10px] font-bold text-textMuted uppercase tracking-widest flex items-center gap-2">
                  <Clock size={12} /> {new Date(note.updatedAt).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editNote ? 'Edit Entry' : 'New Notebook Entry'} maxWidth={600}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-textMuted uppercase tracking-wider mb-2">Title</label>
            <input className="input text-lg font-display font-bold" placeholder="Give it a clear title..." value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          </div>
          <div>
            <label className="block text-xs font-bold text-textMuted uppercase tracking-wider mb-2">Context/Subject</label>
            <input className="input" placeholder="e.g. Neuroscience 101" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold text-textMuted uppercase tracking-wider mb-2">Content</label>
            <textarea className="input font-mono text-sm leading-relaxed" rows={8} placeholder="Start typing in markdown..." value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold text-textMuted uppercase tracking-wider mb-2">Tag Color</label>
            <div className="flex gap-3">
              {COLORS.map(c => (
                <button type="button" key={c} onClick={() => setForm({ ...form, color: c })}
                  className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                  style={{ backgroundColor: c, borderColor: form.color === c ? 'white' : 'transparent', boxShadow: form.color === c ? `0 0 15px ${c}` : 'none' }} 
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" id="pinNote" checked={form.isPinned} onChange={e => setForm({...form, isPinned: e.target.checked})} className="rounded bg-bgSecondary border-white/10 text-accentPurple focus:ring-accentPurple" />
            <label htmlFor="pinNote" className="text-sm font-bold text-textSecondary cursor-pointer">Pin to top</label>
          </div>
          <button type="submit" className="btn btn-primary w-full mt-4">{editNote ? 'Save Revisions' : 'Publish to Notebook'}</button>
        </form>
      </Modal>
    </div>
  );
}
