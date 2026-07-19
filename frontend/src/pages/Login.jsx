import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import Logo from '../components/Logo.jsx';

const DEMO = [
  { role: 'Admin', email: 'admin@cowxlabs.com', password: 'admin123' },
  { role: 'Employee', email: 'employee@cowxlabs.com', password: 'employee123' },
  { role: 'Client', email: 'client@cowxlabs.com', password: 'client123' }
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(`/${user.role}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (d) => { setEmail(d.email); setPassword(d.password); };

  return (
    <div className="page auth-page">
      <div className="auth-card">
        <div className="brand brand-lg" style={{ justifyContent: 'center' }}>
          <Logo size={52} animated />
        </div>
        <h2>Sign in</h2>
        <p className="muted" style={{ marginTop: '2px' }}>Access your portal.</p>

        <form className="form" onSubmit={submit}>
          <label className="field"><span>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@company.com" />
          </label>
          <label className="field"><span>Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
          </label>
          {error && <div className="alert alert-err">{error}</div>}
          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="demo-box">
          <div className="demo-title">Demo accounts</div>
          {DEMO.map((d) => (
            <button key={d.role} className="demo-row" onClick={() => fillDemo(d)}>
              <span><strong>{d.role}</strong> · {d.email}</span>
              <span className="demo-pw">{d.password}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
