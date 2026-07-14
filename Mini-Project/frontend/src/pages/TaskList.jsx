import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import ProgressBar from '../components/ProgressBar';
import { getPlan, rescheduleTasks } from '../services/api';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all'); // all | pending | completed
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const res = await getPlan();
      setTasks(res.data.tasks);
    } catch {
      // No plan
    }
    setLoading(false);
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleReschedule = async () => {
    try {
      const res = await rescheduleTasks();
      setMessage(res.data.message);
      fetchTasks();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error rescheduling');
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return t.status === 'pending';
    if (filter === 'completed') return t.status === 'completed';
    return true;
  });

  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  // Group tasks by date
  const grouped = {};
  filteredTasks.forEach((task) => {
    const date = new Date(task.date).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric',
    });
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(task);
  });

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-secondary)' }}>
          ⏳ Loading tasks...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: '32px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <h1 className="page-title">📋 All Tasks</h1>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: 13 }}
              onClick={() => navigate('/create-plan')}>
              🔄 New Plan
            </button>
            <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}
              onClick={handleReschedule}>
              ⏩ Reschedule Overdue
            </button>
          </div>
        </div>
        <p className="page-subtitle">{tasks.length} total tasks</p>

        {message && <div className="alert alert-success">{message}</div>}

        {/* Progress */}
        {tasks.length > 0 && (
          <div className="card" style={{ marginBottom: 24 }}>
            <ProgressBar completed={completedCount} total={tasks.length} />
          </div>
        )}

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {['all', 'pending', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 20px',
                borderRadius: 99,
                border: '1.5px solid',
                borderColor: filter === f ? 'var(--accent)' : 'var(--border)',
                background: filter === f ? 'var(--accent-soft)' : 'transparent',
                color: filter === f ? 'var(--accent)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 13,
                fontFamily: 'Space Grotesk, sans-serif',
                transition: 'all 0.2s',
                textTransform: 'capitalize',
              }}
            >
              {f === 'all' ? `All (${tasks.length})` :
               f === 'completed' ? `✅ Completed (${completedCount})` :
               `⏳ Pending (${tasks.length - completedCount})`}
            </button>
          ))}
        </div>

        {/* Task Groups */}
        {Object.keys(grouped).length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <p style={{ color: 'var(--text-secondary)' }}>
              {tasks.length === 0
                ? 'No study plan found. Create one first!'
                : 'No tasks match this filter.'}
            </p>
            {tasks.length === 0 && (
              <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/create-plan')}>
                Create Plan
              </button>
            )}
          </div>
        ) : (
          Object.entries(grouped).map(([date, dateTasks]) => (
            <div key={date} style={{ marginBottom: 28 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12,
              }}>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, color: 'var(--text-secondary)' }}>
                  📅 {date}
                </h3>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {dateTasks.filter((t) => t.status === 'completed').length}/{dateTasks.length} done
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {dateTasks.map((task) => (
                  <TaskCard key={task._id} task={task} onUpdate={fetchTasks} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default TaskList;