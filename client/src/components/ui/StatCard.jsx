import { motion } from 'framer-motion';

export default function StatCard({ icon, label, value, color = '#6d28d9', suffix = '' }) {
  return (
    <motion.div
      className="glass-card stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: `${color}22`, border: `1px solid ${color}44`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 16, fontSize: 22
      }}>
        {icon}
      </div>
      <div className="stat-value" style={{ color: color }}>{value}{suffix}</div>
      <div className="stat-label">{label}</div>
    </motion.div>
  );
}
