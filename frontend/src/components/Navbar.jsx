import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('role');
  const name = localStorage.getItem('name');

  const logout = () => { localStorage.clear(); navigate('/'); };
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="navbar">
      <Link to={role === 'ADMIN' ? '/admin' : '/dashboard'} className="logo">
        ✈️ SkyBook Airlines
      </Link>
      <nav>
        {role === 'ADMIN' ? (
          <Link to="/admin" className={isActive('/admin')}>Admin Panel</Link>
        ) : (
          <>
            <Link to="/dashboard" className={isActive('/dashboard')}>✈️ Flights</Link>
            <Link to="/my-bookings" className={isActive('/my-bookings')}>🎫 My Bookings</Link>
            <Link to="/checkin" className={isActive('/checkin')}>✅ Check-In</Link>
            <Link to="/profile" className={isActive('/profile')}>👤 Profile</Link>
          </>
        )}
        <div className="nav-user">
          <span>👤 {name}</span>
          <button className="btn-logout" onClick={logout}>Logout</button>
        </div>
      </nav>
    </div>
  );
}
