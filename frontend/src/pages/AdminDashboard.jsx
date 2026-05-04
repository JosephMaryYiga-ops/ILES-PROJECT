import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, placementsRes, logsRes] = await Promise.all([
        api.get('/users/'),
        api.get('/placements/'),
        api.get('/logs/'),
      ]);
      setUsers(usersRes.data);
      setPlacements(placementsRes.data);
      setLogs(logsRes.data);
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

  const students = users.filter(u => u.role === 'student').length;
  const supervisors = users.filter(u => u.role === 'workplace_supervisor').length;
  const academics = users.filter(u => u.role === 'academic_supervisor').length;

  const getRoleColor = (role) => {
    switch (role) {
      case 'student': return '#2196f3';
      case 'workplace_supervisor': return '#4caf50';
      case 'academic_supervisor': return '#9c27b0';
      case 'admin': return '#1F4E79';
      default: return '#999';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'student': return 'Student';
      case 'workplace_supervisor': return 'Workplace Supervisor';
      case 'academic_supervisor': return 'Academic Supervisor';
      case 'admin': return 'Admin';
      default: return role;
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <h2 style={styles.navTitle}>ILES</h2>
        <div style={styles.navLinks}>
          <span style={styles.navLinkActive}>Dashboard</span>
          <span style={styles.navLink} onClick={() => navigate('/admin/placement')}>Placements</span>
          <span style={styles.navLink} onClick={() => navigate('/admin/evaluation')}>Evaluations</span>
          <span style={styles.navLink} onClick={() => navigate('/admin/criteria')}>Criteria</span>
          <span style={styles.navLink} onClick={handleLogout}>Logout</span>
        </div>
      </div>

      <div style={styles.container}>
        {/* Welcome */}
        <div style={styles.welcomeCard}>
          <div>
            <h1 style={styles.welcomeTitle}>Admin Dashboard 🛠️</h1>
            <p style={styles.welcomeSub}>Manage users, placements and system settings.</p>
          </div>
        </div>

        {loading && <p style={styles.loading}>Loading...</p>}

        {/* Stats */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <h2 style={{ ...styles.statNumber, color: '#1F4E79' }}>{users.length}</h2>
            <p style={styles.statLabel}>Total Users</p>
          </div>
          <div style={styles.statCard}>
            <h2 style={{ ...styles.statNumber, color: '#2196f3' }}>{students}</h2>
            <p style={styles.statLabel}>Students</p>
          </div>
          <div style={styles.statCard}>
            <h2 style={{ ...styles.statNumber, color: '#4caf50' }}>{supervisors}</h2>
            <p style={styles.statLabel}>Workplace Supervisors</p>
          </div>
          <div style={styles.statCard}>
            <h2 style={{ ...styles.statNumber, color: '#9c27b0' }}>{academics}</h2>
            <p style={styles.statLabel}>Academic Supervisors</p>
          </div>
        </div>

        <div style={styles.twoCol}>
          {/* Users Table */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>👥 All Users</h3>
            {users.length === 0 ? (
              <p style={styles.noData}>No users found.</p>
            ) : (
              <div>
                {users.map(user => (
                  <div key={user.id} style={styles.userItem}>
                    <div>
                      <span style={styles.userName}>{user.username}</span>
                      <p style={styles.userEmail}>{user.email}</p>
                    </div>
                    <span style={{
                      ...styles.roleBadge,
                      backgroundColor: getRoleColor(user.role)
                    }}>
                      {getRoleLabel(user.role)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Placements Table */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>🏢 Placements</h3>
            {placements.length === 0 ? (
              <p style={styles.noData}>No placements found.</p>
            ) : (
              <div>
                {placements.map(p => (
                  <div key={p.id} style={styles.placementItem}>
                    <div>
                      <span style={styles.companyName}>{p.company_name}</span>
                      <p style={styles.studentNameText}>{p.student_name}</p>
                    </div>
                    <div style={styles.dates}>
                      <p style={styles.dateText}>{new Date(p.start_date).toLocaleDateString()}</p>
                      <p style={styles.dateText}>{new Date(p.end_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Logs */}
        <div style={{ ...styles.card, marginTop: '16px' }}>
          <h3 style={styles.cardTitle}>📋 Recent Log Activity</h3>
          {logs.length === 0 ? (
            <p style={styles.noData}>No logs submitted yet.</p>
          ) : (
            <div style={styles.logsGrid}>
              {logs.slice(0, 6).map(log => (
                <div key={log.id} style={styles.logItem}>
                  <span style={styles.logWeek}>Week {log.week_number}</span>
                  <span style={styles.logStudent}>{log.student_name}</span>
                  <span style={{
                    ...styles.logStatus,
                    backgroundColor:
                      log.status === 'approved' ? '#4caf50' :
                      log.status === 'submitted' ? '#2196f3' :
                      log.status === 'reviewed' ? '#9c27b0' : '#ff9800'
                  }}>
                    {log.status.toUpperCase()}
                  </span>
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
  welcomeCard: { backgroundColor: '#1F4E79', borderRadius: '12px', padding: '32px', marginBottom: '24px' },
  welcomeTitle: { color: '#fff', margin: '0 0 8px 0', fontSize: '24px' },
  welcomeSub: { color: '#a8c8e8', margin: 0, fontSize: '14px' },
  loading: { textAlign: 'center', color: '#666' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  statNumber: { fontSize: '36px', fontWeight: 'bold', margin: '0 0 4px 0' },
  statLabel: { color: '#888', margin: 0, fontSize: '14px' },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  card: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  cardTitle: { margin: '0 0 16px 0', color: '#1F4E79', fontSize: '16px' },
  noData: { color: '#999', textAlign: 'center', padding: '20px 0' },
  userItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f0f0f0' },
  userName: { fontWeight: '600', color: '#333', fontSize: '14px' },
  userEmail: { color: '#999', fontSize: '12px', margin: '2px 0 0 0' },
  roleBadge: { color: '#fff', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' },
  placementItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f0f0f0' },
  companyName: { fontWeight: '600', color: '#333', fontSize: '14px' },
  studentNameText: { color: '#999', fontSize: '12px', margin: '2px 0 0 0' },
  dates: { textAlign: 'right' },
  dateText: { color: '#999', fontSize: '12px', margin: '2px 0' },
  logsGrid: { display: 'flex', flexDirection: 'column', gap: '8px' },
  logItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', backgroundColor: '#f9f9f9', borderRadius: '8px' },
  logWeek: { fontWeight: '600', color: '#333', fontSize: '14px' },
  logStudent: { color: '#666', fontSize: '14px' },
  logStatus: { color: '#fff', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' },
};

export default AdminDashboard;