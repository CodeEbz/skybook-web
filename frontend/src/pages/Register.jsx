import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phoneNumber: '', address: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await register(form);
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data || 'Registration failed. Email may already be in use.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="auth-hero-bg" />
        <div className="auth-hero-content">
          <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>✈️</div>
          <h1>Join SkyBook</h1>
          <p>Create your free account and start booking flights to amazing destinations around the world.</p>
          <div className="auth-hero-features">
            <div className="feature">🌍 &nbsp;International & local flights</div>
            <div className="feature">🔐 &nbsp;Secure & encrypted payments</div>
            <div className="feature">🎫 &nbsp;Instant e-ticket generation</div>
            <div className="feature">⭐ &nbsp;Premium travel experience</div>
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">
          <div className="auth-logo">
            ✈️ SkyBook Airlines
          </div>
          <h2>Create account</h2>
          <p className="subtitle">Fill in your details to get started</p>

          {error && <div className="alert alert-error">⚠️ {error}</div>}
          {success && <div className="alert alert-success">✅ {success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input placeholder="John Doe" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Phone Number</label>
                <input placeholder="+234..." value={form.phoneNumber} onChange={e => setForm({...form, phoneNumber: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" placeholder="Min. 6 chars" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
              </div>
            </div>
            <div className="form-group">
              <label>Address</label>
              <input placeholder="Your address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '0.5rem' }}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <div className="divider" />
          <p style={{ textAlign: 'center', color: 'var(--text-light)', fontSize: '0.9rem' }}>
            Already have an account? <Link to="/" className="link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
