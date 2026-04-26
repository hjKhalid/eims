import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Play, Users, Clock, Plus, RefreshCw, AlertCircle, Square, ExternalLink, Calendar } from 'lucide-react';
import api from '../lib/api';
import { classesApi, type ClassRecord } from '../lib/api';

interface Session { id: string; title: string; classId: string; teacherId: string; scheduledAt: string; status: 'SCHEDULED' | 'LIVE' | 'ENDED'; roomId?: string; recordingUrl?: string; class?: { name: string }; participants?: any[]; }

const statusStyle: Record<string, { bg: string; color: string; border: string; dot: string }> = {
  SCHEDULED: { bg: 'rgba(56,189,248,0.12)', color: '#7dd3fc', border: 'rgba(56,189,248,0.2)', dot: '#7dd3fc' },
  LIVE:      { bg: 'rgba(52,211,153,0.15)', color: '#6ee7b7', border: 'rgba(52,211,153,0.25)', dot: '#6ee7b7' },
  ENDED:     { bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', border: 'rgba(255,255,255,0.1)', dot: 'rgba(255,255,255,0.3)' },
};

export default function SessionsPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', classId: '', scheduledAt: '', teacherId: 'admin' });

  const fetchSessions = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await api.get('/sessions');
      setSessions(res.data);
    } catch (e: any) { setError('Failed to load sessions'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchSessions(); classesApi.getAll().then(setClasses).catch(() => {}); }, [fetchSessions]);

  const handleCreate = async () => {
    if (!form.title || !form.classId || !form.scheduledAt) return;
    setSaving(true);
    try {
      await api.post('/sessions', form);
      setShowModal(false); setForm({ title: '', classId: '', scheduledAt: '', teacherId: 'admin' });
      fetchSessions();
    } catch {}
    finally { setSaving(false); }
  };

  const handleStart = async (id: string) => {
    try { await api.post(`/sessions/${id}/start`); fetchSessions(); } catch {}
  };

  const handleEnd = async (id: string) => {
    const url = prompt('Recording URL (optional, press Enter to skip):') || undefined;
    try { await api.post(`/sessions/${id}/end`, { recordingUrl: url }); fetchSessions(); } catch {}
  };

  const live = sessions.filter(s => s.status === 'LIVE');
  const scheduled = sessions.filter(s => s.status === 'SCHEDULED');
  const ended = sessions.filter(s => s.status === 'ENDED');

  const SessionCard = ({ s }: { s: Session }) => {
    const st = statusStyle[s.status];
    return (
      <div className="glass-card" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              {s.status === 'LIVE' && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#6ee7b7', boxShadow: '0 0 6px #6ee7b7', display: 'inline-block', animation: 'pulse 2s infinite' }} />}
              <span style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{s.title}</span>
            </div>
            <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>📚 {s.class?.name || 'Unknown class'}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>🗓 {new Date(s.scheduledAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</div>
            {s.roomId && <div style={{ fontSize: 11.5, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>Room: {s.roomId}</div>}
          </div>
          <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: st.bg, color: st.color, border: `1px solid ${st.border}`, whiteSpace: 'nowrap' }}>{s.status}</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {s.status === 'SCHEDULED' && (
            <button className="btn-primary" style={{ padding: '7px 14px', fontSize: 12 }} onClick={() => handleStart(s.id)}><Play size={13} /> Start</button>
          )}
          {s.status === 'LIVE' && (
            <>
              <button className="btn-primary" style={{ padding: '7px 14px', fontSize: 12 }} onClick={() => navigate(`/sessions/room/${s.roomId || s.id}`)}><Video size={13} /> Join Session</button>
              <button className="btn-ghost danger" style={{ padding: '7px 14px', fontSize: 12 }} onClick={() => handleEnd(s.id)}><Square size={13} /> End Session</button>
            </>
          )}
          {s.recordingUrl && (
            <a href={s.recordingUrl} target="_blank" rel="noreferrer"><button className="btn-ghost" style={{ padding: '7px 14px', fontSize: 12 }}><ExternalLink size={13} /> Recording</button></a>
          )}
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginLeft: 'auto', alignSelf: 'center' }}>
            <Users size={12} style={{ display: 'inline', marginRight: 4 }} />{s.participants?.length || 0} participants
          </span>
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.6, color: 'rgba(255,255,255,0.95)', marginBottom: 6 }}>Live Sessions</h1>
          <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.4)' }}>Schedule and manage virtual classroom sessions</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={fetchSessions} className="btn-ghost" style={{ padding: '10px 14px' }} disabled={loading}><RefreshCw size={15} /></button>
          <button onClick={() => setShowModal(true)} className="btn-primary" style={{ width: 'auto', padding: '11px 20px', fontSize: 14 }}><Plus size={16} /> Schedule Session</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[{ label: 'Live Now', value: live.length, color: '#6ee7b7', bg: 'rgba(52,211,153,0.15)' }, { label: 'Scheduled', value: scheduled.length, color: '#7dd3fc', bg: 'rgba(56,189,248,0.12)' }, { label: 'Completed', value: ended.length, color: 'rgba(255,255,255,0.4)', bg: 'rgba(255,255,255,0.06)' }].map(s => (
          <div key={s.label} className="stat-card" style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, letterSpacing: -1, marginBottom: 4 }}>{loading ? '—' : s.value}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {error && <div style={{ marginBottom: 18, padding: '12px 16px', background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.2)', borderRadius: 12, color: '#ff8a80', fontSize: 13.5, display: 'flex', gap: 8 }}><AlertCircle size={15} />{error}</div>}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div className="spinner" style={{ width: 32, height: 32 }} /></div>
      ) : sessions.length === 0 ? (
        <div className="empty-state"><Video size={36} style={{ opacity: 0.25 }} /><p>No sessions yet. Schedule one to get started.</p></div>
      ) : (
        <>
          {live.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#6ee7b7', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 14 }}>🔴 LIVE NOW</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
                {live.map(s => <SessionCard key={s.id} s={s} />)}
              </div>
            </div>
          )}
          {scheduled.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 14 }}>UPCOMING</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
                {scheduled.map(s => <SessionCard key={s.id} s={s} />)}
              </div>
            </div>
          )}
          {ended.length > 0 && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 14 }}>PAST SESSIONS</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
                {ended.slice(0, 6).map(s => <SessionCard key={s.id} s={s} />)}
              </div>
            </div>
          )}
        </>
      )}

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setShowModal(false)}>
          <div style={{ background: 'rgba(18,18,32,0.95)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: 32, width: '100%', maxWidth: 460, backdropFilter: 'blur(40px)' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 6 }}>Schedule Session</h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>Create a new live class session</p>
            <div className="input-group"><label>Session Title *</label><div className="input-wrap"><input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Math - Chapter 5" style={{ paddingLeft: 16 }} /></div></div>
            <div className="input-group">
              <label>Class *</label>
              <select value={form.classId} onChange={e => setForm(p => ({ ...p, classId: e.target.value }))} style={{ width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter, sans-serif', fontSize: 14, outline: 'none' }}>
                <option value="" style={{ background: '#1a1a2e' }}>Select class...</option>
                {classes.map(c => <option key={c.id} value={c.id} style={{ background: '#1a1a2e' }}>{c.name}</option>)}
              </select>
            </div>
            <div className="input-group"><label>Date & Time *</label><div className="input-wrap"><input type="datetime-local" value={form.scheduledAt} onChange={e => setForm(p => ({ ...p, scheduledAt: e.target.value }))} style={{ paddingLeft: 16 }} /></div></div>
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 2 }} onClick={handleCreate} disabled={saving}>{saving ? <div className="spinner" /> : 'Schedule Session'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
