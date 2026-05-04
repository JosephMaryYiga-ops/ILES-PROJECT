import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function ReviewLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewing, setReviewing] = useState(null);
  const [comment, setComment] = useState('');
  const [score, setScore] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await api.get('/logs/');
      // Only show submitted logs
      setLogs(response.data.filter(log => log.status === 'submitted'));
    } catch (err) {
      setError('Failed to load logs.');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (logId) => {
    setSubmitLoading(true);
    setError('');
    try {
      await api.post('/reviews/', {
        log: logId,
        comments: comment,
        score: parseFloat(score),
      });
      setSuccess('Review submitted successfully!');
      setReviewing(null);
      setComment('');
      setScore('');
      fetchLogs();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit review.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <h2 style={styles.navTitle}>ILES</h2>
        <div style={styles.navLinks}>
          <span style={styles.navLink} onClick={() => navigate('/supervisor')}>Dashboard</span>
          <span style={styles.navLinkActive}>Review Logs</span>
          <span style={styles.navLink} onClick={handleLogout}>Logout</span>
        </div>
      </div>

      <div style={styles.container}>
        <h1 style={styles.title}>Logs Waiting for Review</h1>

        {success && <div style={styles.success}>{success}</div>}
        {error && <div style={styles.error}>{error}</div>}
        {loading && <p style={styles.loading}>Loading logs...</p>}

        {!loading && logs.length === 0 && (
          <div style={styles.empty}>
            <p>No logs waiting for review right now.</p>
          </div>
        )}

        <div style={styles.logList}>
          {logs.map(log => (
            <div key={log.id} style={styles.logCard}>
              <div style={styles.logHeader}>
                <div>
                  <h3 style={styles.weekTitle}>Week {log.week_number}</h3>
                  <p style={styles.studentName}>Student: {log.student_name}</p>
                </div>
                <span style={styles.badge}>SUBMITTED</span>
              </div>

              <p style={styles.logContent}>{log.content}</p>

              {/* Review Form */}
              {reviewing === log.id ? (
                <div style={styles.reviewForm}>
                  <h4 style={styles.reviewTitle}>Write Your Review</h4>
                  <textarea
                    style={styles.textarea}
                    placeholder="Write your feedback and comments..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                  />
                  <div style={styles.scoreRow}>
                    <label style={styles.label}>Score (0-10):</label>
                    <input
                      style={styles.scoreInput}
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      placeholder="e.g. 8.5"
                      value={score}
                      onChange={(e) => setScore(e.target.value)}
                    />
                  </div>
                  <div style={styles.reviewButtons}>
                    <button style={styles.cancelBtn} onClick={() => setReviewing(null)}>Cancel</button>
                    <button
                      style={submitLoading ? { ...styles.submitBtn, opacity: 0.7 } : styles.submitBtn}
                      onClick={() => handleReview(log.id)}
                      disabled={submitLoading}
                    >
                      {submitLoading ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </div>
                </div>
              ) : (
                <button style={styles.reviewBtn} onClick={() => setReviewing(log.id)}>
                  Write Review
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#f0f4f8', fontFamily: 'Arial, sans-serif' },
  navbar: { backgroundColor: '#1F4E79', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' },
  navTitle: { color: '#fff', margin: 0, fontSize: '22px', fontWeight: 'bold' },
  navLinks: { display: 'flex', gap: '24px' },
  navLink: { color: '#a8c8e8', cursor: 'pointer', fontSize: '14px' },
  navLinkActive: { color: '#ffffff', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', borderBottom: '2px solid #fff', paddingBottom: '4px' },
  container: { maxWidth: '900px', margin: '0 auto', padding: '32px 16px' },
  title: { color: '#1F4E79', marginBottom: '24px' },
  success: { backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px' },
  error: { backgroundColor: '#ffebee', color: '#c62828', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px' },
  loading: { color: '#666', textAlign: 'center' },
  empty: { textAlign: 'center', padding: '60px', color: '#666' },
  logList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  logCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  logHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
  weekTitle: { margin: '0 0 4px 0', color: '#1F4E79', fontSize: '18px' },
  studentName: { margin: 0, color: '#666', fontSize: '14px' },
  badge: { backgroundColor: '#2196f3', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  logContent: { color: '#444', lineHeight: '1.6', marginBottom: '16px' },
  reviewForm: { backgroundColor: '#f5f9ff', padding: '20px', borderRadius: '8px', border: '1px solid #dde8f5' },
  reviewTitle: { margin: '0 0 12px 0', color: '#1F4E79' },
  textarea: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' },
  scoreRow: { display: 'flex', alignItems: 'center', gap: '12px', margin: '12px 0' },
  label: { fontWeight: '600', fontSize: '14px', color: '#333' },
  scoreInput: { padding: '8px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', width: '100px' },
  reviewButtons: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' },
  cancelBtn: { padding: '10px 20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff', cursor: 'pointer' },
  submitBtn: { padding: '10px 20px', backgroundColor: '#1F4E79', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  reviewBtn: { backgroundColor: '#1F4E79', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
};

export default ReviewLogs;