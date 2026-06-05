import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

function ReviewLogs() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [reviewData, setReviewData] = useState({
    comments: '',
    score: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPendingLogs();
  }, []);

  const fetchPendingLogs = async () => {
    try {
      const response = await api.get('/logs/?status=submitted');
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (logId) => {
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await api.post(`/reviews/`, {
        log: logId,
        comments: reviewData.comments,
        score: parseFloat(reviewData.score)
      });
      
      toast.success('Review submitted successfully!');
      setSelectedLog(null);
      setReviewData({ comments: '', score: '' });
      fetchPendingLogs();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'submitted': return '#1565C0';
      default: return '#999';
    }
  };

  if (loading) return (
    <div style={styles.page}>
      <Navbar active="review" />
      <div style={styles.container}>Loading...</div>
    </div>
  );

  return (
    <div style={styles.page}>
      <Navbar active="review" />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Review Weekly Logs</h1>
          <p style={styles.subtitle}>Review and score student internship logs</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        {logs.length === 0 ? (
          <div style={styles.empty}>No pending logs to review.</div>
        ) : (
          <div style={styles.grid}>
            {logs.map((log) => (
              <div key={log.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <span style={styles.weekNumber}>Week {log.week_number}</span>
                    <span style={styles.studentName}>{log.student?.username || 'Student'}</span>
                  </div>
                  <span style={{...styles.statusBadge, backgroundColor: getStatusColor(log.status)}}>
                    {log.status.toUpperCase()}
                  </span>
                </div>

                <div style={styles.cardContent}>
                  <div style={styles.infoRow}>
                    <strong>Placement:</strong> {log.placement?.company_name || 'N/A'}
                  </div>
                  <div style={styles.infoRow}>
                    <strong>Submitted:</strong> {new Date(log.created_at).toLocaleDateString()}
                  </div>
                  <div style={styles.logContent}>
                    <strong>Log Content:</strong>
                    <p>{log.content}</p>
                  </div>
                </div>

                {selectedLog === log.id ? (
                  <div style={styles.reviewForm}>
                    <h4>Submit Review</h4>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Comments / Feedback *</label>
                      <textarea
                        style={styles.textarea}
                        rows="4"
                        placeholder="Provide feedback on the student's work..."
                        value={reviewData.comments}
                        onChange={(e) => setReviewData({...reviewData, comments: e.target.value})}
                        required
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Score (0-10) *</label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="10"
                        style={styles.input}
                        value={reviewData.score}
                        onChange={(e) => setReviewData({...reviewData, score: e.target.value})}
                        required
                      />
                    </div>
                    <div style={styles.buttonGroup}>
                      <button 
                        style={styles.cancelButton} 
                        onClick={() => {
                          setSelectedLog(null);
                          setReviewData({ comments: '', score: '' });
                        }}
                      >
                        Cancel
                      </button>
                      <button 
                        style={styles.submitButton} 
                        onClick={() => handleReview(log.id)}
                        disabled={submitting || !reviewData.comments || !reviewData.score}
                      >
                        {submitting ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={styles.cardFooter}>
                    <button 
                      style={styles.reviewButton} 
                      onClick={() => setSelectedLog(log.id)}
                    >
                      Review Log
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#F5F5F0' },
  container: { maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' },
  header: { marginBottom: '32px' },
  title: { fontSize: '28px', fontWeight: 'bold', color: '#1A1A1A', margin: '0 0 8px 0' },
  subtitle: { color: '#666', fontSize: '14px', margin: 0 },
  error: { backgroundColor: '#fff0f0', border: '1px solid #ffcdd2', color: '#c62828', padding: '12px', borderRadius: '8px', marginBottom: '20px' },
  success: { backgroundColor: '#e8f5e9', border: '1px solid #a5d6a7', color: '#2e7d32', padding: '12px', borderRadius: '8px', marginBottom: '20px' },
  empty: { textAlign: 'center', padding: '60px', backgroundColor: '#fff', borderRadius: '12px', color: '#999' },
  grid: { display: 'flex', flexDirection: 'column', gap: '20px' },
  card: { backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  cardHeader: { padding: '16px 20px', backgroundColor: '#fafafa', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  weekNumber: { fontSize: '16px', fontWeight: 'bold', color: '#333' },
  studentName: { fontSize: '13px', color: '#666', marginLeft: '12px' },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', color: '#fff' },
  cardContent: { padding: '20px' },
  infoRow: { fontSize: '13px', color: '#666', marginBottom: '8px' },
  logContent: { marginTop: '16px', padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '8px' },
  reviewForm: { padding: '20px', borderTop: '1px solid #eee', backgroundColor: '#f9f9f9' },
  formGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '8px' },
  textarea: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box', resize: 'vertical' },
  input: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
  buttonGroup: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' },
  cancelButton: { padding: '10px 20px', backgroundColor: '#f5f5f5', color: '#666', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  submitButton: { padding: '10px 20px', backgroundColor: '#4A148C', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  cardFooter: { padding: '16px 20px', borderTop: '1px solid #eee', backgroundColor: '#fafafa', display: 'flex', justifyContent: 'flex-end' },
  reviewButton: { padding: '8px 20px', backgroundColor: '#4A148C', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
};

export default ReviewLogs;