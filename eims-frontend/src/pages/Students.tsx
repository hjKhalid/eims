import { useState, useEffect, useCallback } from 'react';
import { GraduationCap, Search, Plus, Mail, Phone, Edit3, Trash2, RefreshCw, AlertCircle, Filter } from 'lucide-react';
import api from '../lib/api';
import { usersApi, type UserRecord } from '../lib/api';

export default function Students() {
  const [students, setStudents] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: 'Student@123', phone: '' });

  const fetchStudents = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const all = await usersApi.getAll();
      const studentUsers = all.filter(u => u.roles?.some(r => r.role.name === 'STUDENT') || u.roles?.length === 0);
      setStudents(all); // Show all users on student page
    } catch { setError('Failed to load students'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const handleCreate = async () => {
    if (!form.name || !form.email) return;
    setSaving(true);
    try {
      await usersApi.create({ name: form.name, email: form.email, password: form.password, phone: form.phone || undefined });
      setShowModal(false);
      setForm({ name: '', email: '', password: 'Student@123', phone: '' });
      fetchStudents();
    } catch {}
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this student?')) return;
    try { await usersApi.remove(id); fetchStudents(); } catch {}
  };

  const avatarColors = ['#7c6dff', '#5b8ef5', '#6ee7b7', '#fdba74', '#f9a8d4', '#7dd3fc'];
  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 1280 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.6, color: 'rgba(255,255,255,0.95)', marginBottom: 6 }}>Students & Users</h1>
          <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.4)' }}>{loading ? '…' : `${students.length} users in the system`}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={fetchStudents} className="btn-ghost" style={{ padding: '10px 14px' }} disabled={loading}><RefreshCw size={15} /></button>
          <button onClick={() => setShowModal(true)} className="btn-primary" style={{ width: 'auto', padding: '11px 20px', fontSize: 14 }}>
            <Plus size={16} /> Add Student
          </button>
        </div>
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
        {[
          { label: 'Total Users', val: students.length, color: '#a78bfa' },
          { label: 'Students', val: students.filter(s => s.roles?.some(r => r.role.name === 'STUDENT')).length, color: '#6ee7b7' },
          { label: 'Teachers', val: students.filter(s => s.roles?.some(r => r.role.name === 'TEACHER')).length, color: '#7dd3fc' },
          { label: 'Admins', val: students.filter(s => s.roles?.some(r => ['SUPER_ADMIN','PRINCIPAL','MANAGER'].includes(r.role.name))).length, color: '#fdba74' },
        ].map(st => (
          <div key={st.label} className="stat-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 6, height: 36, borderRadius: 3, background: st.color }} />
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'white', letterSpacing: -0.8 }}>{loading ? '…' : st.val}</div>
              <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.35)' }}>{st.label}</div>
            </div>
          </div>
        ))}
      </div>

      {error && <div style={{ marginBottom: 18, padding: '12px 16px', background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.2)', borderRadius: 12, color: '#ff8a80', fontSize: 13.5, display: 'flex', gap: 8 }}><AlertCircle size={15} />{error}</div>}

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, padding: '12px 18px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14 }}>
        <Search size={15} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 14, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter, sans-serif' }} />
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>{filtered.length} of {students.length}</span>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div className="spinner" style={{ width: 32, height: 32 }} /></div>
      ) : (
        <div className="content-card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['User', 'Email', 'Phone', 'Role', 'Joined', 'Actions'].map(col => (
                    <th key={col} style={{ padding: '14px 18px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: 0.8, textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)', whiteSpace: 'nowrap' }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6}><div className="empty-state"><GraduationCap size={36} style={{ opacity: 0.2 }} /><p>No users found.</p></div></td></tr>
                ) : filtered.map((s, i) => {
                  const bg = avatarColors[i % avatarColors.length];
                  const roleName = s.roles?.[0]?.role?.name || 'No Role';
                  const roleColor = roleName === 'SUPER_ADMIN' ? '#f9a8d4' : roleName === 'TEACHER' ? '#7dd3fc' : roleName === 'STUDENT' ? '#6ee7b7' : '#a78bfa';
                  return (
                    <tr key={s.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <td style={{ padding: '13px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'white', flexShrink: 0 }}>{s.name[0]}</div>
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap' }}>{s.name}</div>
                        </div>
                      </td>
                      <td style={{ padding: '13px 18px' }}>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: 5 }}><Mail size={10} />{s.email}</div>
                      </td>
                      <td style={{ padding: '13px 18px', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                        {s.phone ? <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Phone size={10} />{s.phone}</div> : <span style={{ opacity: 0.3 }}>—</span>}
                      </td>
                      <td style={{ padding: '13px 18px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: `${roleColor}22`, color: roleColor }}>{roleName.replace('_', ' ')}</span>
                      </td>
                      <td style={{ padding: '13px 18px', fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                        {new Date(s.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td style={{ padding: '13px 18px' }}>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className="btn-ghost danger" style={{ padding: '5px 10px', fontSize: 12 }} onClick={() => handleDelete(s.id)}><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setShowModal(false)}>
          <div style={{ background: 'rgba(18,18,32,0.95)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: 32, width: '100%', maxWidth: 480, backdropFilter: 'blur(40px)' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 6 }}>Add New User</h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>Create a new user account in the system</p>
            {[
              { key: 'name', label: 'Full Name', placeholder: 'Full name', type: 'text' },
              { key: 'email', label: 'Email', placeholder: 'email@school.edu', type: 'email' },
              { key: 'phone', label: 'Phone (optional)', placeholder: '+91 XXXXX XXXXX', type: 'text' },
              { key: 'password', label: 'Password', placeholder: 'Initial password', type: 'text' },
            ].map(f => (
              <div key={f.key} className="input-group">
                <label>{f.label}</label>
                <div className="input-wrap"><input type={f.type} placeholder={f.placeholder} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={{ paddingLeft: 16 }} /></div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 2 }} onClick={handleCreate} disabled={saving}>{saving ? <div className="spinner" /> : 'Create User'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
