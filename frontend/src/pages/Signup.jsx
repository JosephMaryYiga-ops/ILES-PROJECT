import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRoleInfo, setShowRoleInfo] = useState(false);
  const [selectedRoleInfo, setSelectedRoleInfo] = useState('');

  const roleInfo = {
    student: {
      title: 'Student Account',
      description: '✓ Submit weekly internship logs\n✓ Track your progress\n✓ Receive feedback from supervisors\n✓ View evaluations'
    },
    workplace_supervisor: {
      title: 'Workplace Supervisor Account',
      description: '✓ Review student logs\n✓ Provide feedback and ratings\n✓ Monitor intern progress\n✓ Submit evaluations'
    },
    academic_supervisor: {
      title: 'Academic Supervisor Account',
      description: '✓ Oversee multiple students\n✓ Approve final evaluations\n✓ Generate reports\n✓ Coordinate with workplace supervisors'
    },
    admin: {
      title: 'Administrator Account',
      description: '✓ Full system access\n✓ Manage all users\n✓ Configure evaluation criteria\n✓ View system analytics'
    },
    evaluator: {
      title: 'Evaluator Account',
      description: '✓ Assess student performance\n✓ Conduct final evaluations\n✓ Review internship outcomes'
    }
  };

  const handleRoleClick = (role) => {
    setFormData({ ...formData, role: role });
    setSelectedRoleInfo(roleInfo[role] || roleInfo.student);
    setShowRoleInfo(true);
    setTimeout(() => setShowRoleInfo(false), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      await api.post('/auth/register/', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      alert(`Registration successful! Please login as ${formData.role}.`);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <div style={styles.circle1} />
        <div style={styles.circle2} />
        <div style={styles.content}>
          <div style={styles.logoBox}><span style={styles.logoText}>ILES</span></div>
          <h1 style={styles.systemName}>Create<br />Account</h1>
          <p style={styles.tagline}>Join the Internship & Logging Evaluation System</p>
        </div>
        <div style={styles.credit}>
          <p style={styles.creditText}>Developed by :</p>
          <p style={styles.creditText}>Joseph Mary Yiga · Nyerere Shantinah · Bagonza Julius</p>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.formBox}>
          <div style={styles.accentBar} />
          <h2 style={styles.formTitle}>Sign Up</h2>
          <p style={styles.formSub}>Choose your role and create an account</p>

          {error && <div style={styles.error}>{error}</div>}
          
          {showRoleInfo && selectedRoleInfo && (
            <div style={styles.infoBox}>
              <strong>{selectedRoleInfo.title}</strong>
              <pre style={styles.infoText}>{selectedRoleInfo.description}</pre>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>Username</label>
              <input style={styles.input} type="text" placeholder="Choose a username" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input style={styles.input} type="email" placeholder="your@email.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input style={styles.input} type="password" placeholder="Create a password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Confirm Password</label>
              <input style={styles.input} type="password" placeholder="Confirm your password" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} required />
            </div>
            
            <div style={styles.roleSelection}>
              <p style={styles.roleLabel}>Select Account Type:</p>
              <div style={styles.roleButtons}>
                <button type="button" style={{...styles.roleBtn, backgroundColor: formData.role === 'student' ? '#2E7D32' : '#eee', color: formData.role === 'student' ? '#fff' : '#333'}} onClick={() => handleRoleClick('student')}>Student</button>
                <button type="button" style={{...styles.roleBtn, backgroundColor: formData.role === 'workplace_supervisor' ? '#4A148C' : '#eee', color: formData.role === 'workplace_supervisor' ? '#fff' : '#333'}} onClick={() => handleRoleClick('workplace_supervisor')}>Workplace Supervisor</button>
                <button type="button" style={{...styles.roleBtn, backgroundColor: formData.role === 'academic_supervisor' ? '#006064' : '#eee', color: formData.role === 'academic_supervisor' ? '#fff' : '#333'}} onClick={() => handleRoleClick('academic_supervisor')}>Academic Supervisor</button>
                <button type="button" style={{...styles.roleBtn, backgroundColor: formData.role === 'admin' ? '#E65100' : '#eee', color: formData.role === 'admin' ? '#fff' : '#333'}} onClick={() => handleRoleClick('admin')}>Admin</button>
                <button type="button" style={{...styles.roleBtn, backgroundColor: formData.role === 'evaluator' ? '#1565C0' : '#eee', color: formData.role === 'evaluator' ? '#fff' : '#333'}} onClick={() => handleRoleClick('evaluator')}>Evaluator</button>
              </div>
            </div>

            <button type="submit" style={loading ? { ...styles.btn, opacity: 0.7 } : styles.btn} disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up →'}
            </button>
          </form>

          <p style={styles.loginLink}>
            Already have an account? <Link to="/" style={styles.link}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', fontFamily: 'Arial, sans-serif' },
  left: { width: '45%', background: 'linear-gradient(135deg, #0f1f10 0%, #1A1035 60%, #0D2B2C 100%)', padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' },
  circle1: { position: 'absolute', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(46,125,50,0.2) 0%, transparent 70%)', top: '-100px', left: '-100px' },
  circle2: { position: 'absolute', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,20,140,0.3) 0%, transparent 70%)', bottom: '-50px', right: '-50px' },
  content: { position: 'relative', zIndex: 2, marginTop: '60px' },
  logoBox: { display: 'inline-block', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '4px 16px', marginBottom: '20px' },
  logoText: { color: '#fff', fontSize: '16px', fontWeight: 'bold', letterSpacing: '4px' },
  systemName: { color: '#fff', fontSize: '32px', fontWeight: 'bold', lineHeight: 1.3, margin: '0 0 12px 0' },
  tagline: { color: 'rgba(255,255,255,0.4)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 28px 0' },
  credit: { position: 'relative', zIndex: 2, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' },
  creditText: { color: 'rgba(255,255,255,0.3)', fontSize: '11px', margin: '3px 0', fontFamily: 'monospace' },
  right: { width: '55%', backgroundColor: '#F7F6F3', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  formBox: { width: '100%', maxWidth: '450px', padding: '48px 32px' },
  accentBar: { width: '44px', height: '4px', background: 'linear-gradient(90deg, #2E7D32, #4A148C, #E65100)', borderRadius: '2px', marginBottom: '20px' },
  formTitle: { fontSize: '28px', fontWeight: 'bold', color: '#1A1A1A', margin: '0 0 6px 0' },
  formSub: { color: '#888', fontSize: '14px', margin: '0 0 32px 0' },
  error: { backgroundColor: '#fff0f0', border: '1px solid #ffcdd2', color: '#c62828', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' },
  infoBox: { backgroundColor: '#e3f2fd', border: '1px solid #90caf9', color: '#1565c0', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '12px' },
  infoText: { margin: '8px 0 0 0', whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '11px', lineHeight: 1.5 },
  field: { marginBottom: '18px' },
  label: { display: 'block', fontSize: '11px', fontWeight: '700', color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' },
  input: { width: '100%', padding: '12px 14px', border: '2px solid #E8E8E8', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', outline: 'none', backgroundColor: '#fff' },
  roleSelection: { marginBottom: '20px' },
  roleLabel: { fontSize: '11px', fontWeight: '700', color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' },
  roleButtons: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  roleBtn: { padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600' },
  btn: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #2E7D32 0%, #4A148C 50%, #006064 100%)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', letterSpacing: '0.5px', marginTop: '8px' },
  loginLink: { textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#888' },
  link: { color: '#E65100', textDecoration: 'none', fontWeight: '600' },
};

export default Signup;