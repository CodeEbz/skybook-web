import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getAvailableSeats, createBooking } from '../api';

export default function BookingForm() {
  const [flight] = useState(() => JSON.parse(sessionStorage.getItem('selectedFlight') || 'null'));
  const [takenSeats, setTakenSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [seatClass, setSeatClass] = useState('ECONOMY');
  const [card, setCard] = useState({ cardNumber: '', expiry: '', cvv: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!flight) { navigate('/dashboard'); return; }
    getAvailableSeats(flight.id).then(r => {
      const allSeats = Array.from({ length: 60 }, (_, i) => i + 1);
      setTakenSeats(allSeats.filter(s => !r.data.includes(s)));
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSeat) { setError('Please select a seat from the grid.'); return; }
    if (card.cardNumber.length < 16) { setError('Please enter a valid 16-digit card number.'); return; }
    setLoading(true); setError('');
    try {
      const res = await createBooking({ flightId: flight.id, seatNumber: selectedSeat, seatClass, cardNumber: card.cardNumber });
      alert(`✅ Booking Confirmed!\n\nBooking ID: #${res.data.bookingId}\nFlight: ${flight.flightNumber}\nSeat: ${selectedSeat} (${seatClass})\n\nKeep your Booking ID for Check-In.`);
      navigate('/my-bookings');
    } catch (err) {
      setError(err.response?.data || 'Booking failed. Please try again.');
    } finally { setLoading(false); }
  };

  if (!flight) return null;

  return (
    <div className="page">
      <Navbar />
      <div className="content" style={{ maxWidth: '960px' }}>
        <div className="page-header">
          <div>
            <h1>Book Your Flight ✈️</h1>
            <p>{flight.flightNumber} — {flight.origin} → {flight.destination}</p>
          </div>
          <button className="btn btn-ghost" style={{ width: 'auto' }} onClick={() => navigate('/dashboard')}>← Back</button>
        </div>

        {/* Flight summary banner */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
          borderRadius: '14px', padding: '1.5rem 2rem', marginBottom: '1.5rem',
          display: 'flex', gap: '2.5rem', flexWrap: 'wrap', color: 'white'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 600, textTransform: 'uppercase' }}>Flight</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{flight.flightNumber}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 600, textTransform: 'uppercase' }}>Route</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{flight.origin} → {flight.destination}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 600, textTransform: 'uppercase' }}>Departure</div>
            <div style={{ fontWeight: 600 }}>{flight.departureTime?.substring(0, 16).replace('T', ' ')}</div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <div style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 600, textTransform: 'uppercase' }}>Total Fare</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>₦{flight.fare?.toLocaleString()}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">⚠️ {error}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Seat selection */}
            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Select Your Seat</h3>
              <div className="form-group">
                <label>Seat Class</label>
                <select value={seatClass} onChange={e => setSeatClass(e.target.value)}>
                  <option>ECONOMY</option><option>BUSINESS</option><option>FIRST</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem', fontSize: '0.8rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: 16, height: 16, background: '#eef2ff', border: '2px solid #c7d2fe', borderRadius: 4, display: 'inline-block' }} /> Available
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: 16, height: 16, background: '#fff0f0', border: '2px solid #fecaca', borderRadius: 4, display: 'inline-block' }} /> Taken
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: 16, height: 16, background: 'var(--success)', borderRadius: 4, display: 'inline-block' }} /> Selected
                </span>
              </div>

              <div className="seat-grid">
                {Array.from({ length: 60 }, (_, i) => i + 1).map(seat => (
                  <button type="button" key={seat}
                    className={`seat-btn ${takenSeats.includes(seat) ? 'seat-taken' : selectedSeat === seat ? 'seat-selected' : 'seat-available'}`}
                    disabled={takenSeats.includes(seat)}
                    onClick={() => setSelectedSeat(seat)}>
                    {seat}
                  </button>
                ))}
              </div>

              {selectedSeat && (
                <div className="alert alert-success" style={{ marginTop: '0.75rem' }}>
                  ✅ Seat {selectedSeat} ({seatClass}) selected
                </div>
              )}
            </div>

            {/* Payment */}
            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Payment Details</h3>
              <div className="alert alert-info">🔒 Your payment is secured and encrypted</div>

              <div className="form-group">
                <label>Card Number</label>
                <input placeholder="1234 5678 9012 3456" maxLength={16}
                  value={card.cardNumber} onChange={e => setCard({...card, cardNumber: e.target.value.replace(/\D/g, '')})} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input placeholder="MM/YY" value={card.expiry} onChange={e => setCard({...card, expiry: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input type="password" placeholder="•••" maxLength={3} value={card.cvv} onChange={e => setCard({...card, cvv: e.target.value})} required />
                </div>
              </div>

              <div className="divider" />

              <div style={{ background: 'var(--bg)', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-light)' }}>Flight fare</span>
                  <span>₦{flight.fare?.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-light)' }}>Seat ({seatClass})</span>
                  <span>Included</span>
                </div>
                <div className="divider" style={{ margin: '0.75rem 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem' }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--primary)' }}>₦{flight.fare?.toLocaleString()}</span>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? '⏳ Processing payment...' : `🔒 Confirm & Pay ₦${flight.fare?.toLocaleString()}`}
              </button>
              <button type="button" className="btn btn-ghost" style={{ marginTop: '0.75rem' }} onClick={() => navigate('/dashboard')}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
