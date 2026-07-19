import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getFlights, addFlight, deleteFlight, getAllBookings, getAllUsers } from '../api';

export default function Admin() {
  const parseLocation = (locStr) => {
    if (!locStr) return { city: '', code: '' };
    const match = locStr.match(/^(.*?)\s*\((.*?)\)$/);
    if (match) {
      return { city: match[1].trim(), code: match[2].trim() };
    }
    return { city: locStr, code: locStr.substring(0, 3).toUpperCase() };
  };

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
                <div className="admin-flight-form" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
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

            <div className="table-container desktop-view">
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

            {/* Mobile Flights list */}
            <div className="mobile-cards-list mobile-view">
              {flights.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', color: 'var(--text-light)', padding: '2rem' }}>No flights found.</div>
              ) : (
                flights.map(f => {
                  const originInfo = parseLocation(f.origin);
                  const destInfo = parseLocation(f.destination);
                  return (
                    <div key={f.id} className="mobile-flight-card">
                      <div className="card-header">
                        <span className="flight-code">✈️ {f.flightNumber}</span>
                        <span className={`badge badge-${f.flightType?.toLowerCase()}`}>{f.flightType}</span>
                      </div>
                      
                      <div className="card-route-timeline">
                        <div className="route-stop">
                          <span className="airport-code">{originInfo.code}</span>
                          <span className="airport-city">{originInfo.city}</span>
                        </div>
                        
                        <div className="timeline-connector">
                          <div className="connector-line"></div>
                          <span className="connector-plane">✈️</span>
                          <div className="connector-line"></div>
                        </div>

                        <div className="route-stop text-right">
                          <span className="airport-code">{destInfo.code}</span>
                          <span className="airport-city">{destInfo.city}</span>
                        </div>
                      </div>

                      <div className="card-details-row">
                        <div className="detail-pill">
                          <span className="pill-label">Departure</span>
                          <span className="pill-value">{f.departureTime?.substring(0, 16).replace('T', ' ')}</span>
                        </div>
                        <div className="detail-pill">
                          <span className="pill-label">Total Seats</span>
                          <span className="pill-value">{f.availableSeats}</span>
                        </div>
                      </div>

                      <div className="card-footer-row">
                        <div className="price-tag">
                          <span className="price-label">Fare</span>
                          <span className="price-value">₦{f.fare?.toLocaleString()}</span>
                        </div>
                        <button className="btn btn-danger book-btn" onClick={() => handleDelete(f.id)}>
                          Delete Flight
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {tab === 'bookings' && (
          <>
            <div className="table-container desktop-view">
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

            {/* Mobile Bookings list */}
            <div className="mobile-cards-list mobile-view">
              {bookings.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', color: 'var(--text-light)', padding: '2rem' }}>No bookings found.</div>
              ) : (
                bookings.map(b => (
                  <div key={b.id} className="mobile-card">
                    <div className="mobile-card-row">
                      <span className="flight-number">Booking #{b.id}</span>
                      <span className={`badge badge-${b.status?.toLowerCase()}`}>{b.status}</span>
                    </div>
                    <div className="mobile-card-details">
                      <div className="mobile-card-detail-item">
                        <span className="mobile-card-label">Passenger ID</span>
                        <span className="mobile-card-value">#{b.passengerId}</span>
                      </div>
                      <div className="mobile-card-detail-item">
                        <span className="mobile-card-label">Flight ID</span>
                        <span className="mobile-card-value">#{b.flightId}</span>
                      </div>
                      <div className="mobile-card-detail-item">
                        <span className="mobile-card-label">Seat</span>
                        <span className="mobile-card-value">{b.seatNumber}</span>
                      </div>
                      <div className="mobile-card-detail-item">
                        <span className="mobile-card-label">Class</span>
                        <span className="mobile-card-value">{b.seatClass}</span>
                      </div>
                      <div className="mobile-card-detail-item" style={{ gridColumn: 'span 2' }}>
                        <span className="mobile-card-label">Booked On</span>
                        <span className="mobile-card-value">{b.bookingTime?.substring(0, 16).replace('T', ' ')}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {tab === 'users' && (
          <>
            <div className="table-container desktop-view">
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

            {/* Mobile Users list */}
            <div className="mobile-cards-list mobile-view">
              {users.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', color: 'var(--text-light)', padding: '2rem' }}>No users registered.</div>
              ) : (
                users.map(u => (
                  <div key={u.id} className="mobile-card">
                    <div className="mobile-card-row">
                      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Passenger #{u.id}</span>
                      <span className={`badge badge-${u.role?.toLowerCase()}`}>{u.role}</span>
                    </div>
                    <div className="mobile-card-details">
                      <div className="mobile-card-detail-item" style={{ gridColumn: 'span 2' }}>
                        <span className="mobile-card-label">Name</span>
                        <span className="mobile-card-value">{u.name}</span>
                      </div>
                      <div className="mobile-card-detail-item" style={{ gridColumn: 'span 2' }}>
                        <span className="mobile-card-label">Email</span>
                        <span className="mobile-card-value" style={{ wordBreak: 'break-all' }}>{u.email}</span>
                      </div>
                      <div className="mobile-card-detail-item" style={{ gridColumn: 'span 2' }}>
                        <span className="mobile-card-label">Phone</span>
                        <span className="mobile-card-value">{u.phoneNumber}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
