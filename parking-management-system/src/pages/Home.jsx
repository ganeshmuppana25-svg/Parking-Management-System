import { Link } from 'react-router-dom';
import { getDashboardStats } from '../utils/storage';

export default function Home() {
  const stats = getDashboardStats();

  return (
    <div className="hero">
      <div className="hero-bg-grid" />
      <div className="hero-bg-glow" />
      <div className="hero-content">
        <div className="hero-badge">🅿️ Smart Parking Solution</div>
        <h1>
          Smart <span>Parking Management</span>
        </h1>
        <p>
          Reserve, manage and track your parking effortlessly. Real-time
          availability, instant reservations, and seamless payment experience.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/slots" className="btn btn-primary btn-lg">
            🅿️ Find Parking
          </Link>
          <Link to="/about" className="btn btn-outline btn-lg">
            Learn More →
          </Link>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-value">{stats.totalSlots}</div>
            <div className="hero-stat-label">Total Slots</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">{stats.available}</div>
            <div className="hero-stat-label">Available</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">{stats.occupied}</div>
            <div className="hero-stat-label">Occupied</div>
          </div>
        </div>
      </div>
    </div>
  );
}