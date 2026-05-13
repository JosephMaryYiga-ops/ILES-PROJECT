import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';

function StudentDashboard() {
  const [placement, setPlacement] = useState(null);
  const [logs, setLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [p, l, n] = await Promise.all([api.get('/placements/'), api.get('/logs/'), api.get('/notifications/')]);
      setPlacement(p.data[0] || null);
      setLogs(l.data);
      setNotifications(n.data.filter(x => !x.is_read));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const statusColor = { draft: '#F57F17', submitted: '#1565C0', reviewed: '#6A1B9A', approved: '#2E7D32' };
  const statusBg = { draft: '#FFF8E1', submitted: '#E3F2FD', reviewed: '#F3E5F5', approved: '#E8F5E9' };

  return (
    <div style={S.page}>
      <Navbar active="dashboard" />
      <div style={S.container}>
        {notifications.length > 0 && (
          <div style={S.notif}>You have <strong>{notifications.length}</strong> unread notification — {notifications[0]?.message}</div>
        )}
        <div style={S.hero}>
          <div>
            <p style={S.heroSub}>Good day,</p>
            <h1 style={S.heroName}>{username}</h1>
            <p style={S.heroDesc}>{placement ? `Interning at ${placement.company_name}` : 'No placement assigned yet'}</p>
            <button style={S.heroBtn} onClick={() => navigate('/student/submit')}>+ Submit Weekly Log</button>
          </div>
          <div style={S.heroStat}>
            <span style={S.heroStatNum}>{logs.length}</span>
            <span style={S.heroStatLabel}>Total Logs</span>
          </div>
        </div>

        {loading && <p style={S.loading}>Loading...</p>}

        <div style={S.stats}>
          {[
            { label: 'Drafts', val: logs.filter(l => l.status === 'draft').length, color: '#F57F17', bg: '#FFF8E1' },
            { label: 'Submitted', val: logs.filter(l => l.status === 'submitted').length, color: '#1565C0', bg: '#E3F2FD' },
            { label: 'Reviewed', val: logs.filter(l => l.status === 'reviewed').length, color: '#6A1B9A', bg: '#F3E5F5' },
            { label: 'Approved', val: logs.filter(l => l.status === 'approved').length, color: '#2E7D32', bg: '#E8F5E9' },
          ].map((s, i) => (
            <div key={i} style={{ ...S.statCard, backgroundColor: s.bg }}>
              <span style={{ ...S.statNum, color: s.color }}>{s.val}</span>
              <span style={{ ...S.statLabel, color: s.color }}>{s.label}</span>
            </div>
          ))}
        </div>

        <div style={S.grid}>
          <div style={S.card}>
            <h3 style={S.cardTitle}>My Placement</h3>
            {placement ? (
              [['Company', placement.company_name], ['Supervisor', placement.supervisor_name], ['Start', new Date(placement.start_date).toLocaleDateString()], ['End', new Date(placement.end_date).toLocaleDateString()]].map(([k, v]) => (
                <div key={k} style={S.row}><span style={S.rowKey}>{k}</span><span style={S.rowVal}>{v}</span></div>
              ))
            ) : <p style={S.empty}>No placement assigned. Contact admin.</p>}
          </div>

          <div style={S.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ ...S.cardTitle, margin: 0 }}>Recent Logs</h3>
              <span style={S.link} onClick={() => navigate('/student/logs')}>View all →</span>
            </div>
            {logs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <p style={S.empty}>No logs yet.</p>
                <button style={S.smallBtn} onClick={() => navigate('/student/submit')}>Submit First Log</button>
              </div>
            ) : logs.slice(0, 5).map(log => (
              <div key={log.id} style={S.logRow}>
                <span style={S.weekTag}>W{log.week_number}</span>
                <span style={S.logText}>{log.content?.substring(0, 35)}...</span>
                <span style={{ ...S.chip, color: statusColor[log.status], backgroundColor: statusBg[log.status] }}>{log.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { minHeight: '100vh', backgroundColor: '#F5F5F0', fontFamily: 'Arial, sans-serif' },
  container: { maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' },
  notif: { backgroundColor: '#FFF8E1', border: '1px solid #FFE082', borderLeft: '4px solid #F57F17', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '14px', color: '#555' },
  hero: { background: 'linear-gradient(135deg, #0f1f10 0%, #1A1035 60%, #0D2B2C 100%)', borderRadius: '16px', padding: '40px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  heroSub: { color: 'rgba(255,255,255,0.5)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 4px 0' },
  heroName: { color: '#fff', fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px 0' },
  heroDesc: { color: 'rgba(255,255,255,0.55)', fontSize: '14px', margin: '0 0 20px 0' },
  heroBtn: { background: 'linear-gradient(135deg, #2E7D32, #006064)', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '700' },
  heroStat: { textAlign: 'center' },
  heroStatNum: { display: 'block', color: '#fff', fontSize: '48px', fontWeight: 'bold' },
  heroStatLabel: { color: 'rgba(255,255,255,0.4)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' },
  loading: { textAlign: 'center', color: '#999', padding: '40px' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { borderRadius: '12px', padding: '24px', textAlign: 'center' },
  statNum: { display: 'block', fontSize: '36px', fontWeight: 'bold', marginBottom: '4px' },
  statLabel: { fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  card: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  cardTitle: { color: '#1A1A1A', fontSize: '15px', fontWeight: '700', margin: '0 0 16px 0' },
  row: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F5F5F5' },
  rowKey: { color: '#999', fontSize: '13px' },
  rowVal: { color: '#1A1A1A', fontSize: '13px', fontWeight: '600' },
  empty: { color: '#bbb', textAlign: 'center', fontSize: '13px' },
  smallBtn: { marginTop: '8px', backgroundColor: '#2E7D32', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  logRow: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid #F5F5F5' },
  weekTag: { backgroundColor: '#1A1035', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700', flexShrink: 0 },
  logText: { color: '#666', fontSize: '13px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  chip: { padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', flexShrink: 0 },
  link: { color: '#2E7D32', fontSize: '12px', cursor: 'pointer', fontWeight: '600' },
};

export default StudentDashboard;