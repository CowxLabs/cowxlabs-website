import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import Logo from './Logo.jsx';
import PageTransition from './PageTransition.jsx';
import { LayoutDashboard, Users, Building2, FolderKanban, ListTodo, Receipt, LogOut } from 'lucide-react';

const TITLES = {
  admin: 'Admin Panel',
  employee: 'Employee Portal',
  client: 'Client Portal'
};

const ICONS = {
  '/admin': LayoutDashboard,
  '/admin/users': Users,
  '/admin/clients': Building2,
  '/admin/projects': FolderKanban,
  '/admin/tasks': ListTodo,
  '/admin/invoices': Receipt,
  '/employee': LayoutDashboard,
  '/client': LayoutDashboard
};

export default function DashLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  const base = `/${user.role}`;

  const links = [];
  if (user.role === 'admin') {
    links.push({ to: `${base}`, label: 'Overview' });
    links.push({ to: `${base}/users`, label: 'Users' });
    links.push({ to: `${base}/clients`, label: 'Clients' });
    links.push({ to: `${base}/projects`, label: 'Projects' });
    links.push({ to: `${base}/tasks`, label: 'Tasks' });
    links.push({ to: `${base}/invoices`, label: 'Invoices' });
  } else if (user.role === 'employee') {
    links.push({ to: `${base}`, label: 'My Work' });
  } else if (user.role === 'client') {
    links.push({ to: `${base}`, label: 'My Account' });
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dash">
      <aside className="dash-side">
        <Link to="/" className="brand brand-sm">
          <Logo size={28} />
        </Link>
        <div className="dash-role">{TITLES[user.role]}</div>
        <nav className="dash-links">
          {links.map((l) => {
            const Icon = ICONS[l.to] || LayoutDashboard;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={
                  l.to === `${base}`
                    ? (loc.pathname === base ? 'active' : '')
                    : loc.pathname.startsWith(l.to) ? 'active' : ''
                }
              >
                <Icon size={17} /> {l.label}
              </Link>
            );
          })}
        </nav>
        <button className="btn btn-ghost btn-block" onClick={handleLogout}>
          <LogOut size={16} /> Sign out
        </button>
      </aside>
      <section className="dash-content">
        <div className="dash-topbar">
          <span className="dash-user">
            {user.name} <span className="badge">{user.role}</span>
          </span>
        </div>
        <div className="dash-body">
          <PageTransition><Outlet /></PageTransition>
        </div>
      </section>
    </div>
  );
}
