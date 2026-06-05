import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await login(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('name', res.data.name);
      localStorage.setItem('userId', res.data.id);
      navigate(res.data.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data || 'Invalid email or password.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      {/* Left hero panel with airplane background */}
      <div className="auth-hero">
        <div className="auth-hero-bg" />
        <div className="auth-hero-content">
          <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>✈️</div>
          <h1>SkyBook Airlines</h1>
          <p>Your premium flight booking experience. Fly anywhere, anytime with confidence.</p>
          <div className="auth-hero-features">
            <div className="feature">✈️ &nbsp;Book flights to 50+ destinations</div>
            <div className="feature">💺 &nbsp;Choose your exact seat</div>
            <div className="feature">🔄 &nbsp;Easy cancellation & refunds</div>
            <div className="feature">📱 &nbsp;Self check-in from anywhere</div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-side">
        <div className="auth-card">
          <div className="auth-logo">
            ✈️ SkyBook Airlines
          </div>
          <h2>Welcome back</h2>
          <p className="subtitle">Sign in to your account to continue</p>

          {error && <div className="alert alert-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={form.password}
                onChange={e => setForm({...form, password: e.target.value})} required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '0.5rem' }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div className="divider" />
          <p style={{ textAlign: 'center', color: 'var(--text-light)', fontSize: '0.9rem' }}>
            Don't have an account? <Link to="/register" className="link">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
