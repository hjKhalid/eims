import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useAuthStore } from '../../store/authStore';

export const DashboardLayout = () => {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {/* App-wide animated background */}
      <div className="app-bg" />

      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
          <Navbar />
          <main style={{
            flex: 1,
            overflowY: 'auto',
            padding: '28px 32px',
          }}>
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};
