import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('role');
  const name = localStorage.getItem('name');
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => { 
    localStorage.clear(); 
    setMenuOpen(false);
    navigate('/'); 
  };
  
  const isActive = (path) => location.pathname === path ? 'active' : '';
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="navbar">
      <Link to={role === 'ADMIN' ? '/admin' : '/dashboard'} className="logo" onClick={closeMenu}>
        ✈️ SkyBook Airlines
      </Link>
      
      <button 
        className={`navbar-toggle ${menuOpen ? 'open' : ''}`} 
        onClick={toggleMenu} 
        aria-label="Toggle navigation menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={menuOpen ? 'open' : ''}>
        {role === 'ADMIN' ? (
          <Link to="/admin" className={isActive('/admin')} onClick={closeMenu}>Admin Panel</Link>
        ) : (
          <>
            <Link to="/dashboard" className={isActive('/dashboard')} onClick={closeMenu}>✈️ Flights</Link>
            <Link to="/my-bookings" className={isActive('/my-bookings')} onClick={closeMenu}>🎫 My Bookings</Link>
            <Link to="/checkin" className={isActive('/checkin')} onClick={closeMenu}>✅ Check-In</Link>
            <Link to="/profile" className={isActive('/profile')} onClick={closeMenu}>👤 Profile</Link>
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
