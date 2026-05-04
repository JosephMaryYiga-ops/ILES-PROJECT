import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function WeeklyLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await api.get('/logs/');
      setLogs(response.data);
    } catch (err) {
      setError('Failed to load logs.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return '#ff9800';
      case 'submitted': return '#2196f3';
      case 'reviewed': return '#9c27b0';
      case 'approved': return '#4caf50';
      default: return '#999';
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h2 style={styles.navTitle}>ILES</h2>
        <div style={styles.navLinks}>
          <span style={styles.navLink} onClick={() => navigate('/student')}>Dashboard</span>
          <span style={styles.navLinkActive}>My Logs</span>
          <span style={styles.navLink} onClick={() => navigate('/student/submit')}>Submit Log</span>
          <span style={styles.navLink} onClick={handleLogout}>Logout</span>
        </div>
      </div>

      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>My Weekly Logs</h1>
          <button style={styles.submitBtn} onClick={() => navigate('/student/submit')}>
            + Submit New Log
          </button>
        </div>

        {loading && <p style={styles.loading}>Loading logs...</p>}
        {error && <p style={styles.error}>{error}</p>}

        {!loading && logs.length === 0 && (
          <div style={styles.empty}>
            <p>You have not submitted any logs yet.</p>
            <button style={styles.submitBtn} onClick={() => navigate('/student/submit')}>
              Submit Your First Log
            </button>
          </div>
        )}

        <div style={styles.logList}>
          {logs.map(log => (
            <div key={log.id} style={styles.logCard}>
              <div style={styles.logHeader}>
                <h3 style={styles.weekTitle}>Week {log.week_number}</h3>
                <span style={{ ...styles.statusBadge, backgroundColor: getStatusColor(log.status) }}>
                  {log.status.toUpperCase()}
                </span>
              </div>

              <p style={styles.logContent}>{log.content}</p>

              {log.supervisor_comment && (
                <div style={styles.feedback}>
                  <strong>Supervisor Feedback:</strong>
                  <p style={styles.feedbackText}>{log.supervisor_comment}</p>
                </div>
              )}

              <div style={styles.logFooter}>
                <span style={styles.date}>
                  {log.submission_date
                    ? `Submitted: ${new Date(log.submission_date).toLocaleDateString()}`
                    : `Created: ${new Date(log.created_at).toLocaleDateString()}`}
                </span>
              </div>
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
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { color: '#1F4E79', margin: 0 },
  submitBtn: { backgroundColor: '#1F4E79', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
  loading: { color: '#666', textAlign: 'center' },
  error: { color: '#c62828', backgroundColor: '#ffebee', padding: '12px', borderRadius: '8px' },
  empty: { textAlign: 'center', padding: '60px', color: '#666' },
  logList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  logCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  logHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  weekTitle: { margin: 0, color: '#1F4E79', fontSize: '18px' },
  statusBadge: { color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  logContent: { color: '#444', lineHeight: '1.6', marginBottom: '12px' },
  feedback: { backgroundColor: '#e8f5e9', padding: '12px 16px', borderRadius: '8px', marginBottom: '12px' },
  feedbackText: { margin: '6px 0 0 0', color: '#2e7d32' },
  logFooter: { borderTop: '1px solid #eee', paddingTop: '10px' },
  date: { color: '#999', fontSize: '13px' },
};

export default WeeklyLogs;