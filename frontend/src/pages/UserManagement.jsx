import { useState, useEffect } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'student'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users/');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/', formData);
      setShowForm(false);
      setFormData({ username: '', email: '', password: '', role: 'student' });
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${userId}/`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

 const getRoleColor = (role) => {
  // If role is empty string or null, treat as admin
  if (!role || role === '') return '#E65100';
  
  switch(role) {
    case 'admin': return '#E65100';
    case 'student': return '#2E7D32';
    case 'workplace_supervisor': return '#4A148C';
    case 'academic_supervisor': return '#006064';
    default: return '#95a5a6';
  }
};

  const getRoleLabel = (role) => {
  // If role is empty string or null, treat as admin
  if (!role || role === '') return 'Admin';
  
  switch(role) {
    case 'admin': return 'Admin';
    case 'student': return 'Student';
    case 'workplace_supervisor': return 'WP Supervisor';
    case 'academic_supervisor': return 'AC Supervisor';
    default: return 'Admin';
  }
};

  if (loading) return (
    <div style={styles.page}>
      <Navbar active="users" />
      <div style={styles.container}>
        <p style={styles.loading}>Loading users...</p>
      </div>
    </div>
  );

  return (
    <div style={styles.page}>
      <Navbar active="users" />
      <div style={styles.container}>
        {/* Hero Section */}
        <div style={styles.hero}>
          <div>
            <p style={styles.heroSub}>Administrator</p>
            <h1 style={styles.heroName}>User Management</h1>
            <p style={styles.heroDesc}>Create, manage and monitor system users.</p>
          </div>
          <button style={styles.addButton} onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '+ Add New User'}
          </button>
        </div>

        {/* Add User Form */}
        {showForm && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>Create New User</h3>
            <form onSubmit={handleCreateUser}>
              <div style={styles.formGrid}>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  required
                />
                <input
                  style={styles.input}
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
                <input
                  style={styles.input}
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
                <select
                  style={styles.input}
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="student">Student</option>
                  <option value="workplace_supervisor">Workplace Supervisor</option>
                  <option value="academic_supervisor">Academic Supervisor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit" style={styles.submitButton}>Create User</button>
            </form>
          </div>
        )}

        {/* Stats Cards */}
        <div style={styles.stats}>
          {[
            { label: 'Total Users', val: users.length, color: '#E65100', bg: '#FBE9E7' },
            { label: 'Students', val: users.filter(u => u.role === 'student').length, color: '#2E7D32', bg: '#E8F5E9' },
            { label: 'Supervisors', val: users.filter(u => u.role === 'workplace_supervisor' || u.role === 'academic_supervisor').length, color: '#4A148C', bg: '#F3E5F5' },
            { label: 'Admins', val: users.filter(u => u.role === 'admin').length, color: '#006064', bg: '#E0F7FA' },
          ].map((s, i) => (
            <div key={i} style={{ ...styles.statCard, backgroundColor: s.bg }}>
              <span style={{ ...styles.statNum, color: s.color }}>{s.val}</span>
              <span style={{ ...styles.statLabel, color: s.color }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Users Table */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>All Users</h3>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Username</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={styles.tableRow}>
                    <td style={styles.td}>{user.id}</td>
                    <td style={styles.td}>
                      <div style={styles.userCell}>
                        <div style={{...styles.avatar, backgroundColor: getRoleColor(user.role) + '22', color: getRoleColor(user.role)}}>
                          {user.username[0].toUpperCase()}
                        </div>
                        <span style={styles.username}>{user.username}</span>
                      </div>
                    </td>
                    <td style={styles.td}>{user.email}</td>
                    <td style={styles.td}>
                      <span style={{...styles.roleBadge, backgroundColor: getRoleColor(user.role)}}>
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button 
                        style={styles.deleteButton} 
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#F5F5F0', fontFamily: 'Arial, sans-serif' },
  container: { maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' },
  hero: { background: 'linear-gradient(135deg, #E65100 0%, #4A148C 60%, #0D2B2C 100%)', borderRadius: '16px', padding: '40px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  heroSub: { color: 'rgba(255,255,255,0.5)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 4px 0' },
  heroName: { color: '#fff', fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px 0' },
  heroDesc: { color: 'rgba(255,255,255,0.55)', fontSize: '14px', margin: 0 },
  addButton: { padding: '12px 24px', backgroundColor: '#fff', color: '#E65100', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
  formCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  formTitle: { margin: '0 0 16px 0', fontSize: '18px', color: '#1A1A1A' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' },
  input: { padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' },
  submitButton: { padding: '12px 24px', backgroundColor: '#2E7D32', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { borderRadius: '12px', padding: '24px', textAlign: 'center' },
  statNum: { display: 'block', fontSize: '36px', fontWeight: 'bold', marginBottom: '4px' },
  statLabel: { fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' },
  card: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  cardTitle: { color: '#1A1A1A', fontSize: '15px', fontWeight: '700', margin: '0 0 16px 0' },
  tableContainer: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { borderBottom: '2px solid #F5F5F5' },
  th: { textAlign: 'left', padding: '12px', color: '#666', fontSize: '12px', fontWeight: '600' },
  tableRow: { borderBottom: '1px solid #F5F5F5' },
  td: { padding: '12px', fontSize: '13px', color: '#1A1A1A' },
  userCell: { display: 'flex', alignItems: 'center', gap: '8px' },
  avatar: { width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' },
  username: { fontWeight: '500' },
  roleBadge: { padding: '4px 12px', borderRadius: '20px', color: '#fff', fontSize: '11px', fontWeight: 'bold', display: 'inline-block' },
  deleteButton: { padding: '6px 12px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
  loading: { textAlign: 'center', padding: '50px', fontSize: '18px', color: '#999' }
};

export default UserManagement;