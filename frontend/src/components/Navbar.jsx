import { useNavigate } from 'react-router-dom';

const navLinks = {
  student: [
    { label: 'Dashboard', path: '/student', key: 'dashboard' },
    { label: 'My Logs', path: '/student/logs', key: 'logs' },
    { label: 'Submit Log', path: '/student/submit', key: 'submit' },
  ],
  supervisor: [
    { label: 'Dashboard', path: '/supervisor', key: 'dashboard' },
    { label: 'Review Logs', path: '/supervisor/review', key: 'review' },
  ],
  admin: [
    { label: 'Dashboard', path: '/admin', key: 'dashboard' },
    { label: 'Placements', path: '/admin/placement', key: 'placement' },
    { label: 'Evaluations', path: '/admin/evaluation', key: 'evaluation' },
    { label: 'Criteria', path: '/admin/criteria', key: 'criteria' },
  ],
};

const roleColors = {
  student: '#2E7D32',
  workplace_supervisor: '#4A148C',
  academic_supervisor: '#006064',
  admin: '#E65100',
};

const roleLabels = {
  student: 'Student',
  workplace_supervisor: 'Workplace Supervisor',
  academic_supervisor: 'Academic Supervisor',
  admin: 'Administrator',
};

function Navbar({ active }) {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');
  const links = role === 'student' ? navLinks.student
    : role === 'admin' ? navLinks.admin
    : navLinks.supervisor;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.left}>
        <div style={styles.logoBlock}>
          <span style={styles.logoText}>ILES</span>
          <span style={styles.logoSub}>Internship &amp; Logging Evaluation System</span>
        </div>
        <div style={styles.links}>
          {links.map(link => (
            <span
              key={link.key}
              style={active === link.key ? styles.linkActive : styles.link}
              onClick={() => navigate(link.path)}
            >
              {link.label}
            </span>
          ))}
        </div>
      </div>
      <div style={styles.right}>
        <div style={{ ...styles.roleBadge, backgroundColor: roleColors[role] || '#333' }}>
          {roleLabels[role] || role}
        </div>
        <span style={styles.username}>{username}</span>
        <button style={styles.logoutBtn} onClick={handleLogout}>Sign Out</button>
      </div>
    </nav>
  );
}

const styles = {
  navbar: { background: 'linear-gradient(135deg, #0f1f10 0%, #1A1035 100%)', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px', position: 'sticky', top: 0, zIndex: 100 },
  left: { display: 'flex', alignItems: 'center', gap: '32px' },
  logoBlock: { display: 'flex', flexDirection: 'column' },
  logoText: { color: '#fff', fontSize: '16px', fontWeight: 'bold', letterSpacing: '3px' },
  logoSub: { color: 'rgba(255,255,255,0.35)', fontSize: '8px', letterSpacing: '1px', textTransform: 'uppercase' },
  links: { display: 'flex', gap: '4px' },
  link: { color: 'rgba(255,255,255,0.55)', cursor: 'pointer', fontSize: '13px', padding: '6px 12px', borderRadius: '6px' },
  linkActive: { color: '#fff', cursor: 'pointer', fontSize: '13px', padding: '6px 12px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.1)', fontWeight: '600' },
  right: { display: 'flex', alignItems: 'center', gap: '12px' },
  roleBadge: { color: '#fff', padding: '3px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' },
  username: { color: 'rgba(255,255,255,0.7)', fontSize: '13px' },
  logoutBtn: { backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '5px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
};

export default Navbar;