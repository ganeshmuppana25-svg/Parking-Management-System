import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats, formatCurrency, formatTime, formatDate } from '../utils/storage';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    setStats(getDashboardStats());
  }, []);

  if (!stats) return null;

  const cards = [
    { icon: '🅿️', label: 'Total Slots', value: stats.totalSlots, color: 'var(--accent)', bg: 'var(--accent-light)' },
    { icon: '✅', label: 'Available', value: stats.available, color: 'var(--green)', bg: 'var(--green-light)' },
    { icon: '🟡', label: 'Reserved', value: stats.reserved, color: 'var(--yellow)', bg: 'var(--yellow-light)' },
    { icon: '🔴', label: 'Occupied', value: stats.occupied, color: 'var(--red)', bg: 'var(--red-light)' },
    { icon: '🚗', label: "Today's Parking", value: stats.todayParking, color: 'var(--cyan)', bg: 'rgba(6, 182, 212, 0.15)' },
    { icon: '💰', label: "Today's Revenue", value: formatCurrency(stats.todayRevenue), color: 'var(--green)', bg: 'var(--green-light)' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of your parking management system</p>
      </div>

      <div className="stats-grid">
        {cards.map((c, i) => (
          <div className="stat-card" key={i} style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="stat-card-icon" style={{ background: c.bg, color: c.color }}>
              {c.icon}
            </div>
            <div className="stat-card-value" style={{ color: c.color }}>{c.value}</div>
            <div className="stat-card-label">{c.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
        <div className="card animate-in">
          <div className="card-header">
            <h2 className="card-title">Recent Activity</h2>
            <Link to="/history" className="btn btn-sm btn-ghost">View All</Link>
          </div>
          {stats.recentActivity.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <h3>No Recent Activity</h3>
              <p>Parking sessions will appear here once you start using the system.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ticket</th>
                    <th>Vehicle</th>
                    <th>Duration</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentActivity.map((h, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600, fontSize: '12px' }}>{h.ticketId}</td>
                      <td>{h.vehicleNumber}</td>
                      <td>{h.duration}</td>
                      <td style={{ fontWeight: 600 }}>{formatCurrency(h.totalPaid)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card animate-in" style={{ animationDelay: '0.1s' }}>
          <div className="card-header">
            <h2 className="card-title">Quick Actions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to="/slots" className="btn btn-primary btn-lg w-full" style={{ justifyContent: 'flex-start' }}>
              🅿️ Find & Reserve Parking
            </Link>
            <Link to="/active" className="btn btn-outline btn-lg w-full" style={{ justifyContent: 'flex-start' }}>
              🚗 View Active Parking
            </Link>
            <Link to="/history" className="btn btn-outline btn-lg w-full" style={{ justifyContent: 'flex-start' }}>
              📋 Parking History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}