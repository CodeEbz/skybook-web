import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getProfile, updateProfile } from '../api';

export default function Profile() {
  const [form, setForm] = useState({ name: '', email: '', phoneNumber: '', address: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { getProfile().then(r => setForm({ ...r.data, password: '' })); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await updateProfile(form);
      localStorage.setItem('name', form.name);
      setSuccess('Profile updated successfully!');
    } catch { setError('Could not update profile. Please try again.'); }
  };

  return (
    <div className="page">
      <Navbar />
      <div className="content" style={{ maxWidth: '640px' }}>
        <div className="page-header">
          <div>
            <h1>My Profile 👤</h1>
            <p>Manage your account information</p>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: 'white', fontWeight: 800 }}>
              {form.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{form.name}</div>
              <div style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>{form.email}</div>
            </div>
          </div>

          {error && <div className="alert alert-error">⚠️ {error}</div>}
          {success && <div className="alert alert-success">✅ {success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="responsive-form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={form.email || ''} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input value={form.phoneNumber || ''} onChange={e => setForm({...form, phoneNumber: e.target.value})} />
              </div>
              <div className="form-group">
                <label>New Password <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>(optional)</span></label>
                <input type="password" placeholder="Leave blank to keep current" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
              </div>
            </div>
            <div className="form-group">
              <label>Address</label>
              <input value={form.address || ''} onChange={e => setForm({...form, address: e.target.value})} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  );
}
