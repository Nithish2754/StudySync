import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { User, Settings, Lock, Save, Sparkles } from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('profile');
  const [saving, setSaving] = useState(false);

  const [profileForm, setProfileForm] = useState({ name: user?.name || '', bio: user?.bio || '', studyGoal: user?.studyGoal || 8 });
  const [pomForm, setPomForm] = useState({ focusDuration: user?.pomodoroSettings?.focusDuration || 25, shortBreak: user?.pomodoroSettings?.shortBreak || 5, longBreak: user?.pomodoroSettings?.longBreak || 15, longBreakInterval: user?.pomodoroSettings?.longBreakInterval || 4 });
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });

  const saveProfile = async (e) => {
    e.preventDefault(); setSaving(true);
    try { const res = await API.put('/profile', profileForm); updateUser(res.data.user); toast.success('Profile updated!'); } 
    catch (err) { toast.error('Failed to update'); } finally { setSaving(false); }
  };

  const savePomSettings = async (e) => {
    e.preventDefault(); setSaving(true);
    try { const res = await API.put('/profile', { pomodoroSettings: pomForm }); updateUser(res.data.user); toast.success('Timer settings saved!'); } 
    catch (err) { toast.error('Failed to save settings'); } finally { setSaving(false); }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirm) return toast.error('Passwords mismatch');
    setSaving(true);
    try { await API.put('/profile/password', { currentPassword: pwdForm.currentPassword, newPassword: pwdForm.newPassword }); toast.success('Password changed'); setPwdForm({ currentPassword: '', newPassword: '', confirm: '' }); } 
    catch (err) { toast.error('Failed to change password'); } finally { setSaving(false); }
  };

  const tabs = [
    { id: 'profile', label: 'Identity', icon: User },
    { id: 'pomodoro', label: 'Timer Config', icon: Settings },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-display font-black text-white tracking-tight mb-2">Settings</h1>
        <p className="text-textSecondary">Manage your system preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar Profile Card */}
        <motion.div className="w-full md:w-80 shrink-0 glass-card p-8 border-white/5 rounded-[32px] text-center relative overflow-hidden" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-accentPurple/20 rounded-full blur-[50px] pointer-events-none" />
          
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-accentPurple to-neonBlue flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.3)] mb-6">
            <Sparkles size={32} className="text-white" />
          </div>
          <h2 className="font-display font-black text-2xl text-white mb-1">{user?.name}</h2>
          <p className="text-xs font-bold text-textMuted uppercase tracking-widest mb-8">{user?.email}</p>

          <div className="space-y-3">
            {[
              { label: 'Longest Streak', value: `${user?.streak?.longest || 0}d` },
              { label: 'Total Focus', value: `${(user?.totalStudyHours || 0).toFixed(1)}h` }
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-bgSecondary/50 border border-white/5">
                <span className="text-xs font-bold text-textSecondary uppercase">{s.label}</span>
                <span className="font-bold text-white">{s.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 w-full">
          {/* Tab Nav */}
          <div className="flex gap-2 mb-8 p-1.5 rounded-2xl bg-bgSecondary/50 border border-white/5 inline-flex backdrop-blur-sm">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${tab === t.id ? 'bg-bgCard text-white shadow-lg border border-white/10' : 'text-textMuted hover:text-white'}`}
              >
                <t.icon size={16} /> {t.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-card p-8 border-white/5 rounded-[32px]">
              
              {tab === 'profile' && (
                <form onSubmit={saveProfile} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-textMuted uppercase tracking-wider mb-2">Display Name</label>
                    <input className="input" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-textMuted uppercase tracking-wider mb-2">Email Address (Locked)</label>
                    <input className="input opacity-50 cursor-not-allowed" value={user?.email} disabled />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-textMuted uppercase tracking-wider mb-2">Bio / Current Focus</label>
                    <textarea className="input" rows={3} value={profileForm.bio} onChange={e => setProfileForm({...profileForm, bio: e.target.value})} />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={saving}><Save size={16} /> {saving ? 'Syncing...' : 'Save Identity'}</button>
                </form>
              )}

              {tab === 'pomodoro' && (
                <form onSubmit={savePomSettings} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { key: 'focusDuration', label: 'Focus Block (min)', min: 10, max: 90 },
                      { key: 'shortBreak', label: 'Short Rest (min)', min: 1, max: 15 },
                      { key: 'longBreak', label: 'Long Rest (min)', min: 10, max: 60 },
                      { key: 'longBreakInterval', label: 'Blocks before Long Rest', min: 2, max: 8 },
                    ].map(({ key, label, min, max }) => (
                      <div key={key}>
                        <label className="block text-xs font-bold text-textMuted uppercase tracking-wider mb-2">{label}</label>
                        <input className="input" type="number" min={min} max={max} value={pomForm[key]} onChange={e => setPomForm({...pomForm, [key]: Number(e.target.value)})} />
                      </div>
                    ))}
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={saving}><Save size={16} /> {saving ? 'Syncing...' : 'Save Timer Config'}</button>
                </form>
              )}

              {tab === 'security' && (
                <form onSubmit={changePassword} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-textMuted uppercase tracking-wider mb-2">Current Password</label>
                    <input className="input" type="password" value={pwdForm.currentPassword} onChange={e => setPwdForm({...pwdForm, currentPassword: e.target.value})} required />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-textMuted uppercase tracking-wider mb-2">New Password</label>
                      <input className="input" type="password" value={pwdForm.newPassword} onChange={e => setPwdForm({...pwdForm, newPassword: e.target.value})} required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-textMuted uppercase tracking-wider mb-2">Confirm Password</label>
                      <input className="input" type="password" value={pwdForm.confirm} onChange={e => setPwdForm({...pwdForm, confirm: e.target.value})} required />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={saving}><Lock size={16} /> {saving ? 'Verifying...' : 'Update Security'}</button>
                </form>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
