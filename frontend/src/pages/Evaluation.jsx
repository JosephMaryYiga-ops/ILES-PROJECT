import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Evaluation() {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const fetchEvaluations = async () => {
    try {
      const response = await api.get('/evaluations/');
      setEvaluations(response.data);
    } catch (err) {
      setError('Failed to load evaluations.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#4caf50';
    if (score >= 60) return '#ff9800';
    return '#f44336';
  };

  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <h2 style={styles.navTitle}>ILES</h2>
        <div style={styles.navLinks}>
          <span style={styles.navLink} onClick={() => navigate('/admin')}>Dashboard</span>
          <span style={styles.navLink} onClick={() => navigate('/admin/placement')}>Placements</span>
          <span style={styles.navLinkActive}>Evaluations</span>
          <span style={styles.navLink} onClick={() => navigate('/admin/criteria')}>Criteria</span>
          <span style={styles.navLink} onClick={handleLogout}>Logout</span>
        </div>
      </div>

      <div style={styles.container}>
        <h1 style={styles.title}>📊 Evaluations</h1>

        {error && <div style={styles.error}>{error}</div>}
        {loading && <p style={styles.loading}>Loading evaluations...</p>}

        {!loading && evaluations.length === 0 ? (
          <div style={styles.empty}>
            <p>No evaluations submitted yet.</p>
          </div>
        ) : (
          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Student</th>
                  <th style={styles.th}>Criteria</th>
                  <th style={styles.th}>Score</th>
                  <th style={styles.th}>Weighted Score</th>
                  <th style={styles.th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {evaluations.map((e, i) => (
                  <tr key={e.id} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                    <td style={styles.td}>{e.student_name}</td>
                    <td style={styles.td}>{e.criteria_name}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.scoreBadge,
                        backgroundColor: getScoreColor(e.score)
                      }}>
                        {e.score}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <strong style={{ color: '#1F4E79' }}>
                        {e.total_score !== null ? e.total_score : 'N/A'}
                      </strong>
                    </td>
                    <td style={styles.td}>
                      {new Date(e.created_at).toLocaleDateString()}
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
  title: { color: '#1F4E79', marginBottom: '24px' },
  error: { backgroundColor: '#ffebee', color: '#c62828', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' },
  loading: { textAlign: 'center', color: '#666' },
  empty: { textAlign: 'center', padding: '60px', color: '#999', backgroundColor: '#fff', borderRadius: '12px' },
  tableCard: { backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { backgroundColor: '#1F4E79' },
  th: { padding: '14px 16px', color: '#fff', textAlign: 'left', fontSize: '14px', fontWeight: '600' },
  td: { padding: '12px 16px', fontSize: '14px', color: '#333' },
  rowEven: { backgroundColor: '#f5f9ff' },
  rowOdd: { backgroundColor: '#ffffff' },
  scoreBadge: { color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' },
};

export default Evaluation;