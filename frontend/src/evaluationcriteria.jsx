import { useState, useEffect } from 'react';
import api from './src/api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

function EvaluationCriteria() {
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    weight: '',
    evaluator: 'academic'
  });

  useEffect(() => {
    fetchCriteria();
  }, []);

  const fetchCriteria = async () => {
    try {
      const response = await api.get('/criteria/');
      setCriteria(response.data);
    } catch (error) {
      console.error('Error fetching criteria:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/criteria/', formData);
      setShowForm(false);
      setFormData({ name: '', description: '', weight: '', evaluator: 'academic' });
      fetchCriteria();
      toast.success('Criteria created successfully!');
    } catch (error) {
      console.error('Error creating criteria:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this evaluation criteria?')) {
      try {
        await api.delete(`/criteria/${id}/`);
        fetchCriteria();
        toast.success('Criteria deleted successfully!');
      } catch (error) {
        console.error('Error deleting criteria:', error);
      }
    }
  };

  const getEvaluatorColor = (evaluator) => {
    return evaluator === 'workplace' ? '#4A148C' : '#006064';
  };

  const totalWeight = criteria.reduce((sum, c) => sum + parseFloat(c.weight || 0), 0);

  if (loading) return (
    <div style={styles.page}>
      <Navbar active="criteria" />
      <div style={styles.container}>Loading...</div>
    </div>
  );

  return (
    <div style={styles.page}>
      <Navbar active="criteria" />
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Evaluation Criteria</h1>
            <p style={styles.subtitle}>Define weighted grading criteria for student evaluations</p>
          </div>
          <button style={styles.addButton} onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Criteria'}
          </button>
        </div>

        {totalWeight !== 100 && criteria.length > 0 && (
          <div style={styles.warning}>
            ⚠️ Total weight is {totalWeight}%. It should be 100%.
          </div>
        )}

        {showForm && (
          <div style={styles.formCard}>
            <h3>New Evaluation Criteria</h3>
            <form onSubmit={handleCreate}>
              <div style={styles.formGrid}>
                <input
                  style={styles.input}
                  placeholder="Criteria Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
                <input
                  style={styles.input}
                  type="number"
                  step="0.01"
                  placeholder="Weight (%)"
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  required
                />
                <select
                  style={styles.input}
                  value={formData.evaluator}
                  onChange={(e) => setFormData({...formData, evaluator: e.target.value})}
                >
                  <option value="academic">Academic Supervisor</option>
                  <option value="workplace">Workplace Supervisor</option>
                </select>
              </div>
              <textarea
                style={styles.textarea}
                placeholder="Description"
                rows="2"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
              <button type="submit" style={styles.submitButton}>Create Criteria</button>
            </form>
          </div>
        )}

        <div style={styles.criteriaList}>
          {criteria.map((item) => (
            <div key={item.id} style={styles.criteriaCard}>
              <div style={styles.criteriaHeader}>
                <div>
                  <h3 style={styles.criteriaName}>{item.name}</h3>
                  <span style={{...styles.evaluatorBadge, backgroundColor: getEvaluatorColor(item.evaluator)}}>
                    {item.evaluator === 'workplace' ? 'Workplace Supervisor' : 'Academic Supervisor'}
                  </span>
                </div>
                <div style={styles.criteriaActions}>
                  <span style={styles.weightBadge}>{item.weight}%</span>
                  <button style={styles.deleteButton} onClick={() => handleDelete(item.id)}>Delete</button>
                </div>
              </div>
              {item.description && <p style={styles.description}>{item.description}</p>}
            </div>
          ))}
        </div>

        {criteria.length === 0 && (
          <div style={styles.empty}>No evaluation criteria defined. Add your first criteria above.</div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#F5F5F0' },
  container: { maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' },
  title: { fontSize: '28px', fontWeight: 'bold', color: '#1A1A1A', margin: 0 },
  subtitle: { color: '#666', fontSize: '14px', marginTop: '4px' },
  addButton: { padding: '10px 20px', backgroundColor: '#2E7D32', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  warning: { backgroundColor: '#FFF3E0', border: '1px solid #FFB74D', color: '#E65100', padding: '12px', borderRadius: '8px', marginBottom: '20px' },
  formCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' },
  input: { padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' },
  textarea: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', marginBottom: '16px', fontFamily: 'inherit', boxSizing: 'border-box' },
  submitButton: { padding: '10px 20px', backgroundColor: '#2196F3', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  criteriaList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  criteriaCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  criteriaHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' },
  criteriaName: { fontSize: '16px', fontWeight: 'bold', margin: '0 0 4px 0' },
  evaluatorBadge: { padding: '2px 10px', borderRadius: '12px', color: '#fff', fontSize: '11px' },
  criteriaActions: { display: 'flex', alignItems: 'center', gap: '12px' },
  weightBadge: { backgroundColor: '#E8F5E9', color: '#2E7D32', padding: '4px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' },
  deleteButton: { backgroundColor: '#e74c3c', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
  description: { color: '#666', fontSize: '13px', margin: '8px 0 0 0' },
  empty: { textAlign: 'center', padding: '60px', backgroundColor: '#fff', borderRadius: '12px', color: '#999' }
};

export default EvaluationCriteria;