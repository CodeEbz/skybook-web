import { useState } from 'react';
import Navbar from '../components/Navbar';
import { findBooking, confirmCheckIn } from '../api';

export default function CheckIn() {
  const [bookingId, setBookingId] = useState('');
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFind = async (e) => {
    e.preventDefault();
    setError(''); setBooking(null); setSuccess('');
    try {
      const res = await findBooking(bookingId);
      setBooking(res.data);
    } catch (err) {
      setError(err.response?.data || 'Booking not found. Please check your Booking ID.');
    }
  };

  const handleConfirm = async () => {
    try {
      await confirmCheckIn(bookingId);
      setSuccess('✅ Check-in successful! Your electronic boarding pass has been generated. Have a great flight!');
      setBooking(null);
      setBookingId('');
    } catch { setError('Check-in failed. Please try again or visit a kiosk.'); }
  };

  return (
    <div className="page">
      <Navbar />
      <div className="content" style={{ maxWidth: '640px' }}>
        <div className="page-header">
          <div>
            <h1>Self Check-In ✅</h1>
            <p>Enter your Booking ID to check in for your flight</p>
          </div>
        </div>

        <div className="card">
          <form onSubmit={handleFind} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ flex: 1, margin: 0 }}>
              <label>Booking ID</label>
              <input type="number" placeholder="e.g. 12" value={bookingId}
                onChange={e => setBookingId(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: 'auto' }}>Find Booking</button>
          </form>

          {error && <div className="alert alert-error" style={{ marginTop: '1rem' }}>⚠️ {error}</div>}
          {success && <div className="alert alert-success" style={{ marginTop: '1rem' }}>{success}</div>}

          {booking && (
            <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'var(--bg)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', fontWeight: 700 }}>Booking Details</h3>
              <div className="responsive-form-grid" style={{ marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase' }}>Flight</div>
                  <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{booking.flightNumber}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase' }}>Route</div>
                  <div style={{ fontWeight: 600 }}>{booking.origin} → {booking.destination}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase' }}>Seat</div>
                  <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>{booking.seatNumber}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase' }}>Status</div>
                  <span className={`badge badge-${booking.status?.toLowerCase()}`}>{booking.status}</span>
                </div>
              </div>
              <button className="btn btn-success" onClick={handleConfirm}>
                ✅ Confirm Check-In & Generate Boarding Pass
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
