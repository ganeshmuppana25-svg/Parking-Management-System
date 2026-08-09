import { useState } from 'react';
import { useLocation, Link, Navigate, useNavigate } from 'react-router-dom';
import {
  getReservationByTicketId,
  updateReservation,
  updateSlot,
  addSession,
  updateSession,
  getSessionByTicketId,
  addToHistory,
  generateTransactionId,
  formatCurrency,
  formatDuration,
} from '../utils/storage';
import { generateInvoiceId } from '../utils/pdfGenerator';
import { useToast } from '../context/ToastContext';

const PAYMENT_METHODS = [
  { id: 'upi', icon: '📱', label: 'UPI', description: 'Pay using any UPI app' },
  { id: 'card', icon: '💳', label: 'Credit / Debit Card', description: 'Visa, Mastercard, RuPay' },
  { id: 'cash', icon: '💵', label: 'Cash', description: 'Pay at the counter' },
];

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const ticketId = location.state?.ticketId;
  const totalAmount = location.state?.totalAmount;
  const reservation = ticketId ? getReservationByTicketId(ticketId) : null;

  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionData, setTransactionData] = useState(null);

  if (!reservation || reservation.status !== 'PAYMENT_PENDING') {
    return <Navigate to="/active" replace />;
  }

  const handlePay = () => {
    // Validate
    if (selectedMethod === 'upi' && !upiId.trim()) {
      toast.error('Please enter a UPI ID');
      return;
    }
    if (selectedMethod === 'card') {
      if (!cardNumber.trim() || cardNumber.replace(/\s/g, '').length < 16) {
        toast.error('Please enter a valid card number');
        return;
      }
      if (!cardExpiry.trim() || cardExpiry.length < 5) {
        toast.error('Please enter a valid expiry date');
        return;
      }
      if (!cardCvv.trim() || cardCvv.length < 3) {
        toast.error('Please enter a valid CVV');
        return;
      }
    }

    setProcessing(true);

    // Simulate processing
    setTimeout(() => {
      const txnId = generateTransactionId();
      const invoiceId = generateInvoiceId();
      const now = new Date().toISOString();
      const session = getSessionByTicketId(ticketId);

      const entryTime = session?.entryTime || reservation.entryTime;
      const exitTime = session?.exitTime || reservation.exitTime;
      const duration = formatDuration(entryTime, exitTime);

      // Update reservation
      updateReservation(ticketId, {
        status: 'COMPLETED',
        transactionId: txnId,
        invoiceId,
        paymentMethod: selectedMethod,
        paymentTime: now,
        totalPaid: totalAmount,
      });

      // Release slot
      updateSlot(reservation.slotId, { status: 'available' });

      // Update session
      if (session) {
        updateSession(ticketId, { status: 'COMPLETED' });
      }

      // Add to history
      addToHistory({
        ticketId: reservation.ticketId,
        slotId: reservation.slotId,
        section: reservation.section,
        vehicleNumber: reservation.vehicleNumber,
        vehicleType: reservation.vehicleType,
        entryTime,
        exitTime,
        duration,
        baseFee: reservation.totalFee,
        additionalCharges: 0,
        totalPaid: totalAmount,
        transactionId: txnId,
        invoiceId,
        paymentMethod: selectedMethod,
        paymentStatus: 'PAID',
        date: now,
      });

      setTransactionData({
        transactionId: txnId,
        invoiceId,
        amount: totalAmount,
        method: selectedMethod,
        time: now,
      });
      setProcessing(false);
      setPaymentSuccess(true);
      toast.success('Payment successful!');
    }, 2000);
  };

  if (processing) {
    return (
      <div style={{ maxWidth: 500, margin: '0 auto' }}>
        <div className="payment-card">
          <div className="payment-processing">
            <div className="payment-spinner" />
            <h2 style={{ marginBottom: 8 }}>Processing Payment...</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Please wait while we process your payment</p>
          </div>
        </div>
      </div>
    );
  }

  if (paymentSuccess && transactionData) {
    return (
      <div style={{ maxWidth: 500, margin: '0 auto' }}>
        <div className="payment-card">
          <div className="payment-success">
            <div className="payment-success-icon">✓</div>
            <h2>Payment Successful</h2>

            <div className="payment-success-details">
              <div className="ticket-row">
                <span className="ticket-label">Amount Paid</span>
                <span className="ticket-value" style={{ color: 'var(--green)', fontWeight: 700, fontSize: 18 }}>{formatCurrency(transactionData.amount)}</span>
              </div>
              <div className="ticket-row">
                <span className="ticket-label">Transaction ID</span>
                <span className="ticket-value" style={{ fontSize: 12 }}>{transactionData.transactionId}</span>
              </div>
              <div className="ticket-row">
                <span className="ticket-label">Payment Method</span>
                <span className="ticket-value">{transactionData.method.toUpperCase()}</span>
              </div>
              <div className="ticket-row">
                <span className="ticket-label">Status</span>
                <span className="ticket-value" style={{ color: 'var(--green)', fontWeight: 700 }}>✓ PAID</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/invoice" state={{ ticketId }} className="btn btn-primary btn-lg w-full">
                📄 Download Invoice PDF
              </Link>
              <Link to="/history" className="btn btn-outline btn-lg w-full">
                📋 View Parking History
              </Link>
              <Link to="/dashboard" className="btn btn-ghost btn-lg w-full">
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <div className="page-header text-center">
        <h1>💳 Payment</h1>
        <p>Complete your parking payment</p>
      </div>

      <div className="payment-card">
        {/* Amount */}
        <div className="payment-amount">
          <div className="label">Amount to Pay</div>
          <div className="amount">{formatCurrency(totalAmount)}</div>
        </div>

        {/* Payment Methods */}
        <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Select Payment Method
        </div>
        <div className="payment-methods">
          {PAYMENT_METHODS.map((m) => (
            <button
              key={m.id}
              className={`payment-method${selectedMethod === m.id ? ' selected' : ''}`}
              onClick={() => setSelectedMethod(m.id)}
            >
              <span className="payment-method-icon">{m.icon}</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 600 }}>{m.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.description}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Payment Fields */}
        {selectedMethod === 'upi' && (
          <div className="form-group">
            <label className="form-label" htmlFor="upiId">UPI ID</label>
            <input
              id="upiId"
              className="form-input"
              type="text"
              placeholder="yourname@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
          </div>
        )}

        {selectedMethod === 'card' && (
          <>
            <div className="form-group">
              <label className="form-label" htmlFor="cardNumber">Card Number</label>
              <input
                id="cardNumber"
                className="form-input"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                maxLength={19}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="cardExpiry">Expiry</label>
                <input
                  id="cardExpiry"
                  className="form-input"
                  type="text"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  maxLength={5}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="cardCvv">CVV</label>
                <input
                  id="cardCvv"
                  className="form-input"
                  type="password"
                  placeholder="•••"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                  maxLength={4}
                />
              </div>
            </div>
          </>
        )}

        {selectedMethod === 'cash' && (
          <div style={{ padding: '14px', background: 'var(--green-light)', borderRadius: 'var(--radius-sm)', fontSize: 14, color: 'var(--green)', marginBottom: 20, textAlign: 'center' }}>
            💵 Pay {formatCurrency(totalAmount)} at the parking counter
          </div>
        )}

        <button className="btn btn-primary btn-lg w-full" onClick={handlePay}>
          Pay {formatCurrency(totalAmount)}
        </button>

        <div style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>
          🔒 This is a demo payment. No real money is processed.
        </div>
      </div>
    </div>
  );
}