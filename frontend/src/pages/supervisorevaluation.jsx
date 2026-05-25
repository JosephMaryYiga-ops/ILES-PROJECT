import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';

function SupervisorEvaluation() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, criteriaRes] = await Promise.all([
        api.get('/users/?role=student'),
        api.get('/criteria/')
      ]);
      setStudents(studentsRes.data);
      setCriteria(criteriaRes.data);
      
      // Initialize scores object
      const initialScores = {};
      criteriaRes.data.forEach(c => {
        initialScores[c.id] = '';
      });
      setScores(initialScores);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (criteriaId, value) => {
    setScores({...scores, [criteriaId]: value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent) {
      setError('Please select a student');
      return;
    }
    
    setSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      // Submit each score
      for (const [criteriaId, score] of Object.entries(scores)) {
        if (score && score !== '') {
          await api.post('/evaluations/', {
            student: parseInt(selectedStudent),
            criteria: parseInt(criteriaId),
            score: parseFloat(score)
          });
        }
      }
      setSuccess('Evaluation submitted successfully!');
      setTimeout(() => navigate('/supervisor'), 2000);
    } catch (error) {
      setError('Failed to submit evaluation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const totalWeight = criteria.reduce((sum, c) => sum + parseFloat(c.weight || 0), 0);

  if (loading) return (
    <div style={styles.page}>
      <Navbar active="evaluation" />
      <div style={styles.container}>Loading...</div>
    </div>
  );

  return (
    <div style={styles.page}>
      <Navbar active="evaluation" />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Submit Student Evaluation</h1>
          <p style={styles.subtitle}>Rate students based on evaluation criteria</p>
        </div>

        {totalWeight !== 100 && (
          <div style={styles.warning}>
            ⚠️ Total criteria weight is {totalWeight}%. It should be 100%.
          </div>
        )}

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Select Student</label>
            <select
              style={styles.select}
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              required
            >
              <option value="">-- Choose a student --</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.username} - {s.email}</option>
              ))}
            </select>
          </div>

          <div style={styles.criteriaSection}>
            <h3 style={styles.sectionTitle}>Evaluation Criteria</h3>
            {criteria.map((c) => (
              <div key={c.id} style={styles.criteriaCard}>
                <div style={styles.criteriaHeader}>
                  <div>
                    <span style={styles.criteriaName}>{c.name}</span>
                    <span style={styles.criteriaWeight}>Weight: {c.weight}%</span>
                  </div>
                  <div style={styles.scoreInput}>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      max="100"
                      placeholder="Score (0-100)"
                      style={styles.input}
                      value={scores[c.id]}
                      onChange={(e) => handleScoreChange(c.id, e.target.value)}
                      required
                    />
                  </div>
                </div>
                {c.description && <p style={styles.description}>{c.description}</p>}
              </div>
            ))}
          </div>

          <button type="submit" disabled={submitting} style={styles.submitButton}>
            {submitting ? 'Submitting...' : 'Submit Evaluation'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#F5F5F0' },
  container: { maxWidth: '800px', margin: '0 auto', padding: '32px 24px' },
  header: { marginBottom: '32px' },
  title: { fontSize: '28px', fontWeight: 'bold', color: '#1A1A1A', margin: 0 },
  subtitle: { color: '#666', fontSize: '14px', marginTop: '4px' },
  warning: { backgroundColor: '#FFF3E0', border: '1px solid #FFB74D', color: '#E65100', padding: '12px', borderRadius: '8px', marginBottom: '20px' },
  error: { backgroundColor: '#fff0f0', border: '1px solid #ffcdd2', color: '#c62828', padding: '12px', borderRadius: '8px', marginBottom: '20px' },
  success: { backgroundColor: '#e8f5e9', border: '1px solid #a5d6a7', color: '#2e7d32', padding: '12px', borderRadius: '8px', marginBottom: '20px' },
  form: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  formGroup: { marginBottom: '24px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '8px' },
  select: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' },
  criteriaSection: { marginBottom: '24px' },
  sectionTitle: { fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '16px' },
  criteriaCard: { padding: '16px', border: '1px solid #eee', borderRadius: '8px', marginBottom: '12px' },
  criteriaHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' },
  criteriaName: { fontWeight: 'bold', fontSize: '15px' },
  criteriaWeight: { fontSize: '12px', color: '#999', marginLeft: '12px' },
  scoreInput: { width: '120px' },
  input: { width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' },
  description: { fontSize: '12px', color: '#666', marginTop: '8px' },
  submitButton: { width: '100%', padding: '14px', backgroundColor: '#2E7D32', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }
};

export default SupervisorEvaluation;