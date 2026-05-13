import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';

function SupervisorDashboard() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  useEffect(() => {
    api.get('/logs/').then(r => setLogs(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const pending = logs.filter(l => l.status === 'submitted');

  return (
    <div style={S.page}>
      <Navbar active="dashboard" />
      <div style={S.container}>
        <div style={S.hero}>
          <div>
            <p style={S.heroSub}>Supervisor Dashboard</p>
            <h1 style={S.heroName}>{username}</h1>
            <p style={S.heroDesc}>Review and provide feedback on student weekly logs.</p>
            <button style={S.heroBtn} onClick={() => navigate('/supervisor/review')}>Go to Review Logs</button>
          </div>
          <div style={S.heroStat}>
            <span style={S.heroStatNum}>{pending.length}</span>
            <span style={S.heroStatLabel}>Pending Reviews</span>
          </div>
        </div>

        {loading && <p style={S.loading}>Loading...</p>}

        <div style={S.stats}>
          {[
            { label: 'Total Logs', val: logs.length, color: '#4A148C', bg: '#F3E5F5' },
            { label: 'Pending Review', val: pending.length, color: '#1565C0', bg: '#E3F2FD' },
            { label: 'Reviewed', val: logs.filter(l => l.status === 'reviewed').length, color: '#E65100', bg: '#FBE9E7' },
            { label: 'Approved', val: logs.filter(l => l.status === 'approved').length, color: '#2E7D32', bg: '#E8F5E9' },
          ].map((s, i) => (
            <div key={i} style={{ ...S.statCard, backgroundColor: s.bg }}>
              <span style={{ ...S.statNum, color: s.color }}>{s.val}</span>
              <span style={{ ...S.statLabel, color: s.color }}>{s.label}</span>
            </div>
          ))}
        </div>

        <div style={S.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={S.cardTitle}>Logs Waiting for Your Review</h3>
            <span style={S.link} onClick={() => navigate('/supervisor/review')}>Review all →</span>
          </div>
          {pending.length === 0 ? (
            <p style={S.empty}>No logs waiting for review right now.</p>
          ) : pending.slice(0, 5).map(log => (
            <div key={log.id} style={S.logRow}>
              <span style={S.weekTag}>W{log.week_number}</span>
              <span style={S.studentName}>{log.student_name}</span>
              <button style={S.reviewBtn} onClick={() => navigate('/supervisor/review')}>Review</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { minHeight: '100vh', backgroundColor: '#F5F5F0', fontFamily: 'Arial, sans-serif' },
  container: { maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' },
  hero: { background: 'linear-gradient(135deg, #1A1035 0%, #0f1f10 60%, #0D2B2C 100%)', borderRadius: '16px', padding: '40px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  heroSub: { color: 'rgba(255,255,255,0.5)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 4px 0' },
  heroName: { color: '#fff', fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px 0' },
  heroDesc: { color: 'rgba(255,255,255,0.55)', fontSize: '14px', margin: '0 0 20px 0' },
  heroBtn: { background: 'linear-gradient(135deg, #4A148C, #006064)', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '700' },
  heroStat: { textAlign: 'center' },
  heroStatNum: { display: 'block', color: '#fff', fontSize: '48px', fontWeight: 'bold' },
  heroStatLabel: { color: 'rgba(255,255,255,0.4)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' },
  loading: { textAlign: 'center', color: '#999' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { borderRadius: '12px', padding: '24px', textAlign: 'center' },
  statNum: { display: 'block', fontSize: '36px', fontWeight: 'bold', marginBottom: '4px' },
  statLabel: { fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' },
  card: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  cardTitle: { color: '#1A1A1A', fontSize: '15px', fontWeight: '700', margin: 0 },
  empty: { color: '#bbb', textAlign: 'center', padding: '20px 0', fontSize: '13px' },
  logRow: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid #F5F5F5' },
  weekTag: { backgroundColor: '#1A1035', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700' },
  studentName: { color: '#444', fontSize: '14px', flex: 1 },
  reviewBtn: { backgroundColor: '#4A148C', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' },
  link: { color: '#4A148C', fontSize: '12px', cursor: 'pointer', fontWeight: '600' },
};

export default SupervisorDashboard;