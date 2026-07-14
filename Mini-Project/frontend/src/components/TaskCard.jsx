import { updateTask } from '../services/api';
import { useState } from 'react';

function TaskCard({ task, onUpdate }) {
  const [loading, setLoading] = useState(false);

  const toggleStatus = async () => {
    setLoading(true);
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await updateTask(task._id, { status: newStatus });
      onUpdate();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const isCompleted = task.status === 'completed';
  const dateStr = new Date(task.date).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: `1.5px solid ${isCompleted ? 'var(--success)' : 'var(--border)'}`,
        borderRadius: 14,
        padding: '18px 22px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        transition: 'all 0.25s ease',
        opacity: isCompleted ? 0.75 : 1,
        cursor: 'pointer',
        boxShadow: isCompleted ? 'none' : 'var(--shadow)',
      }}
      onClick={toggleStatus}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = isCompleted ? 'none' : 'var(--shadow)';
      }}
    >
      {/* Checkbox */}
      <div style={{
        width: 24,
        height: 24,
        borderRadius: 6,
        border: `2px solid ${isCompleted ? 'var(--success)' : 'var(--border)'}`,
        background: isCompleted ? 'var(--success)' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'all 0.2s',
      }}>
        {isCompleted && <span style={{ color: 'white', fontSize: 14, fontWeight: 700 }}>✓</span>}
        {loading && <span style={{ fontSize: 10 }}>⏳</span>}
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{
            fontWeight: 700,
            fontSize: 15,
            color: 'var(--text-primary)',
            textDecoration: isCompleted ? 'line-through' : 'none',
          }}>
            {task.subject}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>—</span>
          <span style={{
            fontSize: 14,
            color: 'var(--text-secondary)',
            textDecoration: isCompleted ? 'line-through' : 'none',
          }}>
            {task.unit}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>📅 {dateStr}</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>⏱ {task.duration}h</span>
        </div>
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', gap: 6 }}>
        <span className={`badge badge-${task.difficulty}`}>{task.difficulty}</span>
        <span className={`badge badge-${task.status}`}>{task.status}</span>
      </div>
    </div>
  );
}

export default TaskCard;