import { useState, useEffect, useCallback } from 'react';
import { Users, Plus, Search, Mail, Phone, Shield, Edit3, Trash2, UserCheck, UserX, AlertCircle, RefreshCw } from 'lucide-react';
import { usersApi, type UserRecord } from '../lib/api';

const roleColors: Record<string, { bg: string; color: string; border: string }> = {
  SUPER_ADMIN: { bg: 'rgba(124,109,255,0.2)', color: '#a78bfa', border: 'rgba(124,109,255,0.3)' },
  PRINCIPAL:   { bg: 'rgba(56,189,248,0.15)', color: '#7dd3fc', border: 'rgba(56,189,248,0.22)' },
  MANAGER:     { bg: 'rgba(52,211,153,0.12)', color: '#34d399', border: 'rgba(52,211,153,0.2)' },
  TEACHER:     { bg: 'rgba(52,211,153,0.15)', color: '#6ee7b7', border: 'rgba(52,211,153,0.22)' },
  STUDENT:     { bg: 'rgba(251,146,60,0.15)', color: '#fdba74', border: 'rgba(251,146,60,0.22)' },
  PARENT:      { bg: 'rgba(249,168,212,0.15)', color: '#f9a8d4', border: 'rgba(249,168,212,0.22)' },
};
const roleList = ['All', 'SUPER_ADMIN', 'PRINCIPAL', 'MANAGER', 'TEACHER', 'STUDENT', 'PARENT'];
const avatarColors = ['#7c6dff', '#5b8ef5', '#6ee7b7', '#fdba74', '#f9a8d4', '#7dd3fc', '#a78bfa'];

export default function UsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeRole, setActiveRole] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true); setError('');
    try { setUsers(await usersApi.getAll()); }
    catch (e: any) { setError(e.response?.data?.message || 'Failed to load users'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const getUserRoles = (u: UserRecord): string[] =>
    u.roles?.map(r => r.role.name) ?? [];

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password) { setFormError('Name, email and password are required.'); return; }
    setSaving(true); setFormError('');
    try {
      await usersApi.create(form);
      setShowModal(false);
      setForm({ name: '', email: '', password: '', phone: '' });
      fetchAll();
    } catch (e: any) { setFormError(e.response?.data?.message || 'Failed to create user'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    setDeleting(id);
    try { await usersApi.remove(id); fetchAll(); }
    catch (e: any) { alert(e.response?.data?.message || 'Failed to delete user'); }
    finally { setDeleting(null); }
  };

  const filtered = users.filter(u => {
    const roles = getUserRoles(u);
    const matchRole = activeRole === 'All' || roles.includes(activeRole);
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <div style={{ maxWidth: 1280 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.6, color: 'rgba(255,255,255,0.95)', marginBottom: 6 }}>Users</h1>
          <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.4)' }}>{users.length} user{users.length !== 1 ? 's' : ''} registered</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={fetchAll} className="btn-ghost" style={{ padding: '10px 14px' }} disabled={loading}><RefreshCw size={15} /></button>
          <button onClick={() => setShowModal(true)} className="btn-primary" style={{ width: 'auto', padding: '11px 20px', fontSize: 14 }}>
            <Plus size={16} /> Add User
          </button>
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: 20, padding: '12px 16px', background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.2)', borderRadius: 12, color: '#ff8a80', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5 }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
        {roleList.map(role => (
          <button key={role} onClick={() => setActiveRole(role)} style={{
            padding: '7px 16px', borderRadius: 20, fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'Inter, sans-serif', transition: 'all 0.2s ease',
            background: activeRole === role ? 'rgba(124,109,255,0.2)' : 'rgba(255,255,255,0.05)',
            color: activeRole === role ? '#a78bfa' : 'rgba(255,255,255,0.45)',
            border: activeRole === role ? '1px solid rgba(124,109,255,0.3)' : '1px solid rgba(255,255,255,0.08)',
          }}>{role}</button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, padding: '12px 18px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14 }}>
        <Search size={15} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 14, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter, sans-serif' }} />
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>{filtered.length} of {users.length}</span>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 14 }}>
          <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13.5 }}>Loading users...</span>
        </div>
      ) : (
        <div className="content-card" style={{ overflow: 'hidden' }}>
          {filtered.length === 0 ? (
            <div className="empty-state"><Users size={36} style={{ opacity: 0.25 }} /><p>No users found.</p></div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['User', 'Email', 'Phone', 'Roles', 'Joined', 'Actions'].map(col => (
                      <th key={col} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: 0.8, textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)', whiteSpace: 'nowrap' }}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u, i) => {
                    const roles = getUserRoles(u);
                    const rc = roleColors[roles[0]] || roleColors.PARENT;
                    const avatarBg = avatarColors[i % avatarColors.length];
                    return (
                      <tr key={u.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', transition: 'background 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <td style={{ padding: '13px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                              {u.name[0]?.toUpperCase()}
                            </div>
                            <span style={{ fontSize: 13.5, fontWeight: 600, color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap' }}>{u.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '13px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}><Mail size={12} />{u.email}</div>
                        </td>
                        <td style={{ padding: '13px 20px', fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
                          {u.phone ? <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Phone size={12} />{u.phone}</div> : <span style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>}
                        </td>
                        <td style={{ padding: '13px 20px' }}>
                          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            {roles.length === 0 ? (
                              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>No role</span>
                            ) : roles.map(r => {
                              const c = roleColors[r] || roleColors.PARENT;
                              return <span key={r} style={{ padding: '2px 8px', borderRadius: 20, fontSize: 10.5, fontWeight: 600, background: c.bg, color: c.color, border: `1px solid ${c.border}`, whiteSpace: 'nowrap' }}>{r}</span>;
                            })}
                          </div>
                        </td>
                        <td style={{ padding: '13px 20px', fontSize: 12.5, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>
                          {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '13px 20px' }}>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button className="btn-ghost" style={{ padding: '5px 10px', fontSize: 12 }}><Edit3 size={13} /></button>
                            <button className="btn-ghost danger" style={{ padding: '5px 10px', fontSize: 12 }} disabled={deleting === u.id} onClick={() => handleDelete(u.id)}>
                              {deleting === u.id ? <div className="spinner" style={{ width: 12, height: 12 }} /> : <Trash2 size={13} />}
                            </button>
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

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setShowModal(false)}>
          <div style={{ background: 'rgba(18,18,32,0.95)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: 32, width: '100%', maxWidth: 480, backdropFilter: 'blur(40px)' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 6 }}>Add New User</h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>Create a new user account</p>
            {formError && <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.2)', borderRadius: 10, color: '#ff8a80', fontSize: 13 }}>{formError}</div>}
            {[{ key: 'name', label: 'Full Name *', placeholder: 'Full name' }, { key: 'email', label: 'Email *', placeholder: 'email@school.com' }, { key: 'phone', label: 'Phone', placeholder: '+91 XXXXX XXXXX' }, { key: 'password', label: 'Password *', placeholder: 'Temporary password' }].map(f => (
              <div key={f.key} className="input-group">
                <label>{f.label}</label>
                <div className="input-wrap">
                  <input type={f.key === 'password' ? 'password' : 'text'} placeholder={f.placeholder} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={{ paddingLeft: 16 }} />
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 2 }} onClick={handleCreate} disabled={saving}>
                {saving ? <div className="spinner" /> : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
