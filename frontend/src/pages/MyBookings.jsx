import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getMyBookings, cancelBooking } from '../api';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  const load = () => getMyBookings().then(r => setBookings(r.data));
  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const res = await cancelBooking(id);
      alert(`Booking cancelled.\nRefund amount: ₦${res.data.refund?.toLocaleString()}`);
      load();
    } catch { alert('Could not cancel booking. Please try again.'); }
  };

  const confirmed = bookings.filter(b => b.status === 'CONFIRMED').length;
  const checkedIn = bookings.filter(b => b.status === 'CHECKED_IN').length;
  const cancelled = bookings.filter(b => b.status === 'CANCELLED').length;

  return (
    <div className="page">
      <Navbar />
      <div className="content">
        <div className="page-header">
          <div>
            <h1>My Bookings 🎫</h1>
            <p>View and manage all your flight bookings</p>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-card"><div className="stat-label">Total Bookings</div><div className="stat-value">{bookings.length}</div></div>
          <div className="stat-card success"><div className="stat-label">Confirmed</div><div className="stat-value">{confirmed}</div></div>
          <div className="stat-card accent"><div className="stat-label">Checked In</div><div className="stat-value">{checkedIn}</div></div>
          <div className="stat-card danger"><div className="stat-label">Cancelled</div><div className="stat-value">{cancelled}</div></div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr><th>Booking ID</th><th>Flight ID</th><th>Seat</th><th>Class</th><th>Booked On</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-light)', padding: '2rem' }}>
                  No bookings yet. <a href="/dashboard" className="link">Book a flight →</a>
                </td></tr>
              ) : bookings.map(b => (
                <tr key={b.id}>
                  <td><span className="flight-number">#{b.id}</span></td>
                  <td>{b.flightId}</td>
                  <td style={{ fontWeight: 600 }}>{b.seatNumber}</td>
                  <td>{b.seatClass}</td>
                  <td style={{ color: 'var(--text-light)' }}>{b.bookingTime?.substring(0, 16).replace('T', ' ')}</td>
                  <td><span className={`badge badge-${b.status?.toLowerCase()}`}>{b.status}</span></td>
                  <td>
                    {b.status === 'CONFIRMED' && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleCancel(b.id)}>Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
