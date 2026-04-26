import { useState, useEffect, useCallback } from 'react';
import { School, Plus, Search, MapPin, GitBranch, Users, Trash2, Edit3, Eye, RefreshCw, AlertCircle } from 'lucide-react';
import { schoolsApi, organizationsApi, type School as SchoolType, type Organization } from '../lib/api';

const planStyle: Record<string, { bg: string; color: string; border: string }> = {
  Premium: { bg: 'rgba(124,109,255,0.15)', color: '#a78bfa', border: 'rgba(124,109,255,0.25)' },
  Standard: { bg: 'rgba(56,189,248,0.12)', color: '#7dd3fc', border: 'rgba(56,189,248,0.2)' },
  basic: { bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)', border: 'rgba(255,255,255,0.10)' },
};

export default function Schools() {
  const [schools, setSchools] = useState<SchoolType[]>([]);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({ name: '', organizationId: '', address: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [schoolData, orgData] = await Promise.all([
        schoolsApi.getAll(),
        organizationsApi.getAll(),
      ]);
      setSchools(schoolData);
      setOrgs(orgData);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to load schools');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleCreate = async () => {
    if (!form.name || !form.organizationId) { setFormError('Name and Organization are required.'); return; }
    setSaving(true); setFormError('');
    try {
      await schoolsApi.create(form);
      setShowModal(false);
      setForm({ name: '', organizationId: '', address: '', phone: '' });
      fetchAll();
    } catch (e: any) {
      setFormError(e.response?.data?.message || 'Failed to create school');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this school? This cannot be undone.')) return;
    setDeleting(id);
    try { await schoolsApi.remove(id); fetchAll(); }
    catch (e: any) { alert(e.response?.data?.message || 'Failed to delete school'); }
    finally { setDeleting(null); }
  };

  const filtered = schools.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.address || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 1280 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.6, color: 'rgba(255,255,255,0.95)', marginBottom: 6 }}>Schools</h1>
          <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.4)' }}>{schools.length} institution{schools.length !== 1 ? 's' : ''} registered</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={fetchAll} className="btn-ghost" style={{ padding: '10px 14px' }} disabled={loading}><RefreshCw size={15} className={loading ? 'spin' : ''} /></button>
          <button onClick={() => setShowModal(true)} className="btn-primary" style={{ width: 'auto', padding: '11px 20px', fontSize: 14 }}>
            <Plus size={16} /> Add School
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
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search schools by name or address..." style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 14, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter, sans-serif' }} />
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>{filtered.length} results</span>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 14 }}>
          <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13.5 }}>Loading schools...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <School size={40} style={{ opacity: 0.25 }} />
          <p>{search ? 'No schools match your search.' : 'No schools yet. Add one to get started.'}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 18 }}>
          {filtered.map(school => {
            const plan = planStyle[school.organization?.plan || 'basic'] || planStyle.basic;
            return (
              <div key={school.id} className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '20px 22px 16px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 13, flexShrink: 0, background: 'linear-gradient(135deg, rgba(124,109,255,0.3), rgba(91,142,245,0.25))', border: '1px solid rgba(124,109,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <School size={20} style={{ color: '#a78bfa' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.9)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 4 }}>{school.name}</div>
                      {school.address && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                          <MapPin size={11} /><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{school.address}</span>
                        </div>
                      )}
                    </div>
                    <span style={{ padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: plan.bg, color: plan.color, border: `1px solid ${plan.border}`, whiteSpace: 'nowrap' }}>{school.organization?.plan || 'Basic'}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', padding: '14px 22px', gap: 16 }}>
                  {[{ label: 'Branches', value: school.branches?.length ?? 0 }, { label: 'Created', value: new Date(school.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) }].map(stat => (
                    <div key={stat.label} style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: 'rgba(255,255,255,0.85)', letterSpacing: -0.5 }}>{stat.value}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8, padding: '12px 22px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center', fontSize: 12 }}><Eye size={13} /> View</button>
                  <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center', fontSize: 12 }}><Edit3 size={13} /> Edit</button>
                  <button className="btn-ghost danger" style={{ flex: 1, justifyContent: 'center', fontSize: 12 }} disabled={deleting === school.id} onClick={() => handleDelete(school.id)}>
                    {deleting === school.id ? <div className="spinner" style={{ width: 13, height: 13 }} /> : <Trash2 size={13} />} Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setShowModal(false)}>
          <div style={{ background: 'rgba(18,18,32,0.95)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: 32, width: '100%', maxWidth: 480, backdropFilter: 'blur(40px)' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 6 }}>Add New School</h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>Register a new school to your network</p>

            {formError && (
              <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.2)', borderRadius: 10, color: '#ff8a80', fontSize: 13 }}>{formError}</div>
            )}

            <div className="input-group">
              <label>School Name *</label>
              <div className="input-wrap"><input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. The Syntra Academy" style={{ paddingLeft: 16 }} /></div>
            </div>

            <div className="input-group">
              <label>Organization *</label>
              {orgs.length === 0 ? (
                <div style={{ fontSize: 13, color: '#fdba74', padding: '10px 14px', background: 'rgba(251,146,60,0.1)', borderRadius: 10, border: '1px solid rgba(251,146,60,0.2)' }}>
                  No organizations found. Create one first.
                </div>
              ) : (
                <select value={form.organizationId} onChange={e => setForm(p => ({ ...p, organizationId: e.target.value }))} style={{ width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter, sans-serif', fontSize: 14, outline: 'none' }}>
                  <option value="" style={{ background: '#1a1a2e' }}>Select organization...</option>
                  {orgs.map(o => <option key={o.id} value={o.id} style={{ background: '#1a1a2e' }}>{o.name}</option>)}
                </select>
              )}
            </div>

            <div className="input-group">
              <label>Address</label>
              <div className="input-wrap"><input type="text" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} placeholder="City, State" style={{ paddingLeft: 16 }} /></div>
            </div>

            <div className="input-group">
              <label>Phone</label>
              <div className="input-wrap"><input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" style={{ paddingLeft: 16 }} /></div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 2 }} onClick={handleCreate} disabled={saving}>
                {saving ? <div className="spinner" /> : 'Create School'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
