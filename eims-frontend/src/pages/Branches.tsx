import { useState, useEffect, useCallback } from 'react';
import { GitBranch, Plus, Search, MapPin, Trash2, Edit3, Eye, AlertCircle, RefreshCw, Building } from 'lucide-react';
import { branchesApi, schoolsApi, type Branch, type School } from '../lib/api';

export default function Branches() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', schoolId: '', city: '' });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [branchData, schoolData] = await Promise.all([branchesApi.getAll(), schoolsApi.getAll()]);
      setBranches(branchData);
      setSchools(schoolData);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to load branches');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleCreate = async () => {
    if (!form.name || !form.schoolId) { setFormError('Name and School are required.'); return; }
    setSaving(true); setFormError('');
    try {
      await branchesApi.create({ name: form.name, schoolId: form.schoolId, city: form.city || undefined });
      setShowModal(false);
      setForm({ name: '', schoolId: '', city: '' });
      fetchAll();
    } catch (e: any) { setFormError(e.response?.data?.message || 'Failed to create branch'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this branch?')) return;
    setDeleting(id);
    try { await branchesApi.remove(id); fetchAll(); }
    catch (e: any) { alert(e.response?.data?.message || 'Failed to delete branch'); }
    finally { setDeleting(null); }
  };

  const filtered = branches.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    (b.school?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (b.city || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 1280 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.6, color: 'rgba(255,255,255,0.95)', marginBottom: 6 }}>Branches</h1>
          <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.4)' }}>{branches.length} branch{branches.length !== 1 ? 'es' : ''} across all schools</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={fetchAll} className="btn-ghost" style={{ padding: '10px 14px' }} disabled={loading}><RefreshCw size={15} /></button>
          <button onClick={() => setShowModal(true)} className="btn-primary" style={{ width: 'auto', padding: '11px 20px', fontSize: 14 }}>
            <Plus size={16} /> Add Branch
          </button>
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: 20, padding: '12px 16px', background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.2)', borderRadius: 12, color: '#ff8a80', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5 }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22, padding: '14px 18px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16 }}>
        <Search size={15} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search branches, schools or cities..." style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 14, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter, sans-serif' }} />
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>{filtered.length} results</span>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 14 }}>
          <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13.5 }}>Loading branches...</span>
        </div>
      ) : (
        <div className="content-card" style={{ overflow: 'hidden' }}>
          {filtered.length === 0 ? (
            <div className="empty-state">
              <GitBranch size={36} style={{ opacity: 0.25 }} />
              <p>{search ? 'No branches match your search.' : 'No branches yet.'}</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Branch', 'School', 'City', 'Created', 'Actions'].map(col => (
                      <th key={col} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: 0.8, textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)', whiteSpace: 'nowrap' }}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b, i) => (
                    <tr key={b.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', transition: 'background 0.15s ease' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Building size={15} style={{ color: '#7dd3fc' }} />
                          </div>
                          <span style={{ fontSize: 13.5, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{b.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{b.school?.name || '—'}</td>
                      <td style={{ padding: '14px 20px' }}>
                        {b.city ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                            <MapPin size={12} />{b.city}
                          </div>
                        ) : <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>—</span>}
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: 12.5, color: 'rgba(255,255,255,0.35)' }}>
                        {new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className="btn-ghost" style={{ padding: '5px 10px', fontSize: 12 }}><Eye size={13} /></button>
                          <button className="btn-ghost" style={{ padding: '5px 10px', fontSize: 12 }}><Edit3 size={13} /></button>
                          <button className="btn-ghost danger" style={{ padding: '5px 10px', fontSize: 12 }} disabled={deleting === b.id} onClick={() => handleDelete(b.id)}>
                            {deleting === b.id ? <div className="spinner" style={{ width: 12, height: 12 }} /> : <Trash2 size={13} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setShowModal(false)}>
          <div style={{ background: 'rgba(18,18,32,0.95)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: 32, width: '100%', maxWidth: 480, backdropFilter: 'blur(40px)' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 6 }}>Add New Branch</h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>Create a new branch for an existing school</p>
            {formError && <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.2)', borderRadius: 10, color: '#ff8a80', fontSize: 13 }}>{formError}</div>}
            <div className="input-group">
              <label>Branch Name *</label>
              <div className="input-wrap"><input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. North Campus" style={{ paddingLeft: 16 }} /></div>
            </div>
            <div className="input-group">
              <label>School *</label>
              <select value={form.schoolId} onChange={e => setForm(p => ({ ...p, schoolId: e.target.value }))} style={{ width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter, sans-serif', fontSize: 14, outline: 'none' }}>
                <option value="" style={{ background: '#1a1a2e' }}>Select school...</option>
                {schools.map(s => <option key={s.id} value={s.id} style={{ background: '#1a1a2e' }}>{s.name}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label>City</label>
              <div className="input-wrap"><input type="text" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} placeholder="City name" style={{ paddingLeft: 16 }} /></div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 2 }} onClick={handleCreate} disabled={saving}>
                {saving ? <div className="spinner" /> : 'Create Branch'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
