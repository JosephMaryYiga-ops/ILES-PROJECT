import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function SubmitLog() {
  const [placements, setPlacements] = useState([]);
  const [placement, setPlacement] = useState('');
  const [weekNumber, setWeekNumber] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/placements/').then(res => {
      setPlacements(res.data);
      if (res.data.length > 0) setPlacement(res.data[0].id);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Step 1: Create the log as draft
      const createRes = await api.post('/logs/', {
        placement: placement,
        week_number: parseInt(weekNumber),
        content: content,
      });

      const logId = createRes.data.id;

      // Step 2: Submit the log
      await api.post(`/logs/${logId}/submit/`);

      setSuccess('Log submitted successfully!');
      setContent('');
      setWeekNumber('');

      // Redirect to logs page after 2 seconds
      setTimeout(() => navigate('/student/logs'), 2000);

    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit log. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h2 style={styles.navTitle}>ILES</h2>
        <div style={styles.navLinks}>
          <span style={styles.navLink} onClick={() => navigate('/student')}>Dashboard</span>
          <span style={styles.navLink} onClick={() => navigate('/student/logs')}>My Logs</span>
          <span style={styles.navLinkActive}>Submit Log</span>
          <span style={styles.navLink} onClick={handleLogout}>Logout</span>
        </div>
      </div>

      <div style={styles.container}>
        <h1 style={styles.title}>Submit Weekly Log</h1>

        {success && <div style={styles.success}>{success} Redirecting...</div>}
        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.card}>
          <form onSubmit={handleSubmit}>

            {/* Placement */}
            <div style={styles.field}>
              <label style={styles.label}>Internship Placement</label>
              <select
                style={styles.input}
                value={placement}
                onChange={(e) => setPlacement(e.target.value)}
                required
              >
                {placements.length === 0 && <option>No placement found</option>}
                {placements.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.company_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Week Number */}
            <div style={styles.field}>
              <label style={styles.label}>Week Number</label>
              <input
                style={styles.input}
                type="number"
                min="1"
                placeholder="e.g. 1"
                value={weekNumber}
                onChange={(e) => setWeekNumber(e.target.value)}
                required
              />
            </div>

            {/* Content */}
            <div style={styles.field}>
              <label style={styles.label}>What did you do this week?</label>
              <textarea
                style={styles.textarea}
                placeholder="Describe your tasks, what you learned, challenges you faced..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                required
              />
              <p style={styles.charCount}>{content.length} characters</p>
            </div>

            <div style={styles.buttons}>
              <button
                type="button"
                style={styles.cancelBtn}
                onClick={() => navigate('/student')}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={loading ? { ...styles.submitBtn, opacity: 0.7 } : styles.submitBtn}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Log'}
              </button>
            </div>
          </form>
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
  container: { maxWidth: '700px', margin: '0 auto', padding: '32px 16px' },
  title: { color: '#1F4E79', marginBottom: '24px' },
  card: { backgroundColor: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  success: { backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #a5d6a7' },
  error: { backgroundColor: '#ffebee', color: '#c62828', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ef9a9a' },
  field: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px', color: '#333' },
  input: { width: '100%', padding: '12px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '12px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box', resize: 'vertical' },
  charCount: { color: '#999', fontSize: '12px', textAlign: 'right', marginTop: '4px' },
  buttons: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' },
  cancelBtn: { padding: '12px 24px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '14px' },
  submitBtn: { padding: '12px 24px', backgroundColor: '#1F4E79', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
};

export default SubmitLog;