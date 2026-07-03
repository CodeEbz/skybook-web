import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getFlights, getOrigins, getDestinations } from '../api';

export default function Dashboard() {
  const [flights, setFlights] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [filters, setFilters] = useState({ origin: '', destination: '', date: '' });
  const navigate = useNavigate();
  const name = localStorage.getItem('name');

  useEffect(() => {
    getFlights().then(r => { setFlights(r.data); setFiltered(r.data); });
    getOrigins().then(r => setOrigins(r.data));
    getDestinations().then(r => setDestinations(r.data));
  }, []);

  const handleSearch = () => {
    const result = flights.filter(f =>
      (!filters.origin || f.origin === filters.origin) &&
      (!filters.destination || f.destination === filters.destination) &&
      (!filters.date || f.departureTime?.startsWith(filters.date))
    );
    setFiltered(result);
  };

  const handleReset = () => {
    setFilters({ origin: '', destination: '', date: '' });
    setFiltered(flights);
  };

  const handleBook = (flight) => {
    sessionStorage.setItem('selectedFlight', JSON.stringify(flight));
    navigate('/book');
  };

  const international = flights.filter(f => f.flightType === 'INTERNATIONAL').length;
  const available = flights.filter(f => f.availableSeats > 0).length;

  return (
    <div className="page">
      <Navbar />
      <div className="content">
        <div className="page-header">
          <div>
            <h1>Welcome back, {name?.split(' ')[0]} ✈️</h1>
            <p>Search and book your next flight</p>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-label">Total Flights</div>
            <div className="stat-value">{flights.length}</div>
          </div>
          <div className="stat-card accent">
            <div className="stat-label">International</div>
            <div className="stat-value">{international}</div>
          </div>
          <div className="stat-card success">
            <div className="stat-label">Available Now</div>
            <div className="stat-value">{available}</div>
          </div>
          <div className="stat-card danger">
            <div className="stat-label">Sold Out</div>
            <div className="stat-value">{flights.length - available}</div>
          </div>
        </div>

        <div className="search-bar">
          <div className="form-group">
            <label>From</label>
            <select value={filters.origin} onChange={e => setFilters({...filters, origin: e.target.value})}>
              <option value="">All Origins</option>
              {origins.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>To</label>
            <select value={filters.destination} onChange={e => setFilters({...filters, destination: e.target.value})}>
              <option value="">All Destinations</option>
              {destinations.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" value={filters.date} onChange={e => setFilters({...filters, date: e.target.value})} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
            <button className="btn btn-primary" style={{ width: 'auto' }} onClick={handleSearch}>Search</button>
            <button className="btn btn-ghost" style={{ width: 'auto' }} onClick={handleReset}>Reset</button>
          </div>
        </div>

        <div className="table-container desktop-view">
          <table>
            <thead>
              <tr>
                <th>Flight</th><th>Route</th><th>Departure</th>
                <th>Fare</th><th>Seats</th><th>Type</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-light)', padding: '2rem' }}>No flights found matching your search.</td></tr>
              ) : filtered.map(f => (
                <tr key={f.id}>
                  <td><span className="flight-number">{f.flightNumber}</span></td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{f.origin}</span>
                    <span style={{ color: 'var(--text-light)', margin: '0 0.5rem' }}>→</span>
                    <span style={{ fontWeight: 600 }}>{f.destination}</span>
                  </td>
                  <td style={{ color: 'var(--text-light)' }}>{f.departureTime?.substring(0, 16).replace('T', ' ')}</td>
                  <td><span className="fare-text">₦{f.fare?.toLocaleString()}</span></td>
                  <td>
                    <span style={{ fontWeight: 600, color: f.availableSeats === 0 ? 'var(--danger)' : 'var(--success)' }}>
                      {f.availableSeats}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${f.flightType?.toLowerCase()}`}>{f.flightType}</span>
                  </td>
                  <td>
                    <button className="btn btn-primary btn-sm" style={{ width: 'auto' }}
                      disabled={f.availableSeats === 0} onClick={() => handleBook(f)}>
                      {f.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile flight cards list */}
        <div className="mobile-cards-list mobile-view">
          {filtered.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: 'var(--text-light)', padding: '2rem' }}>
              No flights found matching your search.
            </div>
          ) : (
            filtered.map(f => (
              <div key={f.id} className="mobile-card">
                <div className="mobile-card-row">
                  <span className="flight-number">{f.flightNumber}</span>
                  <span className={`badge badge-${f.flightType?.toLowerCase()}`}>{f.flightType}</span>
                </div>
                <div className="mobile-card-row">
                  <div className="mobile-card-route">
                    <span>{f.origin}</span>
                    <span className="mobile-card-route-arrow">→</span>
                    <span>{f.destination}</span>
                  </div>
                  <span className="fare-text" style={{ fontSize: '1.25rem' }}>
                    ₦{f.fare?.toLocaleString()}
                  </span>
                </div>
                <div className="mobile-card-details">
                  <div className="mobile-card-detail-item">
                    <span className="mobile-card-label">Departure</span>
                    <span className="mobile-card-value">{f.departureTime?.substring(0, 16).replace('T', ' ')}</span>
                  </div>
                  <div className="mobile-card-detail-item">
                    <span className="mobile-card-label">Available Seats</span>
                    <span className="mobile-card-value" style={{ color: f.availableSeats === 0 ? 'var(--danger)' : 'var(--success)' }}>
                      {f.availableSeats}
                    </span>
                  </div>
                </div>
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%', marginTop: '0.25rem' }}
                  disabled={f.availableSeats === 0} 
                  onClick={() => handleBook(f)}
                >
                  {f.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
