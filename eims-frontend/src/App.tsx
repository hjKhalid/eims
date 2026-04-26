import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Schools from './pages/Schools';
import Branches from './pages/Branches';
import UsersPage from './pages/Users';
import Academic from './pages/Academic';
import Students from './pages/Students';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Messages from './pages/Messages';
import AttendancePage from './pages/AttendancePage';
import AssignmentsPage from './pages/AssignmentsPage';
import SessionsPage from './pages/SessionsPage';
import VideoRoom from './pages/VideoRoom';
import Finance from './pages/Finance';
import Reports from './pages/Reports';

import { DashboardLayout } from './components/layout/DashboardLayout';

function App() {
  const token = useAuthStore((state) => state.token);

  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" />} />

        {/* Protected routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard"     element={<Dashboard />} />
          <Route path="/schools"       element={<Schools />} />
          <Route path="/branches"      element={<Branches />} />
          <Route path="/users"         element={<UsersPage />} />
          <Route path="/academic"      element={<Academic />} />
          <Route path="/students"      element={<Students />} />
          <Route path="/attendance"    element={<AttendancePage />} />
          <Route path="/assignments"   element={<AssignmentsPage />} />
          <Route path="/sessions"      element={<SessionsPage />} />
          <Route path="/sessions/room/:roomId" element={<VideoRoom />} />
          <Route path="/finance"       element={<Finance />} />
          <Route path="/reports"       element={<Reports />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messages"      element={<Messages />} />
          <Route path="/settings"      element={<Settings />} />
        </Route>

        {/* Catch-all */}
        <Route path="/" element={<Navigate to={token ? '/dashboard' : '/login'} />} />
        <Route path="*" element={<Navigate to={token ? '/dashboard' : '/login'} />} />
      </Routes>
    </Router>
  );
}

export default App;
