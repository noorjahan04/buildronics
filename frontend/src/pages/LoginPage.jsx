import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(form.email, form.password);
    if (res.success) navigate(from, { replace: true });
  };

  const fillDemo = (type) => {
    if (type === 'admin') setForm({ email: 'admin@buildronics.com', password: 'Admin@123' });
    else setForm({ email: 'test@buildronics.com', password: 'Test@123' });
  };

  return (
    <div className="auth-page page-enter">
      <div className="auth-card card">
        <div className="auth-logo">⬡ BUILDRONICS</div>
        <h2>Welcome back</h2>
        <p className="auth-sub">Sign in to your account</p>

        {/* <div className="demo-btns">
          <button className="demo-btn" onClick={() => fillDemo('user')}>Fill Test User</button>
          <button className="demo-btn admin" onClick={() => fillDemo('admin')}>Fill Admin</button>
        </div> */}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" required autoFocus />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="password-wrap">
              <input type={show ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" required />
              <button type="button" className="show-pass" onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'}</button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-switch">Don't have an account? <Link to="/register">Create one</Link></p>
      </div>
    </div>
  );
}
