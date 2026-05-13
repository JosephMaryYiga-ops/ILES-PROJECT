import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';

function Placement() {
  const [placements, setPlacements] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    student: '',
    company_name: '',
    supervisor_name: '',
    start_date: '',
    end_date: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [placementsRes, usersRes] = await Promise.all([
        api.get('/placements/'),
        api.get('/users/'),
      ]);
      setPlacements(placementsRes.data);
      setUsers(usersRes.data.filter(u => u.role === 'student'));
    } catch (err) {
      setError('Failed to load placements.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/placements/', form);
      setSuccess('Placement created successfully!');
      setShowForm(false);
      setForm({ student: '', company_name: '', supervisor_name: '', start_date: '', end_date: '' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create placement.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={styles.page}>
      <Navbar active="placement" />
      

      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}> Internship Placements</h1>
          <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Placement'}
          </button>
        </div>

        {success && <div style={styles.success}>{success}</div>}
        {error && <div style={styles.error}>{error}</div>}

        {/* Add Placement Form */}
        {showForm && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>New Placement</h3>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGrid}>
                <div style={styles.field}>
                  <label style={styles.label}>Student</label>
                  <select
                    style={styles.input}
                    value={form.student}
                    onChange={(e) => setForm({ ...form, student: e.target.value })}
                    required
                  >
                    <option value="">Select a student</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.username}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Company Name</label>
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="e.g. MTN Uganda"
                    value={form.company_name}
                    onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                    required
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Supervisor Name</label>
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="e.g. Mr. John Smith"
                    value={form.supervisor_name}
                    onChange={(e) => setForm({ ...form, supervisor_name: e.target.value })}
                    required
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Start Date</label>
                  <input
                    style={styles.input}
                    type="date"
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    required
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>End Date</label>
                  <input
                    style={styles.input}
                    type="date"
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    required
                  />
                </div>
              </div>
              <button type="submit" style={styles.submitBtn}>Save Placement</button>
            </form>
          </div>
        )}

        {/* Placements Table */}
        {loading ? (
          <p style={styles.loading}>Loading placements...</p>
        ) : placements.length === 0 ? (
          <div style={styles.empty}>
            <p>No placements yet. Add one above.</p>
          </div>
        ) : (
          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Student</th>
                  <th style={styles.th}>Company</th>
                  <th style={styles.th}>Supervisor</th>
                  <th style={styles.th}>Start Date</th>
                  <th style={styles.th}>End Date</th>
                </tr>
              </thead>
              <tbody>
                {placements.map((p, i) => (
                  <tr key={p.id} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                    <td style={styles.td}>{p.student_name}</td>
                    <td style={styles.td}>{p.company_name}</td>
                    <td style={styles.td}>{p.supervisor_name}</td>
                    <td style={styles.td}>{new Date(p.start_date).toLocaleDateString()}</td>
                    <td style={styles.td}>{new Date(p.end_date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
  navLinkActive: { color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', borderBottom: '2px solid #fff', paddingBottom: '4px' },
  container: { maxWidth: '1000px', margin: '0 auto', padding: '32px 16px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { color: '#1F4E79', margin: 0 },
  addBtn: { backgroundColor: '#1F4E79', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  success: { backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' },
  error: { backgroundColor: '#ffebee', color: '#c62828', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' },
  formCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  formTitle: { margin: '0 0 20px 0', color: '#1F4E79' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' },
  field: { display: 'flex', flexDirection: 'column' },
  label: { marginBottom: '6px', fontWeight: '600', fontSize: '14px', color: '#333' },
  input: { padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' },
  submitBtn: { backgroundColor: '#1F4E79', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  loading: { textAlign: 'center', color: '#666' },
  empty: { textAlign: 'center', padding: '60px', color: '#999', backgroundColor: '#fff', borderRadius: '12px' },
  tableCard: { backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { backgroundColor: '#1F4E79' },
  th: { padding: '14px 16px', color: '#fff', textAlign: 'left', fontSize: '14px', fontWeight: '600' },
  td: { padding: '12px 16px', fontSize: '14px', color: '#333' },
  rowEven: { backgroundColor: '#f5f9ff' },
  rowOdd: { backgroundColor: '#ffffff' },
};

export default Placement;