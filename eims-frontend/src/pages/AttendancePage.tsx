import { useState, useEffect, useCallback } from 'react';
import { CheckSquare, XSquare, Clock, Search, Plus, RefreshCw, AlertCircle, Calendar, ChevronDown, Check, X } from 'lucide-react';
import api from '../lib/api';
import { classesApi, type ClassRecord } from '../lib/api';

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE';
type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

interface AttendanceRecord { studentId: string; status: AttendanceStatus; date: string; }
interface LeaveRequest { id: string; studentId: string; fromDate: string; toDate: string; reason: string; status: LeaveStatus; createdAt: string; }

const statusStyle: Record<AttendanceStatus, { bg: string; color: string; border: string }> = {
  PRESENT: { bg: 'rgba(52,211,153,0.15)', color: '#6ee7b7', border: 'rgba(52,211,153,0.25)' },
  ABSENT:  { bg: 'rgba(255,59,48,0.12)', color: '#ff8a80', border: 'rgba(255,59,48,0.2)' },
  LATE:    { bg: 'rgba(251,146,60,0.15)', color: '#fdba74', border: 'rgba(251,146,60,0.25)' },
};
const leaveStyle: Record<LeaveStatus, { bg: string; color: string }> = {
  PENDING:  { bg: 'rgba(251,146,60,0.12)', color: '#fdba74' },
  APPROVED: { bg: 'rgba(52,211,153,0.12)', color: '#6ee7b7' },
  REJECTED: { bg: 'rgba(255,59,48,0.1)', color: '#ff8a80' },
};

export default function Attendance() {
  const [tab, setTab] = useState<'attendance' | 'leaves'>('attendance');
  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ studentId: '', fromDate: '', toDate: '', reason: '' });

  useEffect(() => { classesApi.getAll().then(setClasses).catch(() => {}); }, []);

  const fetchAttendance = useCallback(async () => {
    if (!selectedClass || !date) return;
    setLoading(true); setError('');
    try {
      const res = await api.get(`/attendance?classId=${selectedClass}&date=${date}`);
      setAttendance(res.data);
    } catch (e: any) { setError('Failed to load attendance'); }
    finally { setLoading(false); }
  }, [selectedClass, date]);

  const fetchLeaves = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await api.get('/leave-requests');
      setLeaveRequests(res.data);
    } catch (e: any) { setError('Failed to load leave requests'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { if (tab === 'attendance') fetchAttendance(); else fetchLeaves(); }, [tab, fetchAttendance, fetchLeaves]);

  const markStatus = async (studentId: string, status: AttendanceStatus) => {
    setSaving(true);
    try {
      await api.post('/attendance', { classId: selectedClass, studentId, date, status });
      setAttendance(prev => {
        const existing = prev.find(a => a.studentId === studentId);
        if (existing) return prev.map(a => a.studentId === studentId ? { ...a, status } : a);
        return [...prev, { studentId, status, date }];
      });
    } catch {}
    finally { setSaving(false); }
  };

  const updateLeave = async (id: string, status: LeaveStatus) => {
    try {
      await api.patch(`/leave-requests/${id}`, { status });
      setLeaveRequests(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    } catch {}
  };

  const submitLeave = async () => {
    if (!leaveForm.studentId || !leaveForm.fromDate || !leaveForm.toDate) return;
    try {
      await api.post('/leave-requests', leaveForm);
      setShowLeaveModal(false);
      setLeaveForm({ studentId: '', fromDate: '', toDate: '', reason: '' });
      fetchLeaves();
    } catch {}
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.6, color: 'rgba(255,255,255,0.95)', marginBottom: 6 }}>Attendance</h1>
          <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.4)' }}>Track class attendance and manage leave requests</p>
        </div>
        {tab === 'leaves' && (
          <button onClick={() => setShowLeaveModal(true)} className="btn-primary" style={{ width: 'auto', padding: '11px 20px', fontSize: 14 }}>
            <Plus size={16} /> New Leave Request
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 22, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 5, width: 'fit-content' }}>
        {(['attendance', 'leaves'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 20px', borderRadius: 10, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s ease', border: 'none', background: tab === t ? 'rgba(124,109,255,0.25)' : 'transparent', color: tab === t ? '#a78bfa' : 'rgba(255,255,255,0.4)' }}>
            {t === 'attendance' ? 'Mark Attendance' : 'Leave Requests'}
          </button>
        ))}
      </div>

      {error && <div style={{ marginBottom: 18, padding: '12px 16px', background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.2)', borderRadius: 12, color: '#ff8a80', fontSize: 13.5, display: 'flex', gap: 8, alignItems: 'center' }}><AlertCircle size={15} />{error}</div>}

      {/* Attendance Tab */}
      {tab === 'attendance' && (
        <>
          <div style={{ display: 'flex', gap: 14, marginBottom: 22, flexWrap: 'wrap' }}>
            <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} style={{ flex: 1, minWidth: 200, padding: '12px 16px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter, sans-serif', fontSize: 14, outline: 'none' }}>
              <option value="" style={{ background: '#1a1a2e' }}>Select class...</option>
              {classes.map(c => <option key={c.id} value={c.id} style={{ background: '#1a1a2e' }}>{c.name}</option>)}
            </select>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} max={today} style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter, sans-serif', fontSize: 14, outline: 'none' }} />
            <button onClick={fetchAttendance} className="btn-ghost" style={{ padding: '12px 16px' }} disabled={loading}><RefreshCw size={15} /></button>
          </div>

          {!selectedClass ? (
            <div className="empty-state"><Calendar size={36} style={{ opacity: 0.25 }} /><p>Select a class to mark attendance</p></div>
          ) : loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" style={{ width: 32, height: 32 }} /></div>
          ) : (
            <div className="content-card" style={{ overflow: 'hidden' }}>
              <div className="card-header">
                <span className="card-title">Attendance — {new Date(date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <div style={{ display: 'flex', gap: 10, fontSize: 12 }}>
                  {['PRESENT', 'ABSENT', 'LATE'].map(s => {
                    const count = attendance.filter(a => a.status === s).length;
                    const st = statusStyle[s as AttendanceStatus];
                    return <span key={s} style={{ padding: '3px 10px', borderRadius: 20, background: st.bg, color: st.color, border: `1px solid ${st.border}`, fontWeight: 600 }}>{count} {s}</span>;
                  })}
                </div>
              </div>
              {attendance.length === 0 ? (
                <div className="empty-state" style={{ padding: '40px 0' }}><p style={{ color: 'rgba(255,255,255,0.3)' }}>No attendance records yet for this date.</p></div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>{['Student ID', 'Status', 'Actions'].map(col => <th key={col} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: 0.8, textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{col}</th>)}</tr>
                    </thead>
                    <tbody>
                      {attendance.map((a, i) => {
                        const st = statusStyle[a.status];
                        return (
                          <tr key={a.studentId} style={{ borderBottom: i < attendance.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                            <td style={{ padding: '13px 20px', fontSize: 13, fontFamily: 'monospace', color: 'rgba(255,255,255,0.65)' }}>{a.studentId.slice(0, 12)}…</td>
                            <td style={{ padding: '13px 20px' }}>
                              <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>{a.status}</span>
                            </td>
                            <td style={{ padding: '13px 20px' }}>
                              <div style={{ display: 'flex', gap: 6 }}>
                                {(['PRESENT', 'ABSENT', 'LATE'] as AttendanceStatus[]).map(s => (
                                  <button key={s} onClick={() => markStatus(a.studentId, s)} disabled={saving || a.status === s} className="btn-ghost" style={{ padding: '4px 10px', fontSize: 11, opacity: a.status === s ? 0.3 : 1 }}>{s}</button>
                                ))}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Leave Requests Tab */}
      {tab === 'leaves' && (
        loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" style={{ width: 32, height: 32 }} /></div>
        ) : leaveRequests.length === 0 ? (
          <div className="empty-state"><CheckSquare size={36} style={{ opacity: 0.25 }} /><p>No leave requests yet.</p></div>
        ) : (
          <div className="content-card" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>{['Student', 'From', 'To', 'Reason', 'Status', 'Actions'].map(col => <th key={col} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: 0.8, textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)', whiteSpace: 'nowrap' }}>{col}</th>)}</tr>
                </thead>
                <tbody>
                  {leaveRequests.map((l, i) => {
                    const ls = leaveStyle[l.status];
                    return (
                      <tr key={l.id} style={{ borderBottom: i < leaveRequests.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <td style={{ padding: '13px 20px', fontSize: 12, fontFamily: 'monospace', color: 'rgba(255,255,255,0.55)' }}>{l.studentId.slice(0, 10)}…</td>
                        <td style={{ padding: '13px 20px', fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>{new Date(l.fromDate).toLocaleDateString('en-IN')}</td>
                        <td style={{ padding: '13px 20px', fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>{new Date(l.toDate).toLocaleDateString('en-IN')}</td>
                        <td style={{ padding: '13px 20px', fontSize: 13, color: 'rgba(255,255,255,0.5)', maxWidth: 200 }}><div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.reason || '—'}</div></td>
                        <td style={{ padding: '13px 20px' }}>
                          <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: ls.bg, color: ls.color }}>{l.status}</span>
                        </td>
                        <td style={{ padding: '13px 20px' }}>
                          {l.status === 'PENDING' && (
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button onClick={() => updateLeave(l.id, 'APPROVED')} className="btn-ghost" style={{ padding: '5px 10px', fontSize: 12, color: '#6ee7b7' }}><Check size={13} /></button>
                              <button onClick={() => updateLeave(l.id, 'REJECTED')} className="btn-ghost danger" style={{ padding: '5px 10px', fontSize: 12 }}><X size={13} /></button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {showLeaveModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setShowLeaveModal(false)}>
          <div style={{ background: 'rgba(18,18,32,0.95)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: 32, width: '100%', maxWidth: 460, backdropFilter: 'blur(40px)' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 6 }}>New Leave Request</h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>Submit a leave request for a student</p>
            {[{ key: 'studentId', label: 'Student ID', placeholder: 'Student user ID' }, { key: 'fromDate', label: 'From Date', placeholder: '', type: 'date' }, { key: 'toDate', label: 'To Date', placeholder: '', type: 'date' }, { key: 'reason', label: 'Reason', placeholder: 'Reason for leave' }].map(f => (
              <div key={f.key} className="input-group">
                <label>{f.label}</label>
                <div className="input-wrap"><input type={f.type || 'text'} placeholder={f.placeholder} value={(leaveForm as any)[f.key]} onChange={e => setLeaveForm(p => ({ ...p, [f.key]: e.target.value }))} style={{ paddingLeft: 16 }} /></div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowLeaveModal(false)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 2 }} onClick={submitLeave}>Submit Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
