import { useState, useEffect, useCallback } from 'react';
import { FileText, Plus, Clock, CheckCircle, AlertCircle, RefreshCw, Trash2, ChevronRight, Award, Send } from 'lucide-react';
import api from '../lib/api';
import { classesApi, type ClassRecord } from '../lib/api';

interface Assignment { id: string; title: string; description?: string; dueDate: string; maxMarks?: number; classId: string; teacherId: string; class?: { name: string }; _count?: { submissions: number }; }
interface Submission { id: string; studentId: string; text?: string; submittedAt: string; isLate: boolean; marks?: number; feedback?: string; gradedAt?: string; }

export default function Assignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', dueDate: '', maxMarks: '', classId: '', teacherId: 'admin' });
  const [grading, setGrading] = useState<Record<string, { marks: string; feedback: string }>>({});

  const fetchAssignments = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await api.get(`/assignments${selectedClass ? `?classId=${selectedClass}` : ''}`);
      setAssignments(res.data);
    } catch (e: any) { setError('Failed to load assignments'); }
    finally { setLoading(false); }
  }, [selectedClass]);

  useEffect(() => { fetchAssignments(); classesApi.getAll().then(setClasses).catch(() => {}); }, [fetchAssignments]);

  const openSubmissions = async (a: Assignment) => {
    setSelectedAssignment(a);
    setLoadingSubs(true);
    try {
      const res = await api.get(`/assignments/${a.id}/submissions`);
      setSubmissions(res.data);
    } catch {}
    finally { setLoadingSubs(false); }
  };

  const handleCreate = async () => {
    if (!form.title || !form.classId || !form.dueDate) return;
    setSaving(true);
    try {
      await api.post('/assignments', { ...form, maxMarks: form.maxMarks ? Number(form.maxMarks) : undefined });
      setShowCreate(false); setForm({ title: '', description: '', dueDate: '', maxMarks: '', classId: '', teacherId: 'admin' });
      fetchAssignments();
    } catch {}
    finally { setSaving(false); }
  };

  const handleGrade = async (submissionId: string) => {
    const g = grading[submissionId];
    if (!g?.marks) return;
    try {
      await api.patch(`/submissions/${submissionId}/grade`, { marks: Number(g.marks), feedback: g.feedback });
      openSubmissions(selectedAssignment!);
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this assignment?')) return;
    try { await api.delete(`/assignments/${id}`); fetchAssignments(); } catch {}
  };

  const isOverdue = (d: string) => new Date(d) < new Date();

  return (
    <div style={{ maxWidth: 1200 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.6, color: 'rgba(255,255,255,0.95)', marginBottom: 6 }}>Assignments</h1>
          <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.4)' }}>{assignments.length} assignment{assignments.length !== 1 ? 's' : ''} total</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={fetchAssignments} className="btn-ghost" style={{ padding: '10px 14px' }} disabled={loading}><RefreshCw size={15} /></button>
          <button onClick={() => setShowCreate(true)} className="btn-primary" style={{ width: 'auto', padding: '11px 20px', fontSize: 14 }}><Plus size={16} /> Create Assignment</button>
        </div>
      </div>

      {error && <div style={{ marginBottom: 18, padding: '12px 16px', background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.2)', borderRadius: 12, color: '#ff8a80', fontSize: 13.5, display: 'flex', gap: 8 }}><AlertCircle size={15} />{error}</div>}

      <div style={{ display: 'flex', gap: 14, marginBottom: 22 }}>
        <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} style={{ flex: 1, maxWidth: 280, padding: '12px 16px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter, sans-serif', fontSize: 14, outline: 'none' }}>
          <option value="" style={{ background: '#1a1a2e' }}>All classes</option>
          {classes.map(c => <option key={c.id} value={c.id} style={{ background: '#1a1a2e' }}>{c.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div className="spinner" style={{ width: 32, height: 32 }} /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selectedAssignment ? '1fr 1fr' : '1fr', gap: 18 }}>
          {/* Assignment List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {assignments.length === 0 ? (
              <div className="empty-state"><FileText size={36} style={{ opacity: 0.25 }} /><p>No assignments yet.</p></div>
            ) : assignments.map(a => {
              const overdue = isOverdue(a.dueDate);
              const isSelected = selectedAssignment?.id === a.id;
              return (
                <div key={a.id} className="glass-card" onClick={() => openSubmissions(a)} style={{ padding: '18px 22px', cursor: 'pointer', border: isSelected ? '1px solid rgba(124,109,255,0.4)' : '1px solid rgba(255,255,255,0.07)', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 5 }}>{a.title}</div>
                      {a.description && <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.4)', marginBottom: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.description}</div>}
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>📚 {a.class?.name || 'Unknown class'}</span>
                        <span style={{ fontSize: 12, color: overdue ? '#ff8a80' : 'rgba(255,255,255,0.4)' }}>
                          {overdue ? '⚠️' : '📅'} Due {new Date(a.dueDate).toLocaleDateString('en-IN')}
                        </span>
                        {a.maxMarks && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>🏆 {a.maxMarks} marks</span>}
                        <span style={{ fontSize: 12, color: '#a78bfa' }}>📥 {a._count?.submissions || 0} submissions</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <button className="btn-ghost danger" style={{ padding: '5px 8px' }} onClick={e => { e.stopPropagation(); handleDelete(a.id); }}><Trash2 size={13} /></button>
                      <ChevronRight size={16} style={{ color: 'rgba(255,255,255,0.3)' }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submissions Panel */}
          {selectedAssignment && (
            <div className="content-card" style={{ overflow: 'hidden' }}>
              <div className="card-header">
                <span className="card-title">Submissions — {selectedAssignment.title}</span>
                <button className="btn-ghost" style={{ padding: '5px 10px', fontSize: 12 }} onClick={() => setSelectedAssignment(null)}>✕ Close</button>
              </div>
              {loadingSubs ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>
              ) : submissions.length === 0 ? (
                <div className="empty-state" style={{ padding: '40px 0' }}><Send size={30} style={{ opacity: 0.2 }} /><p>No submissions yet</p></div>
              ) : (
                <div style={{ padding: '0 4px' }}>
                  {submissions.map(s => (
                    <div key={s.id} style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <div>
                          <div style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 3 }}>Student: {s.studentId.slice(0, 12)}…</div>
                          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.35)' }}>Submitted {new Date(s.submittedAt).toLocaleString('en-IN')} {s.isLate && <span style={{ color: '#fdba74', marginLeft: 6 }}>● LATE</span>}</div>
                        </div>
                        {s.marks !== null && s.marks !== undefined ? (
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#6ee7b7', padding: '3px 10px', background: 'rgba(52,211,153,0.12)', borderRadius: 20 }}>{s.marks}/{selectedAssignment.maxMarks || '?'}</span>
                        ) : <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>Ungraded</span>}
                      </div>
                      {s.text && <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 10, padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 8 }}>{s.text.slice(0, 120)}{s.text.length > 120 ? '...' : ''}</div>}
                      {!s.gradedAt && (
                        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                          <input type="number" placeholder="Marks" min="0" max={selectedAssignment.maxMarks || 100} value={grading[s.id]?.marks || ''} onChange={e => setGrading(p => ({ ...p, [s.id]: { ...p[s.id], marks: e.target.value } }))} style={{ width: 80, padding: '7px 10px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: 'white', fontFamily: 'Inter, sans-serif', fontSize: 13, outline: 'none' }} />
                          <input type="text" placeholder="Feedback (optional)" value={grading[s.id]?.feedback || ''} onChange={e => setGrading(p => ({ ...p, [s.id]: { ...p[s.id], feedback: e.target.value } }))} style={{ flex: 1, padding: '7px 10px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: 'white', fontFamily: 'Inter, sans-serif', fontSize: 13, outline: 'none' }} />
                          <button className="btn-primary" style={{ padding: '7px 14px', fontSize: 12 }} onClick={() => handleGrade(s.id)}><Award size={13} /> Grade</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setShowCreate(false)}>
          <div style={{ background: 'rgba(18,18,32,0.95)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: 32, width: '100%', maxWidth: 500, backdropFilter: 'blur(40px)' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 6 }}>Create Assignment</h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>Create a new assignment for a class</p>
            <div className="input-group"><label>Title *</label><div className="input-wrap"><input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Assignment title" style={{ paddingLeft: 16 }} /></div></div>
            <div className="input-group"><label>Description</label><div className="input-wrap"><input type="text" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description" style={{ paddingLeft: 16 }} /></div></div>
            <div className="input-group">
              <label>Class *</label>
              <select value={form.classId} onChange={e => setForm(p => ({ ...p, classId: e.target.value }))} style={{ width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter, sans-serif', fontSize: 14, outline: 'none' }}>
                <option value="" style={{ background: '#1a1a2e' }}>Select class...</option>
                {classes.map(c => <option key={c.id} value={c.id} style={{ background: '#1a1a2e' }}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="input-group"><label>Due Date *</label><div className="input-wrap"><input type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} style={{ paddingLeft: 16 }} /></div></div>
              <div className="input-group"><label>Max Marks</label><div className="input-wrap"><input type="number" value={form.maxMarks} onChange={e => setForm(p => ({ ...p, maxMarks: e.target.value }))} placeholder="100" style={{ paddingLeft: 16 }} /></div></div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 2 }} onClick={handleCreate} disabled={saving}>{saving ? <div className="spinner" /> : 'Create Assignment'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
