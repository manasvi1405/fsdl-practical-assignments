import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import ProgressBar from '../components/ProgressBar';
import { getPlan, getTodayTasks, rescheduleTasks } from '../services/api';

function Dashboard() {
  const [todayTasks, setTodayTasks] = useState([]);
  const [plan, setPlan] = useState(null);
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [todayRes, planRes] = await Promise.all([
        getTodayTasks(),
        getPlan(),
      ]);
      setTodayTasks(todayRes.data);
      setPlan(planRes.data.plan);
      setAllTasks(planRes.data.tasks);
    } catch (err) {
      // No plan yet — that's okay
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleReschedule = async () => {
    try {
      const res = await rescheduleTasks();
      setMessage(res.data.message);
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error rescheduling tasks');
    }
  };

  const completedCount = allTasks.filter((t) => t.status === 'completed').length;
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const overdueTasks = allTasks.filter(
    (t) => t.status === 'pending' && new Date(t.date) < new Date().setHours(0, 0, 0, 0)
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--text-secondary)' }}>
          ⏳ Loading your dashboard...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: '32px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 className="page-title">Good day! 👋</h1>
          <p className="page-subtitle">{today}</p>
        </div>

        {message && <div className="alert alert-success">{message}</div>}

        {!plan ? (
          /* No plan yet */
          <div className="card" style={{ textAlign: 'center', padding: '60px 40px' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>📭</div>
            <h2 style={{ marginBottom: 8 }}>No Study Plan Yet</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>
              Create your first study plan to get started!
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/create-plan')}>
              ✨ Create Study Plan
            </button>
          </div>
        ) : (
          <>
            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
              {[
                { label: 'Total Tasks', value: allTasks.length, icon: '📋', color: 'var(--accent)' },
                { label: 'Completed', value: completedCount, icon: '✅', color: 'var(--success)' },
                { label: 'Pending', value: allTasks.length - completedCount, icon: '⏳', color: 'var(--warning)' },
                {
                  label: 'Days Left',
                  value: Math.max(0, Math.ceil((new Date(plan.examDate) - new Date()) / 86400000)),
                  icon: '📅',
                  color: 'var(--danger)',
                },
              ].map((stat) => (
                <div key={stat.label} className="card" style={{ padding: '20px 24px' }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{stat.icon}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="card" style={{ marginBottom: 28 }}>
              <ProgressBar completed={completedCount} total={allTasks.length} />
            </div>

            {/* Overdue warning */}
            {overdueTasks.length > 0 && (
              <div style={{
                background: 'var(--danger-soft)',
                border: '1px solid var(--danger)',
                borderRadius: 12,
                padding: '16px 20px',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span style={{ color: 'var(--danger)', fontWeight: 600 }}>
                  ⚠️ You have {overdueTasks.length} overdue task(s)!
                </span>
                <button className="btn btn-danger" style={{ padding: '8px 16px', fontSize: 13 }} onClick={handleReschedule}>
                  🔄 Reschedule All
                </button>
              </div>
            )}

            {/* Today's Tasks */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 20 }}>📌 Today's Tasks</h2>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{todayTasks.length} tasks</span>
              </div>

              {todayTasks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  🎉 No tasks scheduled for today! Enjoy your day.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {todayTasks.map((task) => (
                    <TaskCard key={task._id} task={task} onUpdate={fetchData} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Dashboard;