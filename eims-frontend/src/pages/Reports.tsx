import { useState, useEffect, useCallback } from 'react';
import { BarChart2, Users, School, GitBranch, BookOpen, Video, FileText, TrendingUp, RefreshCw, AlertCircle, DollarSign } from 'lucide-react';
import api from '../lib/api';
import { schoolsApi, type School as SchoolType } from '../lib/api';

interface DashboardSummary { schools: number; branches: number; users: number; classes: number; sessions: number; assignments: number; paidInvoices: number; }
interface SchoolSummary { school: any; academic: any; finance: any; }

const kpiColors = ['#a78bfa', '#7dd3fc', '#6ee7b7', '#fdba74', '#f9a8d4', '#fb923c', '#34d399'];

export default function Reports() {
  const [dashSummary, setDashSummary] = useState<DashboardSummary | null>(null);
  const [schools, setSchools] = useState<SchoolType[]>([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [schoolSummary, setSchoolSummary] = useState<SchoolSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingSchool, setLoadingSchool] = useState(false);
  const [error, setError] = useState('');

  const fetchDashboard = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [dash, schoolList] = await Promise.all([api.get('/reports/dashboard'), schoolsApi.getAll()]);
      setDashSummary(dash.data);
      setSchools(schoolList);
    } catch { setError('Failed to load reports'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  useEffect(() => {
    if (!selectedSchool) { setSchoolSummary(null); return; }
    setLoadingSchool(true);
    api.get(`/reports/school/${selectedSchool}/summary`)
      .then(r => setSchoolSummary(r.data))
      .catch(() => {})
      .finally(() => setLoadingSchool(false));
  }, [selectedSchool]);

  const kpis = dashSummary ? [
    { label: 'Total Schools', value: dashSummary.schools, icon: School },
    { label: 'Total Branches', value: dashSummary.branches, icon: GitBranch },
    { label: 'Registered Users', value: dashSummary.users, icon: Users },
    { label: 'Active Classes', value: dashSummary.classes, icon: BookOpen },
    { label: 'Sessions Held', value: dashSummary.sessions, icon: Video },
    { label: 'Assignments', value: dashSummary.assignments, icon: FileText },
    { label: 'Fees Collected', value: dashSummary.paidInvoices, icon: DollarSign },
  ] : [];

  const exportCSV = () => {
    if (!dashSummary) return;
    const data = [
      ['Metric', 'Value'],
      ['Total Schools', dashSummary.schools],
      ['Total Branches', dashSummary.branches],
      ['Registered Users', dashSummary.users],
      ['Active Classes', dashSummary.classes],
      ['Sessions Held', dashSummary.sessions],
      ['Assignments', dashSummary.assignments],
      ['Fees Collected', dashSummary.paidInvoices]
    ];
    const csvContent = "data:text/csv;charset=utf-8," + data.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "eims_system_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ maxWidth: 1200 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.6, color: 'rgba(255,255,255,0.95)', marginBottom: 6 }}>Reports & Analytics</h1>
          <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.4)' }}>System-wide KPIs and performance metrics</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={fetchDashboard} className="btn-ghost" style={{ padding: '10px 14px' }} disabled={loading}><RefreshCw size={15} /></button>
          <button onClick={exportCSV} className="btn-primary" style={{ padding: '10px 18px', fontSize: 13.5 }} disabled={loading || !dashSummary}>
            <FileText size={15} /> Export CSV
          </button>
        </div>
      </div>

      {error && <div style={{ marginBottom: 18, padding: '12px 16px', background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.2)', borderRadius: 12, color: '#ff8a80', fontSize: 13.5, display: 'flex', gap: 8 }}><AlertCircle size={15} />{error}</div>}

      {/* KPI Grid */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 16 }}>SYSTEM OVERVIEW</div>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" style={{ width: 32, height: 32 }} /></div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
            {kpis.map((k, i) => (
              <div key={k.label} className="stat-card" style={{ padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${kpiColors[i]}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <k.icon size={18} style={{ color: kpiColors[i] }} />
                  </div>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: kpiColors[i], letterSpacing: -1, marginBottom: 4 }}>{k.value}</div>
                <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.4)' }}>{k.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* School Deep-Dive */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 16 }}>SCHOOL SUMMARY</div>
        <select value={selectedSchool} onChange={e => setSelectedSchool(e.target.value)} style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter, sans-serif', fontSize: 14, outline: 'none', minWidth: 280, marginBottom: 18 }}>
          <option value="" style={{ background: '#1a1a2e' }}>Select a school...</option>
          {schools.map(s => <option key={s.id} value={s.id} style={{ background: '#1a1a2e' }}>{s.name}</option>)}
        </select>

        {loadingSchool ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>
        ) : schoolSummary && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            {/* Academic Stats */}
            <div className="glass-card" style={{ padding: '22px 24px' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.7 }}>Academic</div>
              {[['Branches', schoolSummary.school?.branches, '#a78bfa'], ['Classes', schoolSummary.academic?.classes, '#7dd3fc'], ['Subjects', schoolSummary.academic?.subjects, '#6ee7b7']].map(([label, value, color]) => (
                <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.5)' }}>{label}</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: color as string }}>{value ?? '—'}</span>
                </div>
              ))}
            </div>
            {/* Finance Stats */}
            <div className="glass-card" style={{ padding: '22px 24px' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.7 }}>Finance</div>
              {[
                ['Total Expenses', `₹${(schoolSummary.finance?.totalExpenses || 0).toLocaleString('en-IN')}`, '#ff8a80'],
                ['Total Invoices', schoolSummary.finance?.totalInvoices, '#fdba74'],
                ['Paid Invoices', schoolSummary.finance?.paidInvoices, '#6ee7b7'],
                ['Collection Rate', `${schoolSummary.finance?.collectionRate || 0}%`, '#a78bfa'],
              ].map(([label, value, color]) => (
                <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.5)' }}>{label}</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: color as string }}>{value ?? '—'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {!selectedSchool && !loadingSchool && (
          <div className="empty-state" style={{ padding: '40px 0' }}><BarChart2 size={36} style={{ opacity: 0.2 }} /><p>Select a school to view its analytics</p></div>
        )}
      </div>
    </div>
  );
}
