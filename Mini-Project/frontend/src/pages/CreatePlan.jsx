import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { createPlan } from '../services/api';

const DIFFICULTY_OPTIONS = ['easy', 'medium', 'hard'];

function CreatePlan() {
  const navigate = useNavigate();
  const [examDate, setExamDate] = useState('');
  const [dailyHours, setDailyHours] = useState(4);
  const [subjects, setSubjects] = useState([
    {
      name: '',
      units: [{ unitName: '', difficulty: 'medium' }],
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const addSubject = () => {
    setSubjects([...subjects, { name: '', units: [{ unitName: '', difficulty: 'medium' }] }]);
  };

  const removeSubject = (sIdx) => {
    setSubjects(subjects.filter((_, i) => i !== sIdx));
  };

  const updateSubjectName = (sIdx, val) => {
    const updated = [...subjects];
    updated[sIdx].name = val;
    setSubjects(updated);
  };

  const addUnit = (sIdx) => {
    const updated = [...subjects];
    updated[sIdx].units.push({ unitName: '', difficulty: 'medium' });
    setSubjects(updated);
  };

  const removeUnit = (sIdx, uIdx) => {
    const updated = [...subjects];
    updated[sIdx].units = updated[sIdx].units.filter((_, i) => i !== uIdx);
    setSubjects(updated);
  };

  const updateUnit = (sIdx, uIdx, field, val) => {
    const updated = [...subjects];
    updated[sIdx].units[uIdx][field] = val;
    setSubjects(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate
    for (const sub of subjects) {
      if (!sub.name.trim()) {
        setError('Please fill all subject names');
        setLoading(false);
        return;
      }
      for (const unit of sub.units) {
        if (!unit.unitName.trim()) {
          setError('Please fill all unit names');
          setLoading(false);
          return;
        }
      }
    }

    try {
      await createPlan({ examDate, dailyHours: Number(dailyHours), subjects });
      setSuccess('🎉 Study plan created successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create plan');
    }
    setLoading(false);
  };

  const difficultyColors = { easy: '#10b981', medium: '#f59e0b', hard: '#ef4444' };

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: '32px 24px', maxWidth: 760 }}>
        <h1 className="page-title">📅 Create Study Plan</h1>
        <p className="page-subtitle">Enter your subjects, units, and difficulty level</p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Exam details */}
          <div className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 20, fontFamily: 'Syne, sans-serif' }}>📋 Exam Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Exam Date</label>
                <input
                  type="date"
                  value={examDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setExamDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Daily Study Hours</label>
                <input
                  type="number"
                  min={1}
                  max={16}
                  value={dailyHours}
                  onChange={(e) => setDailyHours(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Subjects */}
          {subjects.map((subject, sIdx) => (
            <div key={sIdx} className="card" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 18 }}>
                  Subject {sIdx + 1}
                </h3>
                {subjects.length > 1 && (
                  <button type="button" className="btn btn-danger" style={{ padding: '6px 12px', fontSize: 13 }}
                    onClick={() => removeSubject(sIdx)}>
                    🗑 Remove
                  </button>
                )}
              </div>

              <div className="form-group">
                <label>Subject Name</label>
                <input
                  type="text"
                  placeholder="e.g. Operating Systems, DBMS"
                  value={subject.name}
                  onChange={(e) => updateSubjectName(sIdx, e.target.value)}
                  required
                />
              </div>

              {/* Units */}
              <div>
                <label style={{ marginBottom: 12 }}>Units</label>
                {subject.units.map((unit, uIdx) => (
                  <div key={uIdx} style={{
                    display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center',
                    background: 'var(--bg-primary)', padding: '12px 14px', borderRadius: 10,
                  }}>
                    <input
                      type="text"
                      placeholder={`Unit ${uIdx + 1} name`}
                      value={unit.unitName}
                      onChange={(e) => updateUnit(sIdx, uIdx, 'unitName', e.target.value)}
                      style={{ flex: 2 }}
                      required
                    />
                    <select
                      value={unit.difficulty}
                      onChange={(e) => updateUnit(sIdx, uIdx, 'difficulty', e.target.value)}
                      style={{
                        flex: 1,
                        color: difficultyColors[unit.difficulty],
                        fontWeight: 700,
                      }}
                    >
                      {DIFFICULTY_OPTIONS.map((d) => (
                        <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                      ))}
                    </select>
                    {subject.units.length > 1 && (
                      <button type="button" onClick={() => removeUnit(sIdx, uIdx)}
                        style={{
                          background: 'var(--danger-soft)', color: 'var(--danger)',
                          border: 'none', borderRadius: 6, padding: '6px 10px',
                          cursor: 'pointer', fontWeight: 700, fontSize: 16,
                        }}>
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: 13, marginTop: 6 }}
                  onClick={() => addUnit(sIdx)}>
                  + Add Unit
                </button>
              </div>
            </div>
          ))}

          <button type="button" className="btn btn-outline" style={{ marginBottom: 24, width: '100%', justifyContent: 'center' }}
            onClick={addSubject}>
            + Add Another Subject
          </button>

          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', fontSize: 16, padding: '14px' }}>
            {loading ? '⏳ Creating Plan...' : '🚀 Generate Study Plan'}
          </button>
        </form>
      </div>
    </>
  );
}

export default CreatePlan;