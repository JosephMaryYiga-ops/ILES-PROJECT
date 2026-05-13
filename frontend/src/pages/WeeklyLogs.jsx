import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';

function WeeklyLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/logs/').then(r => setLogs(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const statusColor = { draft: '#F57F17', submitted: '#1565C0', reviewed: '#6A1B9A', approved: '#2E7D32' };
  const statusBg = { draft: '#FFF8E1', submitted: '#E3F2FD', reviewed: '#F3E5F5', approved: '#E8F5E9' };

  return (
    <div style={S.page}>
      <Navbar active="logs" />
      <div style={S.container}>
        <div style={S.header}>
          <h1 style={S.title}>My Weekly Logs</h1>
          <button style={S.addBtn} onClick={() => navigate('/student/submit')}>+ Submit New Log</button>
        </div>

        {loading && <p style={S.loading}>Loading logs...</p>}

        {!loading && logs.length === 0 && (
          <div style={S.emptyBox}>
            <p style={S.emptyText}>You have not submitted any logs yet.</p>
            <button style={S.addBtn} onClick={() => navigate('/student/submit')}>Submit Your First Log</button>
          </div>
        )}

        <div style={S.list}>
          {logs.map(log => (
            <div key={log.id} style={S.card}>
              <div style={S.cardTop}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ ...S.weekCircle, backgroundColor: statusBg[log.status], color: statusColor[log.status] }}>W{log.week_number}</div>
                  <div>
                    <h3 style={S.weekTitle}>Week {log.week_number}</h3>
                    <p style={S.weekDate}>{log.created_at ? new Date(log.created_at).toLocaleDateString() : ''}</p>
                  </div>
                </div>
                <span style={{ ...S.badge, color: statusColor[log.status], backgroundColor: statusBg[log.status] }}>
                  {log.status.toUpperCase()}
                </span>
              </div>
              <p style={S.content}>{log.content}</p>
              {log.supervisor_comment && (
                <div style={S.feedback}>
                  <strong style={{ color: '#2E7D32' }}>Supervisor Feedback: </strong>
                  <span style={{ color: '#444', fontSize: '13px' }}>{log.supervisor_comment}</span>
                </div>
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
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { color: '#1A1A1A', margin: 0, fontSize: '24px', fontWeight: 'bold' },
  addBtn: { background: 'linear-gradient(135deg, #2E7D32, #006064)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '700' },
  loading: { textAlign: 'center', color: '#999' },
  emptyBox: { textAlign: 'center', padding: '80px 0' },
  emptyText: { color: '#bbb', marginBottom: '16px', fontSize: '15px' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  weekCircle: { width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700' },
  weekTitle: { margin: 0, fontSize: '15px', fontWeight: '700', color: '#1A1A1A' },
  weekDate: { margin: 0, fontSize: '12px', color: '#999' },
  badge: { padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' },
  content: { color: '#555', fontSize: '14px', lineHeight: '1.6', margin: '0 0 12px 0' },
  feedback: { backgroundColor: '#E8F5E9', padding: '10px 14px', borderRadius: '8px', fontSize: '13px' },
};

export default WeeklyLogs;