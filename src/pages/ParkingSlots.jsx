import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getSlots,
  updateSlot,
  addReservation,
  generateTicketId,
  formatCurrency,
} from '../utils/storage';
import pricingData from '../data/parkingPricing.json';
import { useToast } from '../context/ToastContext';

const VEHICLE_ICONS = { bike: '🏍️', car: '🚗', suv: '🚙' };
const VEHICLE_LABELS = { bike: 'Bike', car: 'Car', suv: 'SUV' };

export default function ParkingSlots() {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    vehicleType: 'car',
    duration: '1',
    customerName: '',
  });
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    setSlots(getSlots());
  }, []);

  const sections = ['A', 'B', 'C'];

  const filteredSlots = slots.filter((s) => {
    if (filterStatus !== 'all' && s.status !== filterStatus) return false;
    if (filterType !== 'all' && s.vehicleType !== filterType) return false;
    if (searchTerm && !s.id.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const estimatedFee = pricingData[formData.vehicleType]?.ratePerHour * Number(formData.duration) || 0;

  const handleSlotClick = (slot) => {
    if (slot.status !== 'available') {
      toast.warning(`Slot ${slot.id} is ${slot.status}`);
      return;
    }
    setSelectedSlot(slot);
    setFormData({
      vehicleNumber: '',
      vehicleType: slot.vehicleType === 'car' ? 'car' : slot.vehicleType,
      duration: '1',
      customerName: '',
    });
  };

  const handleReserve = () => {
    if (!formData.vehicleNumber.trim()) {
      toast.error('Please enter a vehicle number');
      return;
    }
    if (!/^[A-Za-z0-9]{5,15}$/.test(formData.vehicleNumber.replace(/\s/g, ''))) {
      toast.error('Enter a valid vehicle number (5-15 alphanumeric characters)');
      return;
    }

    const ticketId = generateTicketId();
    const now = new Date().toISOString();

    const reservation = {
      ticketId,
      slotId: selectedSlot.id,
      section: selectedSlot.section,
      vehicleNumber: formData.vehicleNumber.toUpperCase().trim(),
      vehicleType: formData.vehicleType,
      estimatedDuration: Number(formData.duration),
      estimatedFee,
      customerName: formData.customerName.trim(),
      reservationTime: now,
      entryTime: null,
      exitTime: null,
      status: 'RESERVED',
    };

    addReservation(reservation);
    updateSlot(selectedSlot.id, { status: 'reserved' });
    setSlots(getSlots());
    setSelectedSlot(null);

    toast.success(`Slot ${reservation.slotId} reserved successfully!`);
    navigate('/ticket', { state: { ticketId } });
  };

  return (
    <div>
      <div className="page-header">
        <h1>Parking Slots</h1>
        <p>Select an available slot to reserve your parking spot</p>
      </div>

      {/* Search & Filter */}
      <div className="search-filter-bar">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by slot ID (e.g. A1, B3)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search slots"
          />
        </div>
        <select
          className="filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="reserved">Reserved</option>
          <option value="occupied">Occupied</option>
        </select>
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

      {/* Legend */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--green)', display: 'inline-block' }} /> Available
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--yellow)', display: 'inline-block' }} /> Reserved
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--red)', display: 'inline-block' }} /> Occupied
        </span>
      </div>

      {/* Parking Grid */}
      {sections.map((sec) => {
        const sectionSlots = filteredSlots.filter((s) => s.section === sec);
        if (sectionSlots.length === 0) return null;
        const availCount = sectionSlots.filter((s) => s.status === 'available').length;
        return (
          <div className="parking-section animate-in" key={sec}>
            <div className="section-header">
              <div className="section-badge">{sec}</div>
              <span className="section-name">Section {sec}</span>
              <span className="section-count">{availCount}/{sectionSlots.length} available</span>
            </div>
            <div className="parking-grid">
              {sectionSlots.map((slot) => (
                <div
                  key={slot.id}
                  className={`parking-slot slot-${slot.status}`}
                  onClick={() => handleSlotClick(slot)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleSlotClick(slot)}
                  aria-label={`Slot ${slot.id}, ${slot.status}, ${VEHICLE_LABELS[slot.vehicleType]}`}
                >
                  <span className="slot-icon">{VEHICLE_ICONS[slot.vehicleType]}</span>
                  <span className="slot-id">{slot.id}</span>
                  <span className="slot-type">{VEHICLE_LABELS[slot.vehicleType]}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {filteredSlots.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No Slots Found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Reservation Modal */}
      {selectedSlot && (
        <div className="modal-overlay" onClick={() => setSelectedSlot(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Reserve Slot {selectedSlot.id}</h2>
              <button className="modal-close" onClick={() => setSelectedSlot(null)} aria-label="Close">✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 100, padding: '12px', background: 'var(--green-light)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: 4 }}>SLOT</div>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>{selectedSlot.id}</div>
                </div>
                <div style={{ flex: 1, minWidth: 100, padding: '12px', background: 'var(--accent-light)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: 4 }}>TYPE</div>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>{VEHICLE_ICONS[selectedSlot.vehicleType]} {VEHICLE_LABELS[selectedSlot.vehicleType]}</div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="vehicleNumber">Vehicle Number *</label>
                <input
                  id="vehicleNumber"
                  className="form-input"
                  type="text"
                  placeholder="e.g. MH12AB1234"
                  value={formData.vehicleNumber}
                  onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })}
                  maxLength={15}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="vehicleType">Vehicle Type</label>
                <select
                  id="vehicleType"
                  className="form-select"
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                >
                  <option value="bike">🏍️ Bike - ₹10/hr</option>
                  <option value="car">🚗 Car - ₹30/hr</option>
                  <option value="suv">🚙 SUV - ₹40/hr</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="duration">Estimated Duration (hours)</label>
                <select
                  id="duration"
                  className="form-select"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10, 12, 24].map((h) => (
                    <option key={h} value={h}>{h} hour{h > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="customerName">Customer Name (Optional)</label>
                <input
                  id="customerName"
                  className="form-input"
                  type="text"
                  placeholder="Your name"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                />
              </div>

              <div style={{ padding: '14px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 14 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Slot</span>
                  <span style={{ fontWeight: 600 }}>{selectedSlot.id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 14 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Vehicle Type</span>
                  <span style={{ fontWeight: 600 }}>{VEHICLE_LABELS[formData.vehicleType]}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 14 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Duration</span>
                  <span style={{ fontWeight: 600 }}>{formData.duration} hour(s)</span>
                </div>
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 8, marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600 }}>Estimated Fee</span>
                  <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--accent)' }}>{formatCurrency(estimatedFee)}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setSelectedSlot(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleReserve}>🅿️ Reserve Slot</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}