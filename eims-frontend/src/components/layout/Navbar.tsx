import { Bell, Search, Command } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const Navbar = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="navbar">
      {/* Search */}
      <div className="search-box">
        <span className="search-icon">
          <Search size={15} />
        </span>
        <input
          type="text"
          placeholder="Search students, classes, reports..."
          id="navbar-search"
        />
        <div style={{
          position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
          display: 'flex', alignItems: 'center', gap: 3,
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 6, padding: '2px 7px',
        }}>
          <Command size={10} style={{ color: 'rgba(255,255,255,0.3)' }} />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>K</span>
        </div>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Notification button */}
        <button className="notif-btn" id="notif-btn">
          <Bell size={17} />
          <span className="notif-dot" />
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.08)', margin: '0 4px' }} />

        {/* User info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)', lineHeight: 1.2 }}>
              {user?.name || 'User'}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textTransform: 'capitalize' }}>
              {(user as any)?.roles?.[0] || 'Administrator'}
            </div>
          </div>
          <div className="navbar-avatar">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};
