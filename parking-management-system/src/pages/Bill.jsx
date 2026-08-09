import { useLocation, Link, Navigate } from 'react-router-dom';
import {
  getReservationByTicketId,
  getSessionByTicketId,
  formatDateTime,
  formatDuration,
  formatCurrency,
} from '../utils/storage';

const VEHICLE_ICONS = { bike: '🏍️', car: '🚗', suv: '🚙' };
const VEHICLE_LABELS = { bike: 'Bike', car: 'Car', suv: 'SUV' };

export default function Bill() {
  const location = useLocation();
  const ticketId = location.state?.ticketId;
  const reservation = ticketId ? getReservationByTicketId(ticketId) : null;
  const session = ticketId ? getSessionByTicketId(ticketId) : null;

  if (!reservation || reservation.status !== 'PAYMENT_PENDING') {
    return <Navigate to="/active" replace />;
  }

  const entryTime = session?.entryTime || reservation.entryTime;
  const exitTime = session?.exitTime || reservation.exitTime;
  const duration = formatDuration(entryTime, exitTime);
  const baseFee = reservation.totalFee || 0;
  const additionalCharges = 0;
  const totalAmount = baseFee + additionalCharges;

  return (
    <div style={{ maxWidth: 520, margin: '0 auto' }}>
      <div className="page-header text-center">
        <h1>🧾 Parking Bill</h1>
        <p>Review your parking charges before payment</p>
      </div>

      <div className="card animate-in">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>PARKING MANAGEMENT SYSTEM</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Invoice Summary</div>
        </div>

        {/* Ticket ID */}
        <div style={{ textAlign: 'center', padding: '10px', background: 'var(--accent-light)', borderRadius: 'var(--radius-sm)', marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Ticket ID</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)' }}>{reservation.ticketId}</div>
        </div>

        {/* Vehicle Details */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Vehicle Details</div>
          <div className="ticket-details">
            <div className="ticket-row">
              <span className="ticket-label">Vehicle Number</span>
              <span className="ticket-value">{reservation.vehicleNumber}</span>
            </div>
            <div className="ticket-row">
              <span className="ticket-label">Vehicle Type</span>
              <span className="ticket-value">{VEHICLE_ICONS[reservation.vehicleType]} {VEHICLE_LABELS[reservation.vehicleType]}</span>
            </div>
            <div className="ticket-row">
              <span className="ticket-label">Parking Slot</span>
              <span className="ticket-value">{reservation.slotId}</span>
            </div>
          </div>
        </div>

        {/* Parking Details */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Parking Details</div>
          <div className="ticket-details">
            <div className="ticket-row">
              <span className="ticket-label">Entry Time</span>
              <span className="ticket-value">{formatDateTime(entryTime)}</span>
            </div>
            <div className="ticket-row">
              <span className="ticket-label">Exit Time</span>
              <span className="ticket-value">{formatDateTime(exitTime)}</span>
            </div>
            <div className="ticket-row">
              <span className="ticket-label">Duration</span>
              <span className="ticket-value" style={{ fontWeight: 700 }}>{duration}</span>
            </div>
          </div>
        </div>

        {/* Billing */}
        <div style={{ padding: '16px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Base Parking Fee</span>
            <span style={{ fontWeight: 600 }}>{formatCurrency(baseFee)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-bottom', marginBottom: 8, fontSize: 14 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Additional Charges</span>
            <span style={{ fontWeight: 600 }}>{formatCurrency(additionalCharges)}</span>
          </div>
          <div style={{ borderTop: '2px solid var(--border-color)', paddingTop: 10, marginTop: 6, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700, fontSize: 16 }}>Total Amount</span>
            <span style={{ fontWeight: 800, fontSize: 22, color: 'var(--accent)' }}>{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/payment" state={{ ticketId, totalAmount }} className="btn btn-primary btn-lg">
          💳 Proceed to Payment
        </Link>
        <Link to="/active" className="btn btn-outline btn-lg">
          ← Back
        </Link>
      </div>
    </div>
  );
}