import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';

function Criteria() {
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    weight: '',
    evaluator: 'workplace',
    is_active: true,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCriteria();
  }, []);

  const fetchCriteria = async () => {
    try {
      const response = await api.get('/criteria/');
      setCriteria(response.data);
    } catch (err) {
      setError('Failed to load criteria.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/criteria/', form);
      setSuccess('Criteria added successfully!');
      setShowForm(false);
      setForm({ name: '', description: '', weight: '', evaluator: 'workplace', is_active: true });
      fetchCriteria();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add criteria.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const totalWeight = criteria.reduce((sum, c) => sum + Number(c.weight), 0);

  return (
    <div style={styles.page}>
      <Navbar active="criteria" />    

      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Evaluation Criteria</h1>
          <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Criteria'}
          </button>
        </div>

        {/* Total weight indicator */}
        <div style={{
          ...styles.weightBar,
          borderColor: totalWeight === 100 ? '#4caf50' : '#ff9800'
        }}>
          <span style={styles.weightText}>
            Total Weight: <strong style={{ color: totalWeight === 100 ? '#4caf50' : '#ff9800' }}>{totalWeight}%</strong>
            {totalWeight === 100
              ? ' ✅ Perfect — weights add up to 100%'
              : ' ⚠️ Weights should add up to 100%'}
          </span>
        </div>

        {success && <div style={styles.success}>{success}</div>}
        {error && <div style={styles.error}>{error}</div>}

        {/* Add Criteria Form */}
        {showForm && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>New Evaluation Criteria</h3>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGrid}>
                <div style={styles.field}>
                  <label style={styles.label}>Criteria Name</label>
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="e.g. Punctuality"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Weight (%)</label>
                  <input
                    style={styles.input}
                    type="number"
                    min="1"
                    max="100"
                    placeholder="e.g. 40"
                    value={form.weight}
                    onChange={(e) => setForm({ ...form, weight: e.target.value })}
                    required
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Evaluated By</label>
                  <select
                    style={styles.input}
                    value={form.evaluator}
                    onChange={(e) => setForm({ ...form, evaluator: e.target.value })}
                  >
                    <option value="workplace">Workplace Supervisor</option>
                    <option value="academic">Academic Supervisor</option>
                  </select>
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Description</label>
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="Brief description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
              </div>
              <button type="submit" style={styles.submitBtn}>Save Criteria</button>
            </form>
          </div>
        )}

        {/* Criteria List */}
        {loading ? (
          <p style={styles.loading}>Loading criteria...</p>
        ) : criteria.length === 0 ? (
          <div style={styles.empty}>
            <p>No evaluation criteria yet. Add one above.</p>
          </div>
        ) : (
          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Weight</th>
                  <th style={styles.th}>Evaluated By</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {criteria.map((c, i) => (
                  <tr key={c.id} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                    <td style={styles.td}><strong>{c.name}</strong></td>
                    <td style={styles.td}>{c.description || '—'}</td>
                    <td style={styles.td}>
                      <span style={styles.weightBadge}>{c.weight}%</span>
                    </td>
                    <td style={styles.td}>
                      {c.evaluator === 'workplace' ? '🏢 Workplace' : '🎓 Academic'}
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: c.is_active ? '#4caf50' : '#999'
                      }}>
                        {c.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
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
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  title: { color: '#1F4E79', margin: 0 },
  addBtn: { backgroundColor: '#1F4E79', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  weightBar: { border: '1px solid', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', backgroundColor: '#fff' },
  weightText: { fontSize: '14px', color: '#333' },
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
  weightBadge: { backgroundColor: '#1F4E79', color: '#fff', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  statusBadge: { color: '#fff', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
};

export default Criteria;