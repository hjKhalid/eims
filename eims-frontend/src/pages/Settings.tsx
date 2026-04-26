import { useState, useEffect } from 'react';
import { Save, User, Shield, Bell, Globe, Moon, Key, ChevronRight, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';

const sections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Moon },
  { id: 'system', label: 'System', icon: Globe },
];

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div onClick={() => onChange(!value)} style={{
      width: 44, height: 24, borderRadius: 12, cursor: 'pointer', transition: 'background 0.2s ease', position: 'relative', flexShrink: 0,
      background: value ? 'linear-gradient(135deg, #7c6dff, #5b8ef5)' : 'rgba(255,255,255,0.12)',
    }}>
      <div style={{
        position: 'absolute', top: 3, left: value ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: 'white',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)', transition: 'left 0.2s ease',
      }} />
    </div>
  );
}

function SettingRow({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', gap: 16 }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{label}</div>
        {sub && <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>{sub}</div>}
      </div>
      {children}
    </div>
  );
}

export default function Settings() {
  const user = useAuthStore(state => state.user);
  const setAuth = useAuthStore(state => state.setAuth);
  const [activeSection, setActiveSection] = useState('profile');
  const [notifs, setNotifs] = useState({ email: true, push: true, fee: true, student: false, system: true });
  
  // Profile state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(''); // Not in local user initially
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [savingProfile, setSavingProfile] = useState(false);

  // Security state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secMsg, setSecMsg] = useState({ type: '', text: '' });
  const [savingSec, setSavingSec] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      // Fetch me endpoint to get latest phone if available
      api.get('/auth/me').then(res => {
        if (res.data.phone) setPhone(res.data.phone);
      }).catch(() => {});
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setSavingProfile(true); setProfileMsg({ type: '', text: '' });
    try {
      const res = await api.patch('/auth/profile', { name, phone });
      setAuth({ ...user, name: res.data.name } as any, localStorage.getItem('token') || '');
      setProfileMsg({ type: 'success', text: 'Profile updated successfully' });
    } catch (e: any) {
      setProfileMsg({ type: 'error', text: e.response?.data?.message || 'Failed to update profile' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setSecMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    if (newPassword.length < 8) {
      setSecMsg({ type: 'error', text: 'Password must be at least 8 characters' });
      return;
    }
    setSavingSec(true); setSecMsg({ type: '', text: '' });
    try {
      await api.post('/auth/change-password', { currentPassword, newPassword });
      setSecMsg({ type: 'success', text: 'Password updated successfully' });
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (e: any) {
      setSecMsg({ type: 'error', text: e.response?.data?.message || 'Failed to update password' });
    } finally {
      setSavingSec(false);
    }
  };

  return (
    <div style={{ maxWidth: 1000 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.6, color: 'rgba(255,255,255,0.95)', marginBottom: 6 }}>Settings</h1>
        <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.4)' }}>Manage your account, security and preferences</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20, alignItems: 'flex-start' }}>
        <div className="content-card" style={{ padding: '8px' }}>
          {sections.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10, width: '100%',
              padding: '10px 14px', borderRadius: 12, border: 'none', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', fontSize: 13.5, fontWeight: 500, transition: 'all 0.15s ease',
              background: activeSection === s.id ? 'rgba(124,109,255,0.2)' : 'transparent',
              color: activeSection === s.id ? '#a78bfa' : 'rgba(255,255,255,0.5)',
            }}>
              <s.icon size={16} />
              <span style={{ flex: 1, textAlign: 'left' }}>{s.label}</span>
              <ChevronRight size={13} style={{ opacity: 0.4 }} />
            </button>
          ))}
        </div>

        <div className="content-card">
          {activeSection === 'profile' && (
            <div>
              <div className="card-header"><span className="card-title">Profile Information</span></div>
              <div className="card-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 28, padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #7c6dff, #5b8ef5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: 'white', boxShadow: '0 4px 20px rgba(124,109,255,0.4)' }}>{name[0]?.toUpperCase()}</div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{name}</div>
                    <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>{user?.roles?.[0] || 'User'}</div>
                    <button className="btn-ghost" style={{ marginTop: 8, padding: '5px 12px', fontSize: 12 }}>Change Avatar</button>
                  </div>
                </div>

                {profileMsg.text && (
                  <div style={{ padding: '10px', marginBottom: 16, borderRadius: 8, fontSize: 13, display: 'flex', gap: 8, alignItems: 'center', background: profileMsg.type === 'error' ? 'rgba(255,59,48,0.1)' : 'rgba(52,211,153,0.1)', color: profileMsg.type === 'error' ? '#ff8a80' : '#6ee7b7' }}>
                    {profileMsg.type === 'error' ? <AlertCircle size={15}/> : <CheckCircle size={15}/>} {profileMsg.text}
                  </div>
                )}

                <div className="input-group">
                  <label>Full Name</label>
                  <div className="input-wrap"><input type="text" value={name} onChange={e => setName(e.target.value)} style={{ paddingLeft: 16 }} /></div>
                </div>
                <div className="input-group">
                  <label>Email Address</label>
                  <div className="input-wrap"><input type="email" value={user?.email || ''} disabled style={{ paddingLeft: 16, opacity: 0.5 }} /></div>
                </div>
                <div className="input-group">
                  <label>Phone Number</label>
                  <div className="input-wrap"><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" style={{ paddingLeft: 16 }} /></div>
                </div>

                <button className="btn-primary" style={{ marginTop: 8 }} onClick={handleSaveProfile} disabled={savingProfile}>
                  {savingProfile ? <div className="spinner" /> : <><Save size={15} /> Save Changes</>}
                </button>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div>
              <div className="card-header"><span className="card-title">Security Settings</span></div>
              <div className="card-body">
                {secMsg.text && (
                  <div style={{ padding: '10px', marginBottom: 16, borderRadius: 8, fontSize: 13, display: 'flex', gap: 8, alignItems: 'center', background: secMsg.type === 'error' ? 'rgba(255,59,48,0.1)' : 'rgba(52,211,153,0.1)', color: secMsg.type === 'error' ? '#ff8a80' : '#6ee7b7' }}>
                    {secMsg.type === 'error' ? <AlertCircle size={15}/> : <CheckCircle size={15}/>} {secMsg.text}
                  </div>
                )}
                
                <div className="input-group">
                  <label>Current Password</label>
                  <div className="input-wrap"><input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="••••••••" style={{ paddingLeft: 16 }} /></div>
                </div>
                <div className="input-group">
                  <label>New Password</label>
                  <div className="input-wrap"><input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min. 8 characters" style={{ paddingLeft: 16 }} /></div>
                </div>
                <div className="input-group">
                  <label>Confirm New Password</label>
                  <div className="input-wrap"><input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat new password" style={{ paddingLeft: 16 }} /></div>
                </div>
                <button className="btn-primary" style={{ marginTop: 8 }} onClick={handleUpdatePassword} disabled={savingSec}>
                  {savingSec ? <div className="spinner" /> : <><Key size={15} /> Update Password</>}
                </button>

                <div className="divider" />
                <SettingRow label="Two-Factor Authentication" sub="Add an extra layer of security to your account">
                  <button className="btn-ghost" style={{ padding: '8px 16px', fontSize: 12.5 }}>Enable 2FA</button>
                </SettingRow>
                <SettingRow label="Active Sessions" sub="Manage where you're logged in">
                  <button className="btn-ghost danger" style={{ padding: '8px 16px', fontSize: 12.5 }}>Revoke all</button>
                </SettingRow>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div>
              <div className="card-header"><span className="card-title">Notification Preferences</span></div>
              <div className="card-body">
                {[
                  { key: 'email', label: 'Email Notifications', sub: 'Receive notifications via email' },
                  { key: 'push', label: 'Push Notifications', sub: 'Receive in-app push notifications' },
                  { key: 'fee', label: 'Fee Alerts', sub: 'Get notified about overdue fees and payments' },
                  { key: 'student', label: 'Student Activity', sub: 'Get notified when students enroll or update' },
                  { key: 'system', label: 'System Updates', sub: 'Receive notifications about system updates' },
                ].map(item => (
                  <SettingRow key={item.key} label={item.label} sub={item.sub}>
                    <Toggle value={(notifs as any)[item.key]} onChange={v => setNotifs(p => ({ ...p, [item.key]: v }))} />
                  </SettingRow>
                ))}
                <button className="btn-primary" style={{ marginTop: 20 }}><Save size={15} /> Save Preferences</button>
              </div>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div>
              <div className="card-header"><span className="card-title">Appearance</span></div>
              <div className="card-body">
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.55)', letterSpacing: 0.5, textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>Theme</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    {[{ label: 'Dark (Current)', active: true, preview: 'linear-gradient(135deg, #0a0a14, #1a1a2e)' }, { label: 'Light', active: false, preview: 'linear-gradient(135deg, #f0f0f8, #e8e8f0)' }, { label: 'System', active: false, preview: 'linear-gradient(135deg, #0a0a14 50%, #f0f0f8 50%)' }].map(t => (
                      <div key={t.label} style={{ borderRadius: 14, overflow: 'hidden', border: t.active ? '2px solid #7c6dff' : '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                        <div style={{ height: 60, background: t.preview }} />
                        <div style={{ padding: '8px 12px', fontSize: 12.5, fontWeight: 600, color: t.active ? '#a78bfa' : 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.04)', textAlign: 'center' }}>{t.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <SettingRow label="Compact Mode" sub="Use smaller spacing and font sizes">
                  <Toggle value={false} onChange={() => {}} />
                </SettingRow>
                <SettingRow label="Sidebar Collapsed by Default" sub="Start with a collapsed sidebar">
                  <Toggle value={false} onChange={() => {}} />
                </SettingRow>
              </div>
            </div>
          )}

          {activeSection === 'system' && (
            <div>
              <div className="card-header"><span className="card-title">System Information</span></div>
              <div className="card-body">
                {[
                  { label: 'Platform', value: 'EIMS Pro v2.4.1' },
                  { label: 'Database', value: 'PostgreSQL 15 (Docker)' },
                  { label: 'API Server', value: 'NestJS — localhost:3000' },
                  { label: 'Frontend', value: 'React 18 + Vite — localhost:5173' },
                  { label: 'ORM', value: 'Prisma v7.7.0' },
                  { label: 'Node Version', value: 'v22.14.0' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.5)' }}>{item.label}</span>
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: 'rgba(255,255,255,0.8)', fontFamily: 'monospace' }}>{item.value}</span>
                  </div>
                ))}
                <div className="divider" />
                <button className="btn-ghost danger" style={{ padding: '10px 18px', fontSize: 13.5 }}>Clear All Cache</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
