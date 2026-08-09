import { useLocation, Link, Navigate } from 'react-router-dom';
import { getReservationByTicketId, getSessionByTicketId, formatCurrency } from '../utils/storage';
import { generateInvoicePDF } from '../utils/pdfGenerator';
import { useToast } from '../context/ToastContext';

const VEHICLE_ICONS = { bike: '🏍️', car: '🚗', suv: '🚙' };
const VEHICLE_LABELS = { bike: 'Bike', car: 'Car', suv: 'SUV' };

export default function Invoice() {
  const location = useLocation();
  const toast = useToast();
  const ticketId = location.state?.ticketId;
  const reservation = ticketId ? getReservationByTicketId(ticketId) : null;
  const session = ticketId ? getSessionByTicketId(ticketId) : null;

  if (!reservation || reservation.status !== 'COMPLETED') {
    return <Navigate to="/active" replace />;
  }

  const handleDownload = () => {
    const result = generateInvoicePDF({
      invoiceId: reservation.invoiceId || 'INV-000000',
      transactionId: reservation.transactionId || 'TXN-PARK-000000',
      vehicleNumber: reservation.vehicleNumber,
      vehicleType: VEHICLE_LABELS[reservation.vehicleType],
      slotId: reservation.slotId,
      entryTime: reservation.entryTime,
      exitTime: reservation.exitTime,
      baseFee: reservation.totalFee || 0,
      additionalCharges: 0,
      totalPaid: reservation.totalPaid || 0,
      paymentMethod: reservation.paymentMethod || 'N/A',
      paymentTime: reservation.paymentTime || new Date().toISOString(),
    });

    if (result.success) {
      toast.success('Invoice PDF downloaded successfully!');
    } else {
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <div className="page-header text-center">
        <h1>📄 Invoice</h1>
        <p>Download your parking invoice</p>
      </div>

      <div className="card animate-in">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>PARKING MANAGEMENT SYSTEM</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Official Invoice</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Invoice ID</div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{reservation.invoiceId || 'N/A'}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Transaction ID</div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{reservation.transactionId || 'N/A'}</div>
          </div>
        </div>

        <div className="ticket-details" style={{ marginBottom: 20 }}>
          <div className="ticket-row">
            <span className="ticket-label">Vehicle</span>
            <span className="ticket-value">{VEHICLE_ICONS[reservation.vehicleType]} {reservation.vehicleNumber}</span>
          </div>
          <div className="ticket-row">
            <span className="ticket-label">Slot</span>
            <span className="ticket-value">{reservation.slotId}</span>
          </div>
          <div className="ticket-row">
            <span className="ticket-label">Payment Method</span>
            <span className="ticket-value">{(reservation.paymentMethod || 'N/A').toUpperCase()}</span>
          </div>
          <div className="ticket-row">
            <span className="ticket-label">Status</span>
            <span className="ticket-value" style={{ color: 'var(--green)', fontWeight: 700 }}>✓ PAID</span>
          </div>
          <div className="ticket-row">
            <span className="ticket-label">Amount Paid</span>
            <span className="ticket-value" style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 18 }}>{formatCurrency(reservation.totalPaid)}</span>
          </div>
        </div>

        <button className="btn btn-primary btn-lg w-full" onClick={handleDownload}>
          📥 Download Invoice PDF
        </button>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/history" className="btn btn-outline btn-lg">
          📋 View History
        </Link>
        <Link to="/dashboard" className="btn btn-ghost btn-lg">
          ← Dashboard
        </Link>
      </div>
    </div>
  );
}