import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function StudentDashboard() {
  const [placement, setPlacement] = useState(null);
  const [logs, setLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [placementRes, logsRes, notifRes] = await Promise.all([
        api.get('/placements/'),
        api.get('/logs/'),
        api.get('/notifications/'),
      ]);
      setPlacement(placementRes.data[0] || null);
      setLogs(logsRes.data);
      setNotifications(notifRes.data.filter(n => !n.is_read));
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return '#ff9800';
      case 'submitted': return '#2196f3';
      case 'reviewed': return '#9c27b0';
      case 'approved': return '#4caf50';
      default: return '#999';
    }
  };

  const draftLogs = logs.filter(l => l.status === 'draft').length;
  const submittedLogs = logs.filter(l => l.status === 'submitted').length;
  const approvedLogs = logs.filter(l => l.status === 'approved').length;

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h2 style={styles.navTitle}>ILES</h2>
        <div style={styles.navLinks}>
          <span style={styles.navLinkActive}>Dashboard</span>
          <span style={styles.navLink} onClick={() => navigate('/student/logs')}>My Logs</span>
          <span style={styles.navLink} onClick={() => navigate('/student/submit')}>Submit Log</span>
          <span style={styles.navLink} onClick={handleLogout}>Logout</span>
        </div>
      </div>

      <div style={styles.container}>
        {/* Welcome */}
        <div style={styles.welcomeCard}>
          <div>
            <h1 style={styles.welcomeTitle}>Welcome back, {username}! 👋</h1>
            <p style={styles.welcomeSub}>Track your internship progress and submit your weekly logs.</p>
          </div>
          <button style={styles.submitBtn} onClick={() => navigate('/student/submit')}>
            + Submit New Log
          </button>
        </div>

        {loading && <p style={styles.loading}>Loading your dashboard...</p>}

        {/* Notifications */}
        {notifications.length > 0 && (
          <div style={styles.notifBox}>
            <h3 style={styles.notifTitle}>🔔 Notifications ({notifications.length})</h3>
            {notifications.map(n => (
              <p key={n.id} style={styles.notifItem}>• {n.message}</p>
            ))}
          </div>
        )}

        {/* Stats Row */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <h2 style={{ ...styles.statNumber, color: '#1F4E79' }}>{logs.length}</h2>
            <p style={styles.statLabel}>Total Logs</p>
          </div>
          <div style={styles.statCard}>
            <h2 style={{ ...styles.statNumber, color: '#ff9800' }}>{draftLogs}</h2>
            <p style={styles.statLabel}>Drafts</p>
          </div>
          <div style={styles.statCard}>
            <h2 style={{ ...styles.statNumber, color: '#2196f3' }}>{submittedLogs}</h2>
            <p style={styles.statLabel}>Submitted</p>
          </div>
          <div style={styles.statCard}>
            <h2 style={{ ...styles.statNumber, color: '#4caf50' }}>{approvedLogs}</h2>
            <p style={styles.statLabel}>Approved</p>
          </div>
        </div>

        <div style={styles.twoCol}>
          {/* Placement Info */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>🏢 My Placement</h3>
            {placement ? (
              <div>
                <div style={styles.placementRow}>
                  <span style={styles.placementLabel}>Company</span>
                  <span style={styles.placementValue}>{placement.company_name}</span>
                </div>
                <div style={styles.placementRow}>
                  <span style={styles.placementLabel}>Supervisor</span>
                  <span style={styles.placementValue}>{placement.supervisor_name}</span>
                </div>
                <div style={styles.placementRow}>
                  <span style={styles.placementLabel}>Start Date</span>
                  <span style={styles.placementValue}>{new Date(placement.start_date).toLocaleDateString()}</span>
                </div>
                <div style={styles.placementRow}>
                  <span style={styles.placementLabel}>End Date</span>
                  <span style={styles.placementValue}>{new Date(placement.end_date).toLocaleDateString()}</span>
                </div>
              </div>
            ) : (
              <p style={styles.noData}>No placement assigned yet. Contact your administrator.</p>
            )}
          </div>

          {/* Recent Logs */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>📋 Recent Logs</h3>
            {logs.length === 0 ? (
              <div style={styles.noData}>
                <p>No logs yet.</p>
                <button style={styles.submitBtn} onClick={() => navigate('/student/submit')}>
                  Submit First Log
                </button>
              </div>
            ) : (
              <div>
                {logs.slice(0, 4).map(log => (
                  <div key={log.id} style={styles.logItem}>
                    <span style={styles.logWeek}>Week {log.week_number}</span>
                    <span style={{ ...styles.logStatus, backgroundColor: getStatusColor(log.status) }}>
                      {log.status.toUpperCase()}
                    </span>
                  </div>
                ))}
                {logs.length > 4 && (
                  <p
                    style={styles.viewAll}
                    onClick={() => navigate('/student/logs')}
                  >
                    View all {logs.length} logs →
                  </p>
                )}
              </div>
            )}
          </div>
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
  submitBtn: { backgroundColor: '#fff', color: '#1F4E79', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', whiteSpace: 'nowrap' },
  loading: { textAlign: 'center', color: '#666' },
  notifBox: { backgroundColor: '#fff8e1', border: '1px solid #ffe082', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px' },
  notifTitle: { margin: '0 0 8px 0', color: '#f57f17', fontSize: '16px' },
  notifItem: { margin: '4px 0', color: '#555', fontSize: '14px' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  statNumber: { fontSize: '36px', fontWeight: 'bold', margin: '0 0 4px 0' },
  statLabel: { color: '#888', margin: 0, fontSize: '14px' },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  card: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  cardTitle: { margin: '0 0 16px 0', color: '#1F4E79', fontSize: '16px' },
  placementRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' },
  placementLabel: { color: '#888', fontSize: '14px' },
  placementValue: { color: '#333', fontSize: '14px', fontWeight: '600' },
  noData: { color: '#999', textAlign: 'center', padding: '20px 0' },
  logItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f0f0f0' },
  logWeek: { color: '#333', fontWeight: '600', fontSize: '14px' },
  logStatus: { color: '#fff', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' },
  viewAll: { color: '#1F4E79', cursor: 'pointer', fontSize: '14px', marginTop: '12px', fontWeight: '600' },
};

export default StudentDashboard;