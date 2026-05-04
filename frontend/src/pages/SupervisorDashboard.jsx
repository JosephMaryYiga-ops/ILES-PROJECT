import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function SupervisorDashboard() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const submittedLogs = logs.filter(l => l.status === 'submitted').length;
  const reviewedLogs = logs.filter(l => l.status === 'reviewed').length;
  const approvedLogs = logs.filter(l => l.status === 'approved').length;

  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <h2 style={styles.navTitle}>ILES</h2>
        <div style={styles.navLinks}>
          <span style={styles.navLinkActive}>Dashboard</span>
          <span style={styles.navLink} onClick={() => navigate('/supervisor/review')}>Review Logs</span>
          <span style={styles.navLink} onClick={handleLogout}>Logout</span>
        </div>
      </div>

      <div style={styles.container}>
        {/* Welcome */}
        <div style={styles.welcomeCard}>
          <div>
            <h1 style={styles.welcomeTitle}>Welcome, {username}! 👋</h1>
            <p style={styles.welcomeSub}>Review and provide feedback on student weekly logs.</p>
          </div>
          <button style={styles.reviewBtn} onClick={() => navigate('/supervisor/review')}>
            Review Logs
          </button>
        </div>

        {loading && <p style={styles.loading}>Loading...</p>}

        {/* Stats */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <h2 style={{ ...styles.statNumber, color: '#1F4E79' }}>{logs.length}</h2>
            <p style={styles.statLabel}>Total Logs</p>
          </div>
          <div style={styles.statCard}>
            <h2 style={{ ...styles.statNumber, color: '#2196f3' }}>{submittedLogs}</h2>
            <p style={styles.statLabel}>Waiting for Review</p>
          </div>
          <div style={styles.statCard}>
            <h2 style={{ ...styles.statNumber, color: '#9c27b0' }}>{reviewedLogs}</h2>
            <p style={styles.statLabel}>Reviewed</p>
          </div>
          <div style={styles.statCard}>
            <h2 style={{ ...styles.statNumber, color: '#4caf50' }}>{approvedLogs}</h2>
            <p style={styles.statLabel}>Approved</p>
          </div>
        </div>

        {/* Pending Reviews */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>📋 Logs Waiting for Your Review</h3>
          {logs.filter(l => l.status === 'submitted').length === 0 ? (
            <p style={styles.noData}>No logs waiting for review right now.</p>
          ) : (
            <div>
              {logs.filter(l => l.status === 'submitted').slice(0, 5).map(log => (
                <div key={log.id} style={styles.logItem}>
                  <div>
                    <span style={styles.logWeek}>Week {log.week_number}</span>
                    <span style={styles.studentName}> — {log.student_name}</span>
                  </div>
                  <button
                    style={styles.actionBtn}
                    onClick={() => navigate('/supervisor/review')}
                  >
                    Review
                  </button>
                </div>
              ))}
            </div>
          )}
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
  container: { maxWidth: '1000px', margin: '0 auto', padding: '32px 16px' },
  welcomeCard: { backgroundColor: '#1F4E79', borderRadius: '12px', padding: '32px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  welcomeTitle: { color: '#fff', margin: '0 0 8px 0', fontSize: '24px' },
  welcomeSub: { color: '#a8c8e8', margin: 0, fontSize: '14px' },
  reviewBtn: { backgroundColor: '#fff', color: '#1F4E79', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
  loading: { textAlign: 'center', color: '#666' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  statNumber: { fontSize: '36px', fontWeight: 'bold', margin: '0 0 4px 0' },
  statLabel: { color: '#888', margin: 0, fontSize: '14px' },
  card: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  cardTitle: { margin: '0 0 16px 0', color: '#1F4E79', fontSize: '16px' },
  noData: { color: '#999', textAlign: 'center', padding: '20px 0' },
  logItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f0f0' },
  logWeek: { fontWeight: '600', color: '#333', fontSize: '14px' },
  studentName: { color: '#666', fontSize: '14px' },
  actionBtn: { backgroundColor: '#1F4E79', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
};

export default SupervisorDashboard;