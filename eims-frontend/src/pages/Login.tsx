import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import api from '../lib/axios';
import { useAuthStore } from '../store/authStore';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      setAuth(response.data.user, response.data.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Animated background */}
      <div className="app-bg" />

      {/* Extra ambient glow orbs */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '15%', left: '20%', width: 420, height: 420,
          background: 'radial-gradient(circle, rgba(124,109,255,0.12) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)',
          animation: 'orb-drift-1 16s ease-in-out infinite alternate'
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '15%', width: 380, height: 380,
          background: 'radial-gradient(circle, rgba(91,142,245,0.10) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)',
          animation: 'orb-drift-2 20s ease-in-out infinite alternate'
        }} />
      </div>

      <div className="login-wrap">
        <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>

          {/* Brand mark above card */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: 20, padding: '8px 18px',
              backdropFilter: 'blur(12px)',
            }}>
              <Sparkles size={14} style={{ color: '#a78bfa' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.55)', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                EIMS Pro Platform
              </span>
            </div>
          </div>

          <div className="login-card">
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 14,
                  background: 'linear-gradient(135deg, #7c6dff 0%, #5b8ef5 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(124,109,255,0.45)',
                  flexShrink: 0
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                </div>
                <div>
                  <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, color: 'white', lineHeight: 1.1 }}>
                    Welcome back
                  </h1>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>
                    Sign in to your institution portal
                  </p>
                </div>
              </div>

              {/* Separator line */}
              <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />
            </div>

            {/* Error Alert */}
            {error && (
              <div style={{
                marginBottom: 20,
                padding: '12px 16px',
                background: 'rgba(255, 59, 48, 0.12)',
                border: '1px solid rgba(255, 59, 48, 0.25)',
                borderRadius: 12,
                color: '#ff8a80',
                fontSize: 13.5,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Email Address</label>
                <div className="input-wrap">
                  <span className="input-icon">
                    <Mail size={16} />
                  </span>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@school.com"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Password</label>
                <div className="input-wrap">
                  <span className="input-icon">
                    <Lock size={16} />
                  </span>
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {/* Remember + Forgot */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    id="remember-me"
                    type="checkbox"
                    style={{ accentColor: '#7c6dff', width: 14, height: 14, cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>Remember me</span>
                </label>
                <a href="#" style={{ fontSize: 13, color: '#a78bfa', textDecoration: 'none', fontWeight: 500 }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#c4b5fd')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#a78bfa')}
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit */}
              <button id="login-submit" type="submit" disabled={loading} className="btn-primary">
                {loading ? (
                  <div className="spinner" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="divider" style={{ marginTop: 28 }} />
            <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
              Need access?{' '}
              <a href="#" style={{ color: '#a78bfa', fontWeight: 600, textDecoration: 'none' }}>
                Contact your administrator
              </a>
            </p>
          </div>

          {/* Footer below card */}
          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 11.5, color: 'rgba(255,255,255,0.2)', letterSpacing: 0.3 }}>
            © 2026 EIMS Pro — Educational Institution Management System
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
