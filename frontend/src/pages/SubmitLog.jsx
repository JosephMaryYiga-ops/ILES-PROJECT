import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';

function SubmitLog() {
  const [placements, setPlacements] = useState([]);
  const [placement, setPlacement] = useState('');
  const [weekNumber, setWeekNumber] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/placements/').then(r => { setPlacements(r.data); if (r.data.length > 0) setPlacement(r.data[0].id); });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      const res = await api.post('/logs/', { placement, week_number: parseInt(weekNumber), content });
      await api.post(`/logs/${res.data.id}/submit/`);
      setSuccess('Log submitted successfully!');
      setContent(''); setWeekNumber('');
      setTimeout(() => navigate('/student/logs'), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={S.page}>
      <Navbar active="submit" />
      <div style={S.container}>
        <h1 style={S.title}>Submit Weekly Log</h1>
        <p style={{ color: '#666', fontSize: '13px', marginTop: '-10px', marginBottom: '20px' }}>
           Be honest bossman
        </p>

        {success && <div style={S.success}>{success} Redirecting...</div>}
        {error && <div style={S.error}>{error}</div>}

        <div style={S.card}>
          <form onSubmit={handleSubmit}>
            <div style={S.field}>
              <label style={S.label}>Internship Placement</label>
              <select style={S.input} value={placement} onChange={e => setPlacement(e.target.value)} required>
                {placements.length === 0 && <option>No placement found</option>}
                {placements.map(p => <option key={p.id} value={p.id}>{p.company_name}</option>)}
              </select>
            </div>
            <div style={S.field}>
              <label style={S.label}>Week Number</label>
              <input style={S.input} type="number" min="1" placeholder="e.g. 1" value={weekNumber} onChange={e => setWeekNumber(e.target.value)} required />
            </div>
            <div style={S.field}>
              <label style={S.label}>What did you do this week?</label>
              <textarea style={S.textarea} rows={8} placeholder="Describe your tasks, what you learned, challenges you faced..." value={content} onChange={e => setContent(e.target.value)} required />
              <p style={S.count}>{content.length} characters</p>
            </div>
            <div style={S.btns}>
              <button type="button" style={S.cancelBtn} onClick={() => navigate('/student')}>Cancel</button>
              <button type="submit" style={loading ? { ...S.submitBtn, opacity: 0.7 } : S.submitBtn} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Log'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { minHeight: '100vh', backgroundColor: '#F5F5F0', fontFamily: 'Arial, sans-serif' },
  container: { maxWidth: '700px', margin: '0 auto', padding: '32px 24px' },
  title: { color: '#1A1A1A', marginBottom: '24px', fontSize: '24px', fontWeight: 'bold' },
  success: { backgroundColor: '#E8F5E9', color: '#2E7D32', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #A5D6A7' },
  error: { backgroundColor: '#FFF0F0', color: '#C62828', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #FFCDD2' },
  card: { backgroundColor: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  field: { marginBottom: '20px' },
  label: { display: 'block', fontSize: '11px', fontWeight: '700', color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' },
  input: { width: '100%', padding: '12px 14px', border: '2px solid #E8E8E8', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '12px 14px', border: '2px solid #E8E8E8', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' },
  count: { color: '#bbb', fontSize: '11px', textAlign: 'right', margin: '4px 0 0 0' },
  btns: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' },
  cancelBtn: { padding: '12px 24px', border: '2px solid #E8E8E8', borderRadius: '8px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '14px', color: '#666' },
  submitBtn: { padding: '12px 24px', background: 'linear-gradient(135deg, #2E7D32, #006064)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '700' },
};

export default SubmitLog;