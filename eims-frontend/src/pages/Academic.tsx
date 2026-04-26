import { useState, useEffect, useCallback } from 'react';
import { BookOpen, Users, Plus, Search, Edit3, Trash2, GraduationCap, AlertCircle, RefreshCw, Calendar, FileText, Download } from 'lucide-react';
import { classesApi, subjectsApi, branchesApi, type ClassRecord, type Subject, type Branch } from '../lib/api';
import api from '../lib/api';

interface TimetableEntry { id: string; day: string; period: number; room: string; startTime: string; }
interface StudyMaterial { id: string; title: string; type: string; url: string; uploadedBy: string; createdAt: string; }

export default function Academic() {
  const [tab, setTab] = useState<'classes' | 'subjects' | 'timetable' | 'materials'>('classes');
  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  
  const [selectedClass, setSelectedClass] = useState('');
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingSub, setLoadingSub] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [cls, subs, brs] = await Promise.all([classesApi.getAll(), subjectsApi.getAll(), branchesApi.getAll()]);
      setClasses(cls); setSubjects(subs); setBranches(brs);
    } catch (e: any) { setError(e.response?.data?.message || 'Failed to load academic data'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  useEffect(() => {
    if (!selectedClass || (tab !== 'timetable' && tab !== 'materials')) return;
    setLoadingSub(true);
    if (tab === 'timetable') {
      api.get(`/classes/${selectedClass}/timetable`).then(r => setTimetable(r.data)).catch(() => {}).finally(() => setLoadingSub(false));
    } else {
      api.get(`/classes/${selectedClass}/materials`).then(r => setMaterials(r.data)).catch(() => {}).finally(() => setLoadingSub(false));
    }
  }, [selectedClass, tab]);

  const handleCreate = async () => {
    setSaving(true); setFormError('');
    try {
      if (tab === 'classes') await classesApi.create({ name: form.name, branchId: form.branchId, gradeLevel: form.gradeLevel || undefined });
      else if (tab === 'subjects') await subjectsApi.create({ name: form.name, branchId: form.branchId, code: form.code || undefined });
      else if (tab === 'timetable') await api.post(`/classes/${selectedClass}/timetable`, { day: form.day, period: Number(form.period), room: form.room, startTime: form.startTime });
      else if (tab === 'materials') await api.post(`/classes/${selectedClass}/materials`, { title: form.title, type: form.type, url: form.url, uploadedBy: 'Admin' });
      
      setShowModal(false);
      setForm({});
      
      if (tab === 'classes' || tab === 'subjects') fetchAll();
      else if (tab === 'timetable') api.get(`/classes/${selectedClass}/timetable`).then(r => setTimetable(r.data));
      else api.get(`/classes/${selectedClass}/materials`).then(r => setMaterials(r.data));
    } catch (e: any) { setFormError(e.response?.data?.message || 'Failed to create'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string, type: string) => {
    if (!confirm(`Delete this ${type}?`)) return;
    setDeleting(id);
    try {
      if (type === 'class') await classesApi.remove(id);
      else if (type === 'subject') await subjectsApi.remove(id);
      else if (type === 'timetable') await api.delete(`/classes/timetable/${id}`);
      else if (type === 'material') await api.delete(`/classes/materials/${id}`);

      if (type === 'class' || type === 'subject') fetchAll();
      else if (type === 'timetable') api.get(`/classes/${selectedClass}/timetable`).then(r => setTimetable(r.data));
      else api.get(`/classes/${selectedClass}/materials`).then(r => setMaterials(r.data));
    } catch (e: any) { alert(e.response?.data?.message || 'Failed to delete'); }
    finally { setDeleting(null); }
  };

  const filteredClasses = classes.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || (c.gradeLevel || '').toLowerCase().includes(search.toLowerCase()));
  const filteredSubjects = subjects.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || (s.code || '').toLowerCase().includes(search.toLowerCase()));
  const subjectColors = ['#a78bfa', '#7dd3fc', '#6ee7b7', '#fdba74', '#f9a8d4', '#fb923c', '#34d399'];

  return (
    <div style={{ maxWidth: 1280 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.6, color: 'rgba(255,255,255,0.95)', marginBottom: 6 }}>Academic</h1>
          <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.4)' }}>Manage classes, subjects, timetables, and materials</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={fetchAll} className="btn-ghost" style={{ padding: '10px 14px' }} disabled={loading}><RefreshCw size={15} /></button>
          <button onClick={() => { setForm({}); setShowModal(true); }} className="btn-primary" style={{ width: 'auto', padding: '11px 20px', fontSize: 14 }} disabled={loading || ((tab === 'timetable' || tab === 'materials') && !selectedClass)}>
            <Plus size={16} /> Add {tab === 'classes' ? 'Class' : tab === 'subjects' ? 'Subject' : tab === 'timetable' ? 'Entry' : 'Material'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: 20, padding: '12px 16px', background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.2)', borderRadius: 12, color: '#ff8a80', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5 }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 18, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 5, width: 'fit-content' }}>
        {([['classes', 'Classes'], ['subjects', 'Subjects'], ['timetable', 'Timetable'], ['materials', 'Study Materials']] as const).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t as any)} style={{ padding: '8px 20px', borderRadius: 10, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s ease', border: 'none', background: tab === t ? 'rgba(124,109,255,0.25)' : 'transparent', color: tab === t ? '#a78bfa' : 'rgba(255,255,255,0.4)' }}>
            {label}
          </button>
        ))}
      </div>

      {(tab === 'timetable' || tab === 'materials') && (
        <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter, sans-serif', fontSize: 14, outline: 'none', minWidth: 280, marginBottom: 18 }}>
          <option value="" style={{ background: '#1a1a2e' }}>Select a class...</option>
          {classes.map(c => <option key={c.id} value={c.id} style={{ background: '#1a1a2e' }}>{c.name}</option>)}
        </select>
      )}

      {/* Search (only for classes/subjects) */}
      {(tab === 'classes' || tab === 'subjects') && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, padding: '12px 18px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14 }}>
          <Search size={15} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${tab}...`} style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 14, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter, sans-serif' }} />
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 14 }}>
          <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
        </div>
      ) : tab === 'classes' ? (
        filteredClasses.length === 0 ? (
          <div className="empty-state"><BookOpen size={36} style={{ opacity: 0.25 }} /><p>No classes found.</p></div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {filteredClasses.map(cls => (
              <div key={cls.id} className="glass-card" style={{ padding: '20px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(124,109,255,0.18)', border: '1px solid rgba(124,109,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#a78bfa' }}>
                      {cls.gradeLevel || cls.name.slice(0, 2)}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{cls.name}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>{cls.branch?.name || 'No branch'}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="btn-ghost danger" style={{ padding: '5px 8px' }} disabled={deleting === cls.id} onClick={() => handleDelete(cls.id, 'class')}>
                      {deleting === cls.id ? <div className="spinner" style={{ width: 12, height: 12 }} /> : <Trash2 size={12} />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : tab === 'subjects' ? (
        filteredSubjects.length === 0 ? (
          <div className="empty-state"><GraduationCap size={36} style={{ opacity: 0.25 }} /><p>No subjects found.</p></div>
        ) : (
          <div className="content-card" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>{['Subject', 'Code', 'Branch', 'Created', 'Actions'].map(col => <th key={col} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: 0.8, textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{col}</th>)}</tr></thead>
              <tbody>
                {filteredSubjects.map((s, i) => (
                  <tr key={s.id} style={{ borderBottom: i < filteredSubjects.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 8, height: 32, borderRadius: 4, background: subjectColors[i % subjectColors.length], flexShrink: 0 }} />
                        <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{s.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>{s.code ? <span style={{ padding: '3px 10px', background: 'rgba(255,255,255,0.06)', borderRadius: 6, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>{s.code}</span> : <span style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>}</td>
                    <td style={{ padding: '14px 20px', fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{s.branch?.name || '—'}</td>
                    <td style={{ padding: '14px 20px', fontSize: 12.5, color: 'rgba(255,255,255,0.35)' }}>{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <button className="btn-ghost danger" style={{ padding: '5px 10px', fontSize: 12 }} disabled={deleting === s.id} onClick={() => handleDelete(s.id, 'subject')}>{deleting === s.id ? <div className="spinner" style={{ width: 12, height: 12 }} /> : <Trash2 size={13} />}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : tab === 'timetable' ? (
        !selectedClass ? <div className="empty-state"><Calendar size={36} style={{ opacity: 0.25 }} /><p>Select a class to view timetable.</p></div> :
        loadingSub ? <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div> :
        timetable.length === 0 ? <div className="empty-state"><Calendar size={36} style={{ opacity: 0.25 }} /><p>No timetable entries for this class.</p></div> :
        <div className="content-card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>{['Day', 'Period', 'Time', 'Room', 'Actions'].map(c => <th key={c} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: 0.8, textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{c}</th>)}</tr></thead>
            <tbody>
              {timetable.map((t, i) => (
                <tr key={t.id} style={{ borderBottom: i < timetable.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{t.day}</td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Period {t.period}</td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: '#6ee7b7' }}>{t.startTime || '—'}</td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{t.room || '—'}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <button className="btn-ghost danger" style={{ padding: '5px 10px', fontSize: 12 }} onClick={() => handleDelete(t.id, 'timetable')}><Trash2 size={13} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : tab === 'materials' ? (
        !selectedClass ? <div className="empty-state"><FileText size={36} style={{ opacity: 0.25 }} /><p>Select a class to view materials.</p></div> :
        loadingSub ? <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div> :
        materials.length === 0 ? <div className="empty-state"><FileText size={36} style={{ opacity: 0.25 }} /><p>No materials uploaded.</p></div> :
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {materials.map(m => (
            <div key={m.id} className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(124,109,255,0.15)', color: '#a78bfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={20} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{m.type} • By {m.uploadedBy}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <a href={m.url} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ padding: 6 }}><Download size={14} color="#6ee7b7" /></a>
                <button className="btn-ghost danger" style={{ padding: 6 }} onClick={() => handleDelete(m.id, 'material')}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setShowModal(false)}>
          <div style={{ background: 'rgba(18,18,32,0.95)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: 32, width: '100%', maxWidth: 460, backdropFilter: 'blur(40px)' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 6 }}>Add {tab === 'classes' ? 'Class' : tab === 'subjects' ? 'Subject' : tab === 'timetable' ? 'Timetable Entry' : 'Study Material'}</h2>
            {formError && <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.2)', borderRadius: 10, color: '#ff8a80', fontSize: 13 }}>{formError}</div>}
            
            {tab === 'classes' || tab === 'subjects' ? (
              <>
                <div className="input-group"><label>Name *</label><div className="input-wrap"><input type="text" value={form.name || ''} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={{ paddingLeft: 16 }} /></div></div>
                <div className="input-group"><label>Branch *</label><select value={form.branchId || ''} onChange={e => setForm(p => ({ ...p, branchId: e.target.value }))} style={{ width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter, sans-serif', fontSize: 14, outline: 'none' }}><option value="" style={{ background: '#1a1a2e' }}>Select branch...</option>{branches.map(b => <option key={b.id} value={b.id} style={{ background: '#1a1a2e' }}>{b.name}</option>)}</select></div>
                {tab === 'classes' && <div className="input-group"><label>Grade Level</label><div className="input-wrap"><input type="text" value={form.gradeLevel || ''} onChange={e => setForm(p => ({ ...p, gradeLevel: e.target.value }))} style={{ paddingLeft: 16 }} /></div></div>}
                {tab === 'subjects' && <div className="input-group"><label>Code</label><div className="input-wrap"><input type="text" value={form.code || ''} onChange={e => setForm(p => ({ ...p, code: e.target.value }))} style={{ paddingLeft: 16 }} /></div></div>}
              </>
            ) : tab === 'timetable' ? (
              <>
                <div className="input-group"><label>Day *</label><select value={form.day || ''} onChange={e => setForm(p => ({ ...p, day: e.target.value }))} style={{ width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter, sans-serif', fontSize: 14, outline: 'none' }}><option value="" style={{ background: '#1a1a2e' }}>Select day...</option>{['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => <option key={d} value={d} style={{ background: '#1a1a2e' }}>{d}</option>)}</select></div>
                <div className="input-group"><label>Period *</label><div className="input-wrap"><input type="number" min="1" value={form.period || ''} onChange={e => setForm(p => ({ ...p, period: e.target.value }))} style={{ paddingLeft: 16 }} /></div></div>
                <div className="input-group"><label>Start Time</label><div className="input-wrap"><input type="time" value={form.startTime || ''} onChange={e => setForm(p => ({ ...p, startTime: e.target.value }))} style={{ paddingLeft: 16 }} /></div></div>
                <div className="input-group"><label>Room</label><div className="input-wrap"><input type="text" value={form.room || ''} onChange={e => setForm(p => ({ ...p, room: e.target.value }))} style={{ paddingLeft: 16 }} /></div></div>
              </>
            ) : tab === 'materials' ? (
              <>
                <div className="input-group"><label>Title *</label><div className="input-wrap"><input type="text" value={form.title || ''} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} style={{ paddingLeft: 16 }} /></div></div>
                <div className="input-group"><label>Type *</label><select value={form.type || ''} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} style={{ width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter, sans-serif', fontSize: 14, outline: 'none' }}><option value="" style={{ background: '#1a1a2e' }}>Select type...</option>{['PDF', 'Video', 'Link', 'Document'].map(t => <option key={t} value={t} style={{ background: '#1a1a2e' }}>{t}</option>)}</select></div>
                <div className="input-group"><label>URL *</label><div className="input-wrap"><input type="url" placeholder="https://" value={form.url || ''} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} style={{ paddingLeft: 16 }} /></div></div>
              </>
            ) : null}

            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 2 }} onClick={handleCreate} disabled={saving}>{saving ? <div className="spinner" /> : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
