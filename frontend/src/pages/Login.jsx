import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login/', { username, password });
      const { access, refresh, user } = response.data;
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      localStorage.setItem('role', user.role);
      localStorage.setItem('username', user.username);
      localStorage.setItem('user_id', user.id);

      console.log('User role from backend:', user.role);
      navigate('/admin');
      
    } catch (err) {
      toast.error('Invalid username or password. Please try again.');
      setError('Invalid username or password. Please try again.');
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
          <h1 style={styles.systemName}>Internship &<br />Logging Evaluation<br />System</h1>
          <p style={styles.tagline}>Manage your internship progress easily</p>
          <div style={styles.pills}>
            <a href="/signup?role=student" style={{ ...styles.pill, background: '#2E7D32', textDecoration: 'none', cursor: 'pointer' }}>Students</a>
            <a href="/signup?role=workplace_supervisor" style={{ ...styles.pill, background: '#4A148C', textDecoration: 'none', cursor: 'pointer' }}>Supervisors</a>
            <a href="/signup?role=admin" style={{ ...styles.pill, background: '#E65100', textDecoration: 'none', cursor: 'pointer' }}>Admins</a>
            <a href="/signup?role=evaluator" style={{ ...styles.pill, background: '#006064', textDecoration: 'none', cursor: 'pointer' }}>Evaluators</a>
          </div>
        </div>
        <div style={styles.credit}>
          <p style={styles.creditText}>Developed by :</p>
          <p style={styles.creditText}>Joseph Mary Yiga · Nyerere Shantinah · Bagonza Julius</p>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.formBox}>
          <div style={styles.accentBar} />
          <h2 style={styles.formTitle}>Welcome Back</h2>
          <p style={styles.formSub}>Sign in to access your dashboard</p>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleLogin}>
            <div style={styles.field}>
              <label style={styles.label}>Username</label>
              <input style={styles.input} type="text" placeholder="Enter your username" value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input style={styles.input} type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" style={loading ? { ...styles.btn, opacity: 0.7 } : styles.btn} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>
              Don't have an account?{' '}
              <a href="/signup" style={{ color: '#E65100', textDecoration: 'none', fontWeight: '600' }}>
                Sign Up
              </a>
            </p>
          </div>

          <div style={styles.roles}>
            <p style={styles.rolesTitle}>Access Levels</p>
            <div style={styles.roleGrid}>
              <a href="/signup?role=student" style={{ ...styles.roleCard, borderTop: '3px solid #2E7D32', textDecoration: 'none', cursor: 'pointer' }}>
                <span style={styles.roleIcon}>🎓</span>
                <span style={styles.roleLabel}>Student</span>
              </a>
              <a href="/signup?role=workplace_supervisor" style={{ ...styles.roleCard, borderTop: '3px solid #4A148C', textDecoration: 'none', cursor: 'pointer' }}>
                <span style={styles.roleIcon}>👔</span>
                <span style={styles.roleLabel}>Supervisor</span>
              </a>
              <a href="/signup?role=admin" style={{ ...styles.roleCard, borderTop: '3px solid #E65100', textDecoration: 'none', cursor: 'pointer' }}>
                <span style={styles.roleIcon}>⚙️</span>
                <span style={styles.roleLabel}>Admin</span>
              </a>
              <a href="/signup?role=evaluator" style={{ ...styles.roleCard, borderTop: '3px solid #006064', textDecoration: 'none', cursor: 'pointer' }}>
                <span style={styles.roleIcon}>📋</span>
                <span style={styles.roleLabel}>Evaluator</span>
              </a>
            </div>
          </div>
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
  pills: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  pill: { color: '#fff', padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  credit: { position: 'relative', zIndex: 2, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' },
  creditText: { color: 'rgba(255,255,255,0.3)', fontSize: '11px', margin: '3px 0', fontFamily: 'monospace' },
  right: { width: '55%', backgroundColor: '#F7F6F3', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  formBox: { width: '100%', maxWidth: '400px', padding: '48px 32px' },
  accentBar: { width: '44px', height: '4px', background: 'linear-gradient(90deg, #2E7D32, #4A148C, #E65100)', borderRadius: '2px', marginBottom: '20px' },
  formTitle: { fontSize: '28px', fontWeight: 'bold', color: '#1A1A1A', margin: '0 0 6px 0' },
  formSub: { color: '#888', fontSize: '14px', margin: '0 0 32px 0' },
  error: { backgroundColor: '#fff0f0', border: '1px solid #ffcdd2', color: '#c62828', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' },
  field: { marginBottom: '20px' },
  label: { display: 'block', fontSize: '11px', fontWeight: '700', color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' },
  input: { width: '100%', padding: '12px 14px', border: '2px solid #E8E8E8', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', outline: 'none', backgroundColor: '#fff' },
  btn: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #2E7D32 0%, #4A148C 50%, #006064 100%)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', letterSpacing: '0.5px', marginTop: '8px' },
  roles: { marginTop: '36px' },
  rolesTitle: { fontSize: '11px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' },
  roleGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px' },
  roleCard: { backgroundColor: '#fff', borderRadius: '8px', padding: '12px 6px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  roleIcon: { fontSize: '18px' },
  roleLabel: { fontSize: '10px', color: '#666', fontWeight: '600' },
};

export default Login;