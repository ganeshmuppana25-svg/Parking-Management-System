import { useState, useEffect } from 'react';
import { getHistory, formatCurrency, formatDate, formatTime } from '../utils/storage';
import { generateInvoicePDF } from '../utils/pdfGenerator';
import { useToast } from '../context/ToastContext';

const VEHICLE_LABELS = { bike: 'Bike', car: 'Car', suv: 'SUV' };
const VEHICLE_ICONS = { bike: '🏍️', car: '🚗', suv: '🚙' };

export default function History() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const toast = useToast();

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const filtered = history.filter((h) => {
    if (filterType !== 'all' && h.vehicleType !== filterType) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        h.ticketId.toLowerCase().includes(s) ||
        h.vehicleNumber.toLowerCase().includes(s) ||
        h.slotId.toLowerCase().includes(s)
      );
    }
    return true;
  });

  const handleDownloadInvoice = (record) => {
    const result = generateInvoicePDF({
      invoiceId: record.invoiceId || 'INV-000000',
      transactionId: record.transactionId || 'TXN-PARK-000000',
      vehicleNumber: record.vehicleNumber,
      vehicleType: VEHICLE_LABELS[record.vehicleType],
      slotId: record.slotId,
      entryTime: record.entryTime,
      exitTime: record.exitTime,
      baseFee: record.baseFee || 0,
      additionalCharges: record.additionalCharges || 0,
      totalPaid: record.totalPaid || 0,
      paymentMethod: record.paymentMethod || 'N/A',
      paymentTime: record.date || new Date().toISOString(),
    });

    if (result.success) {
      toast.success('Invoice downloaded!');
    } else {
      toast.error('Failed to generate invoice');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Parking History</h1>
        <p>View all completed parking sessions and transactions</p>
      </div>

      {/* Search & Filter */}
      <div className="search-filter-bar">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by ticket, vehicle, or slot..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search history"
          />
        </div>
        <select
          className="filter-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          aria-label="Filter by vehicle type"
        >
          <option value="all">All Types</option>
          <option value="bike">Bike</option>
          <option value="car">Car</option>
          <option value="suv">SUV</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>No Parking History</h3>
          <p>Completed parking sessions will appear here.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="table-wrapper" style={{ display: 'none' }}>
            <table className="data-table history-table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Vehicle</th>
                  <th>Type</th>
                  <th>Slot</th>
                  <th>Date</th>
                  <th>Entry</th>
                  <th>Exit</th>
                  <th>Duration</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((h, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, fontSize: 12 }}>{h.ticketId}</td>
                    <td>{h.vehicleNumber}</td>
                    <td>{VEHICLE_ICONS[h.vehicleType]} {VEHICLE_LABELS[h.vehicleType]}</td>
                    <td>{h.slotId}</td>
                    <td>{formatDate(h.date)}</td>
                    <td>{formatTime(h.entryTime)}</td>
                    <td>{formatTime(h.exitTime)}</td>
                    <td>{h.duration}</td>
                    <td style={{ fontWeight: 700 }}>{formatCurrency(h.totalPaid)}</td>
                    <td><span className="badge badge-completed">PAID</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-sm btn-ghost" onClick={() => setSelectedRecord(h)}>Details</button>
                        <button className="btn btn-sm btn-primary" onClick={() => handleDownloadInvoice(h)}>PDF</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '12px' }}>
            {filtered.map((h, i) => (
              <div className="card animate-in" key={i} style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>TICKET</div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--accent)' }}>{h.ticketId}</div>
                  </div>
                  <span className="badge badge-completed">PAID</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 13, marginBottom: 12 }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Vehicle: </span>
                    <span style={{ fontWeight: 600 }}>{h.vehicleNumber}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Slot: </span>
                    <span style={{ fontWeight: 600 }}>{h.slotId}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Duration: </span>
                    <span style={{ fontWeight: 600 }}>{h.duration}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Amount: </span>
                    <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{formatCurrency(h.totalPaid)}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-sm btn-ghost" style={{ flex: 1 }} onClick={() => setSelectedRecord(h)}>View Details</button>
                  <button className="btn btn-sm btn-primary" style={{ flex: 1 }} onClick={() => handleDownloadInvoice(h)}>📥 Invoice</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Detail Modal */}
      {selectedRecord && (
        <div className="modal-overlay" onClick={() => setSelectedRecord(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Parking Details</h2>
              <button className="modal-close" onClick={() => setSelectedRecord(null)} aria-label="Close">✕</button>
            </div>
            <div className="modal-body">
              <div className="ticket-details">
                <div className="ticket-row">
                  <span className="ticket-label">Ticket ID</span>
                  <span className="ticket-value" style={{ color: 'var(--accent)' }}>{selectedRecord.ticketId}</span>
                </div>
                <div className="ticket-row">
                  <span className="ticket-label">Transaction ID</span>
                  <span className="ticket-value" style={{ fontSize: 12 }}>{selectedRecord.transactionId}</span>
                </div>
                <div className="ticket-row">
                  <span className="ticket-label">Vehicle</span>
                  <span className="ticket-value">{selectedRecord.vehicleNumber}</span>
                </div>
                <div className="ticket-row">
                  <span className="ticket-label">Type</span>
                  <span className="ticket-value">{VEHICLE_LABELS[selectedRecord.vehicleType]}</span>
                </div>
                <div className="ticket-row">
                  <span className="ticket-label">Slot</span>
                  <span className="ticket-value">{selectedRecord.slotId}</span>
                </div>
                <div className="ticket-row">
                  <span className="ticket-label">Date</span>
                  <span className="ticket-value">{formatDate(selectedRecord.date)}</span>
                </div>
                <div className="ticket-row">
                  <span className="ticket-label">Entry</span>
                  <span className="ticket-value">{formatTime(selectedRecord.entryTime)}</span>
                </div>
                <div className="ticket-row">
                  <span className="ticket-label">Exit</span>
                  <span className="ticket-value">{formatTime(selectedRecord.exitTime)}</span>
                </div>
                <div className="ticket-row">
                  <span className="ticket-label">Duration</span>
                  <span className="ticket-value" style={{ fontWeight: 700 }}>{selectedRecord.duration}</span>
                </div>
                <div className="ticket-row">
                  <span className="ticket-label">Amount Paid</span>
                  <span className="ticket-value" style={{ color: 'var(--green)', fontWeight: 700 }}>{formatCurrency(selectedRecord.totalPaid)}</span>
                </div>
                <div className="ticket-row">
                  <span className="ticket-label">Payment</span>
                  <span className="ticket-value">{(selectedRecord.paymentMethod || 'N/A').toUpperCase()}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setSelectedRecord(null)}>Close</button>
              <button className="btn btn-primary" onClick={() => { handleDownloadInvoice(selectedRecord); setSelectedRecord(null); }}>📥 Download Invoice</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}