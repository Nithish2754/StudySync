import { motion } from 'framer-motion';

export default function Loader({ fullScreen = false, size = 40 }) {
  const spinner = (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      style={{
        width: size, height: size, borderRadius: '50%',
        border: `3px solid rgba(109,40,217,0.2)`,
        borderTopColor: '#6d28d9',
      }}
    />
  );

  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-primary)', flexDirection: 'column', gap: 16, zIndex: 9999
      }}>
        {spinner}
        <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Loading StudySync...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      {spinner}
    </div>
  );
}
