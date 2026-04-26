import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, School, GitBranch, Users, BookOpen, Settings,
  LogOut, ChevronRight, GraduationCap, Bell, CheckSquare, FileText,
  Video, DollarSign, BarChart2, MessageCircle
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const menuSections = [
  {
    title: 'Main',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: BarChart2, label: 'Reports', path: '/reports' },
    ],
  },
  {
    title: 'Management',
    items: [
      { icon: School, label: 'Schools', path: '/schools' },
      { icon: GitBranch, label: 'Branches', path: '/branches' },
      { icon: Users, label: 'Users', path: '/users' },
    ],
  },
  {
    title: 'Academic',
    items: [
      { icon: BookOpen, label: 'Academic', path: '/academic' },
      { icon: GraduationCap, label: 'Students', path: '/students' },
      { icon: CheckSquare, label: 'Attendance', path: '/attendance' },
      { icon: FileText, label: 'Assignments', path: '/assignments' },
      { icon: Video, label: 'Live Sessions', path: '/sessions' },
    ],
  },
  {
    title: 'Finance',
    items: [
      { icon: DollarSign, label: 'Finance', path: '/finance' },
    ],
  },
  {
    title: 'System',
    items: [
      { icon: MessageCircle, label: 'Messages', path: '/messages' },
      { icon: Bell, label: 'Notifications', path: '/notifications' },
      { icon: Settings, label: 'Settings', path: '/settings' },
    ],
  },
];

export const Sidebar = () => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        </div>
        <div>
          <div className="sidebar-logo-text">EIMS Pro</div>
          <div className="sidebar-logo-sub">Management System</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {menuSections.map((section) => (
          <div key={section.title}>
            <div className="sidebar-section-title">{section.title}</div>
            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              >
                <div className="nav-item-icon">
                  <item.icon size={17} />
                </div>
                <span style={{ flex: 1 }}>{item.label}</span>
                <ChevronRight size={13} style={{ opacity: 0.3 }} />
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        {user && (
          <div className="user-chip" style={{ marginBottom: 8 }}>
            <div className="user-avatar">
              {user.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textTransform: 'capitalize' }}>
                {(user as any)?.roles?.[0] || 'Admin'}
              </div>
            </div>
          </div>
        )}

        <button onClick={logout} className="btn-ghost danger" style={{ width: '100%', justifyContent: 'flex-start' }}>
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
