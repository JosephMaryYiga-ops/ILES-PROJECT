import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

function SubmitLog() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    week_number: '',
    content: '',
    placement: ''
  });
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPlacements();
  }, []);

  const fetchPlacements = async () => {
    try {
      const response = await api.get('/placements/');
      setPlacements(response.data);
    } catch (err) {
      console.error('Error fetching placements:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/logs/', {
        week_number: parseInt(formData.week_number),
        content: formData.content,
        placement: formData.placement || null,
        status: 'submitted'
      });
      toast.success('Weekly log submitted successfully!');
      setFormData({ week_number: '', content: '', placement: '' });
      setTimeout(() => navigate('/student/logs'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to submit log. Please try again.');
      setError(err.response?.data?.detail || 'Failed to submit log. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar active="submit" />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Submit Weekly Log</h1>
          <p style={styles.subtitle}>Record your weekly internship activities</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Week Number *</label>
            <input
              type="number"
              min="1"
              max="52"
              style={styles.input}
              value={formData.week_number}
              onChange={(e) => setFormData({...formData, week_number: e.target.value})}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Placement (Optional)</label>
            <select
              style={styles.input}
              value={formData.placement}
              onChange={(e) => setFormData({...formData, placement: e.target.value})}
            >
              <option value="">Select placement</option>
              {placements.map(p => (
                <option key={p.id} value={p.id}>
                  {p.company_name} ({p.start_date} to {p.end_date})
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Log Content / Activities *</label>
            <textarea
              style={styles.textarea}
              rows="8"
              placeholder="Describe what you did this week..."
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              required
            />
          </div>

          <div style={styles.buttonGroup}>
            <button type="button" onClick={() => navigate('/student/logs')} style={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={styles.submitButton}>
              {loading ? 'Submitting...' : 'Submit Log'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#F5F5F0' },
  container: { maxWidth: '800px', margin: '0 auto', padding: '32px 24px' },
  header: { marginBottom: '32px' },
  title: { fontSize: '28px', fontWeight: 'bold', color: '#1A1A1A', margin: '0 0 8px 0' },
  subtitle: { color: '#666', fontSize: '14px', margin: 0 },
  error: { backgroundColor: '#fff0f0', border: '1px solid #ffcdd2', color: '#c62828', padding: '12px', borderRadius: '8px', marginBottom: '20px' },
  success: { backgroundColor: '#e8f5e9', border: '1px solid #a5d6a7', color: '#2e7d32', padding: '12px', borderRadius: '8px', marginBottom: '20px' },
  form: { backgroundColor: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  formGroup: { marginBottom: '24px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '8px' },
  input: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box', resize: 'vertical' },
  buttonGroup: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' },
  cancelButton: { padding: '12px 24px', backgroundColor: '#f5f5f5', color: '#666', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  submitButton: { padding: '12px 24px', backgroundColor: '#2E7D32', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
};

export default SubmitLog;