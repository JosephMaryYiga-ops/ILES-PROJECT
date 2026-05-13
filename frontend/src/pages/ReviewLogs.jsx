import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';

function ReviewLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(null);
  const [comment, setComment] = useState('');
  const [score, setScore] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchLogs(); }, []);

  const fetchLogs = async () => {
    try {
      const r = await api.get('/logs/');
      setLogs(r.data.filter(l => l.status === 'submitted'));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleReview = async (logId) => {
    setError('');
    try {
      await api.post('/reviews/', { log: logId, comments: comment, score: parseFloat(score) });
      setSuccess('Review submitted!');
      setReviewing(null); setComment(''); setScore('');
      fetchLogs();
    } catch (err) { setError(err.response?.data?.detail || 'Failed to submit review.'); }
  };

  return (
    <div style={S.page}>
      <Navbar active="review" />
      <div style={S.container}>
        <h1 style={S.title}>Review Logs</h1>
        {success && <div style={S.success}>{success}</div>}
        {error && <div style={S.error}>{error}</div>}
        {loading && <p style={S.loading}>Loading...</p>}
        {!loading && logs.length === 0 && <div style={S.emptyBox}><p style={S.emptyText}>No logs waiting for review right now.</p></div>}

        <div style={S.list}>
          {logs.map(log => (
            <div key={log.id} style={S.card}>
              <div style={S.cardTop}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={S.weekCircle}>W{log.week_number}</div>
                  <div>
                    <h3 style={S.weekTitle}>Week {log.week_number}</h3>
                    <p style={S.studentName}>Student: {log.student_name}</p>
                  </div>
                </div>
                <span style={S.badge}>SUBMITTED</span>
              </div>
              <p style={S.content}>{log.content}</p>

              {reviewing === log.id ? (
                <div style={S.reviewForm}>
                  <h4 style={S.reviewTitle}>Write Your Review</h4>
                  <textarea style={S.textarea} rows={4} placeholder="Write your feedback..." value={comment} onChange={e => setComment(e.target.value)} />
                  <div style={S.scoreRow}>
                    <label style={S.label}>Score (0–10):</label>
                    <input style={S.scoreInput} type="number" min="0" max="10" step="0.5" placeholder="e.g. 8.5" value={score} onChange={e => setScore(e.target.value)} />
                  </div>
                  <div style={S.reviewBtns}>
                    <button style={S.cancelBtn} onClick={() => setReviewing(null)}>Cancel</button>
                    <button style={S.submitBtn} onClick={() => handleReview(log.id)}>Submit Review</button>
                  </div>
                </div>
              ) : (
                <button style={S.reviewBtn} onClick={() => setReviewing(log.id)}>Write Review</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { minHeight: '100vh', backgroundColor: '#F5F5F0', fontFamily: 'Arial, sans-serif' },
  container: { maxWidth: '900px', margin: '0 auto', padding: '32px 24px' },
  title: { color: '#1A1A1A', marginBottom: '24px', fontSize: '24px', fontWeight: 'bold' },
  success: { backgroundColor: '#E8F5E9', color: '#2E7D32', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' },
  error: { backgroundColor: '#FFF0F0', color: '#C62828', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' },
  loading: { textAlign: 'center', color: '#999' },
  emptyBox: { textAlign: 'center', padding: '80px 0' },
  emptyText: { color: '#bbb', fontSize: '15px' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  weekCircle: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#E3F2FD', color: '#1565C0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700' },
  weekTitle: { margin: 0, fontSize: '15px', fontWeight: '700', color: '#1A1A1A' },
  studentName: { margin: 0, fontSize: '12px', color: '#999' },
  badge: { backgroundColor: '#E3F2FD', color: '#1565C0', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' },
  content: { color: '#555', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' },
  reviewBtn: { background: 'linear-gradient(135deg, #4A148C, #006064)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '700' },
  reviewForm: { backgroundColor: '#F8F6FF', padding: '20px', borderRadius: '8px', border: '1px solid #E8E0FF' },
  reviewTitle: { margin: '0 0 12px 0', color: '#4A148C', fontSize: '14px', fontWeight: '700' },
  textarea: { width: '100%', padding: '12px', border: '2px solid #E8E8E8', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' },
  scoreRow: { display: 'flex', alignItems: 'center', gap: '12px', margin: '12px 0' },
  label: { fontWeight: '700', fontSize: '13px', color: '#555' },
  scoreInput: { padding: '8px 12px', border: '2px solid #E8E8E8', borderRadius: '8px', fontSize: '14px', width: '100px' },
  reviewBtns: { display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '12px' },
  cancelBtn: { padding: '10px 20px', border: '2px solid #E8E8E8', borderRadius: '8px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '13px', color: '#666' },
  submitBtn: { padding: '10px 20px', background: 'linear-gradient(135deg, #4A148C, #006064)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '700' },
};

export default ReviewLogs;