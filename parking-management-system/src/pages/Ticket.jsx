import { useLocation, Link, Navigate } from 'react-router-dom';
import { getReservationByTicketId, formatDateTime, formatCurrency } from '../utils/storage';

const VEHICLE_ICONS = { bike: '🏍️', car: '🚗', suv: '🚙' };
const VEHICLE_LABELS = { bike: 'Bike', car: 'Car', suv: 'SUV' };

export default function Ticket() {
  const location = useLocation();
  const ticketId = location.state?.ticketId;
  const reservation = ticketId ? getReservationByTicketId(ticketId) : null;

  if (!reservation) {
    return <Navigate to="/slots" replace />;
  }

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <div className="page-header text-center">
        <h1>🅿️ Reservation Confirmed</h1>
        <p>Your parking ticket has been generated</p>
      </div>

      <div className="ticket animate-in">
        <div className="ticket-id">{reservation.ticketId}</div>
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>Parking Ticket</div>

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
            <span className="ticket-value">{reservation.slotId} (Section {reservation.section})</span>
          </div>
          <div className="ticket-row">
            <span className="ticket-label">Reservation Time</span>
            <span className="ticket-value">{formatDateTime(reservation.reservationTime)}</span>
          </div>
          <div className="ticket-row">
            <span className="ticket-label">Estimated Duration</span>
            <span className="ticket-value">{reservation.estimatedDuration} hour(s)</span>
          </div>
          <div className="ticket-row">
            <span className="ticket-label">Estimated Fee</span>
            <span className="ticket-value" style={{ color: 'var(--accent)', fontWeight: 700 }}>{formatCurrency(reservation.estimatedFee)}</span>
          </div>
          {reservation.customerName && (
            <div className="ticket-row">
              <span className="ticket-label">Customer Name</span>
              <span className="ticket-value">{reservation.customerName}</span>
            </div>
          )}
        </div>

        <div className="ticket-status status-reserved">
          🟡 RESERVED
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/active" className="btn btn-primary btn-lg">
          🚗 View Parking
        </Link>
        <Link to="/slots" className="btn btn-outline btn-lg">
          ← Back to Slots
        </Link>
      </div>
    </div>
  );
}