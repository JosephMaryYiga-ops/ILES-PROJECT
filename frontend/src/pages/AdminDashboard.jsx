import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.get('/users/'), api.get('/placements/'), api.get('/logs/')])
      .then(([u, p, l]) => { setUsers(u.data); setPlacements(p.data); setLogs(l.data); })
      .catch(console.error).finally(() => setLoading(false));
  }, []);

  const roleColor = { student: '#2E7D32', workplace_supervisor: '#4A148C', academic_supervisor: '#006064', admin: '#E65100' };
  const roleLabel = { student: 'Student', workplace_supervisor: 'WP Supervisor', academic_supervisor: 'AC Supervisor', admin: 'Admin' };
  const statusColor = { draft: '#F57F17', submitted: '#1565C0', reviewed: '#6A1B9A', approved: '#2E7D32' };
  const statusBg = { draft: '#FFF8E1', submitted: '#E3F2FD', reviewed: '#F3E5F5', approved: '#E8F5E9' };

  return (
    <div style={S.page}>
      <Navbar active="dashboard" />
      <div style={S.container}>
        <div style={S.hero}>
          <div>
            <p style={S.heroSub}>Administrator</p>
            <h1 style={S.heroName}>Admin Dashboard</h1>
            <p style={S.heroDesc}>Manage users, placements and system activity.</p>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={S.heroStat}><span style={S.heroStatNum}>{users.length}</span><span style={S.heroStatLabel}>Users</span></div>
            <div style={S.heroStat}><span style={S.heroStatNum}>{placements.length}</span><span style={S.heroStatLabel}>Placements</span></div>
            <div style={S.heroStat}><span style={S.heroStatNum}>{logs.length}</span><span style={S.heroStatLabel}>Logs</span></div>
          </div>
        </div>

        {loading && <p style={S.loading}>Loading...</p>}

        <div style={S.stats}>
          {[
            { label: 'Students', val: users.filter(u => u.role === 'student').length, color: '#2E7D32', bg: '#E8F5E9' },
            { label: 'WP Supervisors', val: users.filter(u => u.role === 'workplace_supervisor').length, color: '#4A148C', bg: '#F3E5F5' },
            { label: 'AC Supervisors', val: users.filter(u => u.role === 'academic_supervisor').length, color: '#006064', bg: '#E0F7FA' },
            { label: 'Admins', val: users.filter(u => u.role === 'admin').length, color: '#E65100', bg: '#FBE9E7' },
          ].map((s, i) => (
            <div key={i} style={{ ...S.statCard, backgroundColor: s.bg }}>
              <span style={{ ...S.statNum, color: s.color }}>{s.val}</span>
              <span style={{ ...S.statLabel, color: s.color }}>{s.label}</span>
            </div>
          ))}
        </div>

        <div style={S.grid}>
          <div style={S.card}>
            <h3 style={S.cardTitle}>All Users</h3>
            {users.map(u => (
              <div key={u.id} style={S.userRow}>
                <div style={{ ...S.avatar, backgroundColor: roleColor[u.role] + '22', color: roleColor[u.role] }}>
                  {u.username[0].toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={S.userName}>{u.username}</p>
                  <p style={S.userEmail}>{u.email}</p>
                </div>
                <span style={{ ...S.rolePill, backgroundColor: roleColor[u.role] }}>{roleLabel[u.role]}</span>
              </div>
            ))}
          </div>

          <div style={S.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ ...S.cardTitle, margin: 0 }}> Placements</h3>
              <span style={S.link} onClick={() => navigate('/admin/placement')}>Manage →</span>
            </div>
            {placements.length === 0 ? <p style={S.empty}>No placements yet.</p> : placements.map(p => (
              <div key={p.id} style={S.placementRow}>
                <div>
                  <p style={S.companyName}>{p.company_name}</p>
                  <p style={S.studentSmall}>{p.student_name}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={S.dateSmall}>{new Date(p.start_date).toLocaleDateString()}</p>
                  <p style={S.dateSmall}>{new Date(p.end_date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...S.card, marginTop: '16px' }}>
          <h3 style={S.cardTitle}>Recent Log Activity</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {logs.slice(0, 6).map(log => (
              <div key={log.id} style={S.logCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={S.weekTag}>Week {log.week_number}</span>
                  <span style={{ ...S.chip, color: statusColor[log.status], backgroundColor: statusBg[log.status] }}>{log.status}</span>
                </div>
                <p style={S.logStudent}>{log.student_name}</p>
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
  hero: { background: 'linear-gradient(135deg, #E65100 0%, #4A148C 60%, #0D2B2C 100%)', borderRadius: '16px', padding: '40px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  heroSub: { color: 'rgba(255,255,255,0.5)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 4px 0' },
  heroName: { color: '#fff', fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px 0' },
  heroDesc: { color: 'rgba(255,255,255,0.55)', fontSize: '14px', margin: 0 },
  heroStat: { textAlign: 'center', marginLeft: '20px' },
  heroStatNum: { display: 'block', color: '#fff', fontSize: '40px', fontWeight: 'bold' },
  heroStatLabel: { color: 'rgba(255,255,255,0.4)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' },
  loading: { textAlign: 'center', color: '#999' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { borderRadius: '12px', padding: '24px', textAlign: 'center' },
  statNum: { display: 'block', fontSize: '36px', fontWeight: 'bold', marginBottom: '4px' },
  statLabel: { fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  card: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  cardTitle: { color: '#1A1A1A', fontSize: '15px', fontWeight: '700', margin: '0 0 16px 0' },
  userRow: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid #F5F5F5' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', flexShrink: 0 },
  userName: { margin: 0, fontSize: '13px', fontWeight: '600', color: '#1A1A1A' },
  userEmail: { margin: 0, fontSize: '11px', color: '#999' },
  rolePill: { color: '#fff', padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '700' },
  placementRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F5F5F5' },
  companyName: { margin: 0, fontSize: '13px', fontWeight: '600', color: '#1A1A1A' },
  studentSmall: { margin: 0, fontSize: '11px', color: '#999' },
  dateSmall: { margin: 0, fontSize: '11px', color: '#999' },
  empty: { color: '#bbb', textAlign: 'center', padding: '20px 0', fontSize: '13px' },
  logCard: { backgroundColor: '#F9F9F7', borderRadius: '8px', padding: '12px' },
  weekTag: { fontSize: '12px', fontWeight: '700', color: '#1A1A1A' },
  chip: { padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '700' },
  logStudent: { margin: 0, fontSize: '12px', color: '#888' },
  link: { color: '#E65100', fontSize: '12px', cursor: 'pointer', fontWeight: '600' },
};

export default AdminDashboard;