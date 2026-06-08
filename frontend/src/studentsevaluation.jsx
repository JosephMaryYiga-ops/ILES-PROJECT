import { useState, useEffect } from 'react';
import api from './api';
import Navbar from './components/Navbar';

function StudentEvaluation() {
  const [evaluations, setEvaluations] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [evalRes, criteriaRes] = await Promise.all([
        api.get('/evaluations/'),
        api.get('/criteria/')
      ]);
      setEvaluations(evalRes.data);
      setCriteria(criteriaRes.data);
      
      // Calculate weighted total
      let total = 0;
      for (const ev of evalRes.data) {
        const crit = criteriaRes.data.find(c => c.id === ev.criteria);
        if (crit) {
          total += (parseFloat(ev.score) * parseFloat(crit.weight)) / 100;
        }
      }
      setTotalScore(total);
    } catch (error) {
      console.error('Error fetching evaluations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#2E7D32';
    if (score >= 60) return '#F57F17';
    return '#c62828';
  };

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
          <h1 style={styles.title}>My Evaluation</h1>
          <p style={styles.subtitle}>Academic performance assessment</p>
        </div>

        <div style={styles.totalCard}>
          <span style={styles.totalLabel}>Overall Score</span>
          <span style={{...styles.totalScore, color: getScoreColor(totalScore)}}>
            {totalScore.toFixed(1)}%
          </span>
          <span style={styles.totalGrade}>
            {totalScore >= 80 ? 'Excellent' : totalScore >= 60 ? 'Good' : 'Needs Improvement'}
          </span>
        </div>

        <div style={styles.criteriaList}>
          <h3 style={styles.sectionTitle}>Evaluation Breakdown</h3>
          {criteria.map((crit) => {
            const evaluation = evaluations.find(e => e.criteria === crit.id);
            const score = evaluation ? parseFloat(evaluation.score) : 0;
            const contribution = (score * parseFloat(crit.weight)) / 100;
            
            return (
              <div key={crit.id} style={styles.criteriaCard}>
                <div style={styles.criteriaHeader}>
                  <div>
                    <h4 style={styles.criteriaName}>{crit.name}</h4>
                    <p style={styles.criteriaWeight}>Weight: {crit.weight}%</p>
                  </div>
                  <div style={styles.scoreBox}>
                    <span style={styles.scoreValue}>{score}</span>
                    <span style={styles.scoreMax}>/100</span>
                  </div>
                </div>
                <div style={styles.progressBar}>
                  <div style={{...styles.progressFill, width: `${score}%`, backgroundColor: getScoreColor(score)}} />
                </div>
                <div style={styles.contribution}>
                  Contribution to final score: <strong>{contribution.toFixed(1)}%</strong>
                </div>
              </div>
            );
          })}
        </div>

        {evaluations.length === 0 && (
          <div style={styles.empty}>No evaluations yet. Complete your internship for evaluation.</div>
        )}
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
  totalCard: { backgroundColor: 'linear-gradient(135deg, #1A1035, #0D2B2C)', borderRadius: '16px', padding: '32px', textAlign: 'center', marginBottom: '32px' },
  totalLabel: { display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' },
  totalScore: { display: 'block', fontSize: '48px', fontWeight: 'bold', marginBottom: '8px' },
  totalGrade: { fontSize: '14px', color: 'rgba(255,255,255,0.5)' },
  sectionTitle: { fontSize: '18px', fontWeight: 'bold', color: '#1A1A1A', marginBottom: '16px' },
  criteriaList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  criteriaCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  criteriaHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '12px' },
  criteriaName: { fontSize: '16px', fontWeight: 'bold', margin: 0 },
  criteriaWeight: { fontSize: '12px', color: '#999', margin: '4px 0 0 0' },
  scoreBox: { textAlign: 'center' },
  scoreValue: { fontSize: '28px', fontWeight: 'bold', color: '#333' },
  scoreMax: { fontSize: '14px', color: '#999' },
  progressBar: { height: '8px', backgroundColor: '#eee', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' },
  progressFill: { height: '100%', borderRadius: '4px', transition: 'width 0.3s' },
  contribution: { fontSize: '12px', color: '#666', marginTop: '8px' },
  empty: { textAlign: 'center', padding: '60px', backgroundColor: '#fff', borderRadius: '12px', color: '#999' }
};

export default StudentEvaluation;