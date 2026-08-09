import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getReservations,
  getActiveReservations,
  updateReservation,
  updateSlot,
  addSession,
  updateSession,
  getActiveSessions,
  getSessionByTicketId,
  formatDateTime,
  formatCurrency,
  formatDuration,
  getSlots,
} from '../utils/storage';
import pricingData from '../data/parkingPricing.json';
import { useToast } from '../context/ToastContext';

const VEHICLE_ICONS = { bike: '🏍️', car: '🚗', suv: '🚙' };
const VEHICLE_LABELS = { bike: 'Bike', car: 'Car', suv: 'SUV' };

export default function ActiveParking() {
  const [activeList, setActiveList] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [tab, setTab] = useState('reserved');
  const navigate = useNavigate();
  const toast = useToast();

  const refresh = () => {
    setActiveList(getActiveReservations());
    setSessions(getActiveSessions());
  };

  useEffect(() => {
    refresh();
  }, []);

  const reservedItems = activeList.filter((r) => r.status === 'RESERVED');
  const occupiedItems = activeList.filter((r) => r.status === 'OCCUPIED');

  const handleCheckIn = (reservation) => {
    const now = new Date().toISOString();
    updateReservation(reservation.ticketId, { status: 'OCCUPIED', entryTime: now });
    updateSlot(reservation.slotId, { status: 'occupied' });

    addSession({
      ticketId: reservation.ticketId,
      slotId: reservation.slotId,
      section: reservation.section,
      vehicleNumber: reservation.vehicleNumber,
      vehicleType: reservation.vehicleType,
      entryTime: now,
      exitTime: null,
      status: 'OCCUPIED',
    });

    refresh();
    toast.success(`Vehicle checked in at slot ${reservation.slotId}!`);
  };

  const handleExit = (reservation) => {
    const session = getSessionByTicketId(reservation.ticketId);
    const entryTime = session?.entryTime || reservation.entryTime;
    const exitTime = new Date().toISOString();
    const duration = formatDuration(entryTime, exitTime);
    const diffMs = new Date(exitTime) - new Date(entryTime);
    const totalMinutes = Math.max(1, Math.floor(diffMs / 60000));
    const totalHours = Math.ceil(totalMinutes / 60);
    const ratePerHour = pricingData[reservation.vehicleType]?.ratePerHour || 30;
    const totalFee = totalHours * ratePerHour;

    updateReservation(reservation.ticketId, {
      status: 'PAYMENT_PENDING',
      exitTime,
      actualDuration: duration,
      totalFee,
    });
    updateSession(reservation.ticketId, { status: 'PAYMENT_PENDING', exitTime });

    refresh();
    toast.info('Vehicle exited. Proceeding to payment...');
    navigate('/bill', { state: { ticketId: reservation.ticketId } });
  };

  return (
    <div>
      <div className="page-header">
        <h1>Active Parking</h1>
        <p>Manage reservations, check-ins, and vehicle exits</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <button
          className={`btn ${tab === 'reserved' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setTab('reserved')}
        >
          🟡 Reserved ({reservedItems.length})
        </button>
        <button
          className={`btn ${tab === 'occupied' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setTab('occupied')}
        >
          🔴 Occupied ({occupiedItems.length})
        </button>
      </div>

      {/* Reserved Tab */}
      {tab === 'reserved' && (
        <div>
          {reservedItems.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <h3>No Reserved Slots</h3>
              <p>Reserve a parking slot to see it here.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
              {reservedItems.map((r) => (
                <div className="card animate-in" key={r.ticketId}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>TICKET ID</div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--accent)' }}>{r.ticketId}</div>
                    </div>
                    <span className="badge badge-reserved">RESERVED</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: 16, fontSize: 14 }}>
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Vehicle</div>
                      <div style={{ fontWeight: 600 }}>{r.vehicleNumber}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Slot</div>
                      <div style={{ fontWeight: 600 }}>{r.slotId}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Type</div>
                      <div style={{ fontWeight: 600 }}>{VEHICLE_ICONS[r.vehicleType]} {VEHICLE_LABELS[r.vehicleType]}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Reserved</div>
                      <div style={{ fontWeight: 600 }}>{formatDateTime(r.reservationTime)}</div>
                    </div>
                  </div>
                  <button className="btn btn-success w-full" onClick={() => handleCheckIn(r)}>
                    ✓ Check In Vehicle
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Occupied Tab */}
      {tab === 'occupied' && (
        <div>
          {occupiedItems.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🚗</div>
              <h3>No Active Parking</h3>
              <p>Check in a reserved vehicle to start a parking session.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
              {occupiedItems.map((r) => {
                const session = getSessionByTicketId(r.ticketId);
                const entryTime = session?.entryTime || r.entryTime;
                const now = new Date();
                const diffMs = now - new Date(entryTime);
                const totalMinutes = Math.max(0, Math.floor(diffMs / 60000));
                const hours = Math.floor(totalMinutes / 60);
                const minutes = totalMinutes % 60;
                const totalHours = Math.ceil(totalMinutes / 60) || 1;
                const ratePerHour = pricingData[r.vehicleType]?.ratePerHour || 30;
                const currentFee = totalHours * ratePerHour;

                return (
                  <div className="card animate-in" key={r.ticketId}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                      <div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>TICKET ID</div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--accent)' }}>{r.ticketId}</div>
                      </div>
                      <span className="badge badge-occupied">OCCUPIED</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: 16, fontSize: 14 }}>
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Vehicle</div>
                        <div style={{ fontWeight: 600 }}>{r.vehicleNumber}</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Slot</div>
                        <div style={{ fontWeight: 600 }}>{r.slotId}</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Entry Time</div>
                        <div style={{ fontWeight: 600 }}>{formatDateTime(entryTime)}</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Duration</div>
                        <div style={{ fontWeight: 600 }}>{hours}h {minutes}m</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', marginBottom: 16 }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Current Fee</span>
                      <span style={{ fontWeight: 700, color: 'var(--accent)', fontSize: 16 }}>{formatCurrency(currentFee)}</span>
                    </div>
                    <button className="btn btn-danger w-full" onClick={() => handleExit(r)}>
                      🚪 Exit Vehicle
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}