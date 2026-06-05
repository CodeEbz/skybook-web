import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getFlights, addFlight, deleteFlight, getAllBookings, getAllUsers } from '../api';

export default function Admin() {
  const [tab, setTab] = useState('flights');
  const [flights, setFlights] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ flightNumber: '', origin: '', destination: '', departureTime: '', fare: '', availableSeats: '', flightType: 'LOCAL' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadFlights = () => getFlights().then(r => setFlights(r.data));

  useEffect(() => {
    loadFlights();
    getAllBookings().then(r => setBookings(r.data));
    getAllUsers().then(r => setUsers(r.data));
  }, []);

  const handleAddFlight = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await addFlight({ ...form, fare: parseFloat(form.fare), availableSeats: parseInt(form.availableSeats) });
      setSuccess(`✅ Flight ${form.flightNumber} added successfully!`);
      setForm({ flightNumber: '', origin: '', destination: '', departureTime: '', fare: '', availableSeats: '', flightType: 'LOCAL' });
      loadFlights();
    } catch (err) { setError(err.response?.data || 'Could not add flight.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this flight? This cannot be undone.')) return;
    try { await deleteFlight(id); loadFlights(); }
    catch { alert('Cannot delete — active bookings may be attached to this flight.'); }
  };

  return (
    <div className="page">
      <Navbar />
      <div className="content">
        <div className="page-header">
          <div>
            <h1>Admin Control Panel 🛡️</h1>
            <p>Manage flights, bookings and passengers</p>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-card"><div className="stat-label">Total Flights</div><div className="stat-value">{flights.length}</div></div>
          <div className="stat-card accent"><div className="stat-label">Total Bookings</div><div className="stat-value">{bookings.length}</div></div>
          <div className="stat-card success"><div className="stat-label">Registered Users</div><div className="stat-value">{users.length}</div></div>
          <div className="stat-card danger"><div className="stat-label">Cancelled</div><div className="stat-value">{bookings.filter(b => b.status === 'CANCELLED').length}</div></div>
        </div>

        <div className="tabs">
          {[['flights','✈️ Flights'], ['bookings','🎫 Bookings'], ['users','👥 Users']].map(([t, label]) => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{label}</button>
          ))}
        </div>

        {tab === 'flights' && (
          <>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1.25rem', fontWeight: 700 }}>Add New Flight</h3>
              {error && <div className="alert alert-error">⚠️ {error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              <form onSubmit={handleAddFlight}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                  {[['flightNumber','Flight Number','e.g. SB201'],['origin','Origin','e.g. Lagos'],['destination','Destination','e.g. London'],['fare','Fare (₦)','e.g. 500'],['availableSeats','Total Seats','e.g. 200']].map(([f, l, p]) => (
                    <div className="form-group" key={f} style={{ margin: 0 }}>
                      <label>{l}</label>
                      <input placeholder={p} value={form[f]} onChange={e => setForm({...form, [f]: e.target.value})} required />
                    </div>
                  ))}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Departure Time</label>
                    <input type="datetime-local" value={form.departureTime} onChange={e => setForm({...form, departureTime: e.target.value})} required />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Flight Type</label>
                    <select value={form.flightType} onChange={e => setForm({...form, flightType: e.target.value})}>
                      <option>LOCAL</option><option>INTERNATIONAL</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <button type="submit" className="btn btn-primary">Add Flight</button>
                  </div>
                </div>
              </form>
            </div>

            <div className="table-container">
              <table>
                <thead><tr><th>Flight</th><th>Route</th><th>Departure</th><th>Fare</th><th>Seats</th><th>Type</th><th>Action</th></tr></thead>
                <tbody>
                  {flights.map(f => (
                    <tr key={f.id}>
                      <td><span className="flight-number">{f.flightNumber}</span></td>
                      <td><b>{f.origin}</b> → <b>{f.destination}</b></td>
                      <td style={{ color: 'var(--text-light)' }}>{f.departureTime?.substring(0, 16).replace('T', ' ')}</td>
                      <td><span className="fare-text">₦{f.fare?.toLocaleString()}</span></td>
                      <td style={{ fontWeight: 600 }}>{f.availableSeats}</td>
                      <td><span className={`badge badge-${f.flightType?.toLowerCase()}`}>{f.flightType}</span></td>
                      <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(f.id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === 'bookings' && (
          <div className="table-container">
            <table>
              <thead><tr><th>ID</th><th>Passenger ID</th><th>Flight ID</th><th>Seat</th><th>Class</th><th>Booked On</th><th>Status</th></tr></thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td><span className="flight-number">#{b.id}</span></td>
                    <td>{b.passengerId}</td><td>{b.flightId}</td>
                    <td style={{ fontWeight: 600 }}>{b.seatNumber}</td><td>{b.seatClass}</td>
                    <td style={{ color: 'var(--text-light)' }}>{b.bookingTime?.substring(0, 16).replace('T', ' ')}</td>
                    <td><span className={`badge badge-${b.status?.toLowerCase()}`}>{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'users' && (
          <div className="table-container">
            <table>
              <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Role</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td style={{ fontWeight: 600 }}>{u.name}</td>
                    <td style={{ color: 'var(--text-light)' }}>{u.email}</td>
                    <td>{u.phoneNumber}</td>
                    <td><span className={`badge badge-${u.role?.toLowerCase()}`}>{u.role}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
