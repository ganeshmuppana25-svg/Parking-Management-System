import { NavLink, Link } from 'react-router-dom';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/slots', label: 'Parking Slots' },
  { to: '/active', label: 'Active Parking' },
  { to: '/history', label: 'History' },
  { to: '/about', label: 'How It Works' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="nav-brand">
          <div className="nav-brand-icon">P</div>
          <span>ParkSmart</span>
        </Link>

        <div className="nav-links">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="nav-actions">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      <div className={`mobile-nav${mobileOpen ? ' open' : ''}`}>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            onClick={closeMobile}
          >
            {l.label}
          </NavLink>
        ))}
      </div>
    </>
  );
}