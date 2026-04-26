import { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Info, AlertTriangle, GraduationCap, DollarSign, Calendar, RefreshCw } from 'lucide-react';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';

const typeIcons: Record<string, { icon: any; color: string; bg: string }> = {
  info:       { icon: Info, color: '#7dd3fc', bg: 'rgba(56,189,248,0.15)' },
  warning:    { icon: AlertTriangle, color: '#fdba74', bg: 'rgba(251,146,60,0.15)' },
  student:    { icon: GraduationCap, color: '#a78bfa', bg: 'rgba(124,109,255,0.15)' },
  finance:    { icon: DollarSign, color: '#6ee7b7', bg: 'rgba(52,211,153,0.12)' },
  event:      { icon: Calendar, color: '#f9a8d4', bg: 'rgba(249,168,212,0.12)' },
  assignment: { icon: Info, color: '#7dd3fc', bg: 'rgba(56,189,248,0.12)' },
  attendance: { icon: AlertTriangle, color: '#fdba74', bg: 'rgba(251,146,60,0.12)' },
};

interface NotifRecord { id: string; type: string; title: string; body: string; readAt: string | null; createdAt: string; }

export default function Notifications() {
  const user = useAuthStore(s => s.user);
  const [notifications, setNotifications] = useState<NotifRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const fetch = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await api.get(`/notifications?userId=${user.id}`);
      setNotifications(res.data);
    } catch {
      // keep empty
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [user?.id]);

  const unreadCount = notifications.filter(n => !n.readAt).length;
  const shown = filter === 'unread' ? notifications.filter(n => !n.readAt) : notifications;

  const markRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, readAt: new Date().toISOString() } : n));
    } catch {}
  };

  const markAllRead = async () => {
    if (!user?.id) return;
    try {
      await api.post('/notifications/read-all', { userId: user.id });
      setNotifications(prev => prev.map(n => ({ ...n, readAt: n.readAt || new Date().toISOString() })));
    } catch {}
  };

  const timeAgo = (dt: string) => {
    const diff = Date.now() - new Date(dt).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'Just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.6, color: 'rgba(255,255,255,0.95)' }}>Notifications</h1>
            {unreadCount > 0 && (
              <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: 'rgba(124,109,255,0.2)', color: '#a78bfa', border: '1px solid rgba(124,109,255,0.3)' }}>
                {unreadCount} new
              </span>
            )}
          </div>
          <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.4)' }}>Stay up to date with your institution</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={fetch} className="btn-ghost" style={{ padding: '10px 14px' }}><RefreshCw size={15} /></button>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="btn-ghost" style={{ padding: '10px 18px', fontSize: 13.5 }}>
              <CheckCheck size={15} /> Mark all read
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 5, width: 'fit-content' }}>
        {(['all', 'unread'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 20px', borderRadius: 10, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s ease', border: 'none', background: filter === f ? 'rgba(124,109,255,0.25)' : 'transparent', color: filter === f ? '#a78bfa' : 'rgba(255,255,255,0.4)' }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}{f === 'unread' && unreadCount > 0 ? ` (${unreadCount})` : ''}
          </button>
        ))}
      </div>

      <div className="content-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" style={{ width: 28, height: 28 }} /></div>
        ) : shown.length === 0 ? (
          <div className="empty-state">
            <Bell size={36} style={{ opacity: 0.25 }} />
            <p>No {filter === 'unread' ? 'unread ' : ''}notifications</p>
            <p style={{ fontSize: 12 }}>Notifications will appear here as events happen in the system</p>
          </div>
        ) : (
          shown.map((n, i) => {
            const meta = typeIcons[n.type] || typeIcons.info;
            const Icon = meta.icon;
            return (
              <div key={n.id} style={{ display: 'flex', gap: 16, padding: '18px 24px', borderBottom: i < shown.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', background: !n.readAt ? 'rgba(124,109,255,0.04)' : 'transparent', position: 'relative', cursor: 'default' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                onMouseLeave={e => (e.currentTarget.style.background = !n.readAt ? 'rgba(124,109,255,0.04)' : 'transparent')}>
                {!n.readAt && <div style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', width: 5, height: 5, borderRadius: '50%', background: '#7c6dff', boxShadow: '0 0 8px #7c6dff' }} />}
                <div style={{ width: 42, height: 42, borderRadius: 12, background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <Icon size={18} style={{ color: meta.color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: n.readAt ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.9)' }}>{n.title}</span>
                    <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap', flexShrink: 0 }}>{timeAgo(n.createdAt)}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5, margin: 0 }}>{n.body}</p>
                </div>
                {!n.readAt && (
                  <button onClick={() => markRead(n.id)} className="btn-ghost" style={{ padding: '6px 10px', flexShrink: 0, alignSelf: 'flex-start' }} title="Mark as read">
                    <Check size={14} />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
