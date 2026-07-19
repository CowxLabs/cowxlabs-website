import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext.jsx';

import PublicLayout from './components/PublicLayout.jsx';
import DashLayout from './components/DashLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Services from './pages/Services.jsx';
import Contact from './pages/Contact.jsx';
import Work from './pages/Work.jsx';
import Pricing from './pages/Pricing.jsx';
import FaqPage from './pages/Faq.jsx';
import Login from './pages/Login.jsx';

import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import EmployeeDashboard from './pages/employee/EmployeeDashboard.jsx';
import ClientDashboard from './pages/client/ClientDashboard.jsx';

export default function App() {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading…</div>;

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/work" element={<Work />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      <Route path="/login" element={user ? <Navigate to={`/${user.role}`} replace /> : <Login />} />

      <Route
        element={
          <ProtectedRoute allow={['admin', 'employee', 'client']}>
            <DashLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/*" element={<ProtectedRoute allow={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute allow={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/employee/*" element={<ProtectedRoute allow={['employee']}><EmployeeDashboard /></ProtectedRoute>} />
        <Route path="/employee" element={<ProtectedRoute allow={['employee']}><EmployeeDashboard /></ProtectedRoute>} />
        <Route path="/client/*" element={<ProtectedRoute allow={['client']}><ClientDashboard /></ProtectedRoute>} />
        <Route path="/client" element={<ProtectedRoute allow={['client']}><ClientDashboard /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
