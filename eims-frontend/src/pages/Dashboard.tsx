import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import {
  Users, School, BookOpen, GraduationCap, TrendingUp,
  ArrowUpRight, Activity, Calendar, Clock, Video, FileText, DollarSign, RefreshCw,
} from 'lucide-react';
import api from '../lib/api';

interface DashSummary {
  schools: number; branches: number; users: number;
  classes: number; sessions: number; assignments: number; paidInvoices: number;
}

const recentActivity = [
  { label: 'New student enrolled', sub: 'System — Most recent', time: 'Recent', color: '#a78bfa' },
  { label: 'Assignment submitted', sub: 'Latest submission', time: 'Today', color: '#6ee7b7' },
  { label: 'Leave request approved', sub: 'Attendance updated', time: 'Today', color: '#7dd3fc' },
  { label: 'Fee payment received', sub: 'Invoice marked paid', time: 'Today', color: '#fdba74' },
  { label: 'Live session ended', sub: 'Recording saved', time: 'Today', color: '#f9a8d4' },
];

const upcomingEvents = [
  { month: 'APR', day: '22', title: 'PTM Meeting', time: '10:00 AM', type: 'Event' },
  { month: 'APR', day: '28', title: 'Annual Sports Day', time: '9:00 AM', type: 'Event' },
  { month: 'MAY', day: '5', title: 'Term 2 Exams Begin', time: 'All Day', type: 'Exam' },
  { month: 'MAY', day: '15', title: 'Fee Due Date', time: 'Deadline', type: 'Finance' },
];

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const [summary, setSummary] = useState<DashSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const now = new Date();

  useEffect(() => {
    api.get('/reports/dashboard')
      .then(r => setSummary(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Total Users', value: loading ? '…' : String(summary?.users ?? 0), change: 'Registered', trend: 'up', icon: GraduationCap, color: 'rgba(124, 109, 255, 0.25)', iconColor: '#a78bfa', glow: 'rgba(124,109,255,0.2)' },
    { label: 'Active Classes', value: loading ? '…' : String(summary?.classes ?? 0), change: 'This term', trend: 'up', icon: BookOpen, color: 'rgba(52, 211, 153, 0.2)', iconColor: '#6ee7b7', glow: 'rgba(52,211,153,0.15)' },
    { label: 'Schools', value: loading ? '…' : String(summary?.schools ?? 0), change: `${summary?.branches ?? 0} branches`, trend: 'neutral', icon: School, color: 'rgba(56, 189, 248, 0.2)', iconColor: '#7dd3fc', glow: 'rgba(56,189,248,0.15)' },
    { label: 'Fees Collected', value: loading ? '…' : String(summary?.paidInvoices ?? 0), change: 'Paid invoices', trend: 'neutral', icon: DollarSign, color: 'rgba(251, 146, 60, 0.2)', iconColor: '#fdba74', glow: 'rgba(251,146,60,0.15)' },
  ];

  const quickStats = summary ? [
    { label: 'Sessions', value: summary.sessions, icon: Video, color: '#f9a8d4' },
    { label: 'Assignments', value: summary.assignments, icon: FileText, color: '#a78bfa' },
    { label: 'Branches', value: summary.branches, icon: TrendingUp, color: '#6ee7b7' },
  ] : [];

  return (
    <div style={{ maxWidth: 1280 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#a78bfa', padding: '3px 10px', background: 'rgba(124,109,255,0.15)', borderRadius: 20, border: '1px solid rgba(124,109,255,0.2)' }}>
            🟢 LIVE DASHBOARD
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'rgba(255,255,255,0.95)', letterSpacing: -0.8, marginBottom: 4 }}>
              Welcome back, {user?.name?.split(' ')[0] || 'Admin'} 👋
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Here's what's happening across your institution today.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            <Calendar size={14} />
            {now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 22 }}>
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card" style={{ padding: '22px 24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: stat.glow, filter: 'blur(24px)', pointerEvents: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <stat.icon size={22} style={{ color: stat.iconColor }} />
              </div>
              {stat.trend === 'up' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', background: 'rgba(52,211,153,0.12)', borderRadius: 8, border: '1px solid rgba(52,211,153,0.2)' }}>
                  <ArrowUpRight size={12} style={{ color: '#6ee7b7' }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#6ee7b7' }}>{stat.change}</span>
                </div>
              )}
            </div>
            <div style={{ fontSize: 34, fontWeight: 800, color: 'rgba(255,255,255,0.95)', letterSpacing: -1.5, marginBottom: 4 }}>{stat.value}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{stat.label}</div>
            {stat.trend === 'neutral' && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{stat.change}</div>}
          </div>
        ))}
      </div>

      {/* Quick Stats Row */}
      {quickStats.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 22 }}>
          {quickStats.map(s => (
            <div key={s.label} className="stat-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <s.icon size={18} style={{ color: s.color, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: s.color, letterSpacing: -0.5 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        {/* Recent Activity */}
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={16} style={{ color: '#a78bfa' }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>Recent Activity</span>
            </div>
          </div>
          <div style={{ padding: '8px 0' }}>
            {recentActivity.map((item, i) => (
              <div key={i} style={{ padding: '12px 22px', display: 'flex', alignItems: 'center', gap: 14, borderBottom: i < recentActivity.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0, boxShadow: `0 0 6px ${item.color}` }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{item.sub}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>
                  <Clock size={11} />{item.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calendar size={16} style={{ color: '#7dd3fc' }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>Upcoming Events</span>
            </div>
          </div>
          <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {upcomingEvents.map((ev, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ textAlign: 'center', minWidth: 40, padding: '6px 4px', background: 'rgba(124,109,255,0.15)', borderRadius: 10, flexShrink: 0 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: '#a78bfa', letterSpacing: 0.5, textTransform: 'uppercase' }}>{ev.month}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'rgba(255,255,255,0.9)', lineHeight: 1 }}>{ev.day}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 2 }}>{ev.title}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} />{ev.time}</div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: ev.type === 'Finance' ? 'rgba(251,146,60,0.15)' : ev.type === 'Exam' ? 'rgba(255,59,48,0.1)' : 'rgba(124,109,255,0.15)', color: ev.type === 'Finance' ? '#fdba74' : ev.type === 'Exam' ? '#ff8a80' : '#a78bfa' }}>{ev.type}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
