import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';

function WeeklyLogs() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem('role');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await api.get('/logs/');
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'draft': return '#F57F17';
      case 'submitted': return '#1565C0';
      case 'reviewed': return '#6A1B9A';
      case 'approved': return '#2E7D32';
      default: return '#999';
    }
  };

  const getStatusBg = (status) => {
    switch(status) {
      case 'draft': return '#FFF8E1';
      case 'submitted': return '#E3F2FD';
      case 'reviewed': return '#F3E5F5';
      case 'approved': return '#E8F5E9';
      default: return '#F5F5F5';
    }
  };

  if (loading) return (
    <div style={styles.page}>
      <Navbar active="logs" />
      <div style={styles.container}>Loading...</div>
    </div>
  );

  return (
    <div style={styles.page}>
      <Navbar active="logs" />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Weekly Logs</h1>
          {role === 'student' && (
            <button onClick={() => navigate('/student/submit')} style={styles.submitButton}>
              + Submit New Log
            </button>
          )}
        </div>

        {logs.length === 0 ? (
          <div style={styles.empty}>No logs found. Submit your first weekly log!</div>
        ) : (
          <div style={styles.grid}>
            {logs.map((log) => (
              <div key={log.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.weekNumber}>Week {log.week_number}</span>
                  <span style={{...styles.statusBadge, backgroundColor: getStatusColor(log.status), color: '#fff'}}>
                    {log.status.toUpperCase()}
                  </span>
                </div>
                <div style={styles.cardContent}>
                  <p style={styles.content}>{log.content.substring(0, 150)}...</p>
                  {log.supervisor_comment && (
                    <div style={styles.commentBox}>
                      <strong>Supervisor Comment:</strong>
                      <p style={styles.comment}>{log.supervisor_comment}</p>
                    </div>
                  )}
                </div>
                <div style={styles.cardFooter}>
                  <span style={styles.date}>Submitted: {new Date(log.created_at).toLocaleDateString()}</span>
                </div>
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
  container: { maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
  title: { fontSize: '28px', fontWeight: 'bold', color: '#1A1A1A', margin: 0 },
  submitButton: { padding: '10px 20px', backgroundColor: '#2E7D32', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  empty: { textAlign: 'center', padding: '60px', backgroundColor: '#fff', borderRadius: '12px', color: '#999' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' },
  card: { backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  cardHeader: { padding: '16px', backgroundColor: '#fafafa', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  weekNumber: { fontSize: '18px', fontWeight: 'bold', color: '#333' },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' },
  cardContent: { padding: '16px' },
  content: { fontSize: '14px', color: '#555', lineHeight: '1.5', margin: '0 0 12px 0' },
  commentBox: { backgroundColor: '#f9f9f9', padding: '12px', borderRadius: '8px', marginTop: '12px' },
  comment: { fontSize: '13px', color: '#666', margin: '8px 0 0 0' },
  cardFooter: { padding: '12px 16px', borderTop: '1px solid #eee', backgroundColor: '#fafafa' },
  date: { fontSize: '11px', color: '#999' },
};

export default WeeklyLogs;