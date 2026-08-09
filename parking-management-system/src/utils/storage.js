import parkingSlotsData from '../data/parkingSlots.json';

const KEYS = {
  SLOTS: 'pms_parking_slots',
  RESERVATIONS: 'pms_reservations',
  SESSIONS: 'pms_sessions',
  HISTORY: 'pms_history',
  THEME: 'pms_theme',
};

// Safely parse JSON from localStorage
function safeParse(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error('localStorage write failed for key:', key);
  }
}

// ---- Slots ----
export function getSlots() {
  let slots = safeParse(KEYS.SLOTS, null);
  if (!slots) {
    slots = parkingSlotsData.map((s) => ({ ...s }));
    safeSet(KEYS.SLOTS, slots);
  }
  return slots;
}

export function updateSlot(slotId, updates) {
  const slots = getSlots();
  const idx = slots.findIndex((s) => s.id === slotId);
  if (idx === -1) return null;
  slots[idx] = { ...slots[idx], ...updates };
  safeSet(KEYS.SLOTS, slots);
  return slots[idx];
}

export function resetSlots() {
  const slots = parkingSlotsData.map((s) => ({ ...s }));
  safeSet(KEYS.SLOTS, slots);
  return slots;
}

// ---- Reservations ----
export function getReservations() {
  return safeParse(KEYS.RESERVATIONS, []);
}

export function addReservation(reservation) {
  const list = getReservations();
  list.push(reservation);
  safeSet(KEYS.RESERVATIONS, list);
  return reservation;
}

export function updateReservation(ticketId, updates) {
  const list = getReservations();
  const idx = list.findIndex((r) => r.ticketId === ticketId);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...updates };
  safeSet(KEYS.RESERVATIONS, list);
  return list[idx];
}

export function getReservationByTicketId(ticketId) {
  return getReservations().find((r) => r.ticketId === ticketId) || null;
}

export function getActiveReservations() {
  return getReservations().filter(
    (r) => r.status === 'RESERVED' || r.status === 'OCCUPIED' || r.status === 'PAYMENT_PENDING'
  );
}

// ---- Sessions (active parking) ----
export function getSessions() {
  return safeParse(KEYS.SESSIONS, []);
}

export function addSession(session) {
  const list = getSessions();
  list.push(session);
  safeSet(KEYS.SESSIONS, list);
  return session;
}

export function updateSession(ticketId, updates) {
  const list = getSessions();
  const idx = list.findIndex((s) => s.ticketId === ticketId);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...updates };
  safeSet(KEYS.SESSIONS, list);
  return list[idx];
}

export function getActiveSessions() {
  return getSessions().filter((s) => s.status === 'OCCUPIED');
}

export function getSessionByTicketId(ticketId) {
  return getSessions().find((s) => s.ticketId === ticketId) || null;
}

// ---- History ----
export function getHistory() {
  return safeParse(KEYS.HISTORY, []);
}

export function addToHistory(record) {
  const list = getHistory();
  list.unshift(record); // newest first
  safeSet(KEYS.HISTORY, list);
  return record;
}

export function getHistoryByTicketId(ticketId) {
  return getHistory().find((h) => h.ticketId === ticketId) || null;
}

// ---- Theme ----
export function getTheme() {
  return safeParse(KEYS.THEME, 'dark');
}

export function setTheme(theme) {
  safeSet(KEYS.THEME, theme);
}

// ---- Ticket ID generator ----
export function generateTicketId() {
  const year = new Date().getFullYear();
  const existing = getReservations();
  const num = existing.length + 1;
  return `PARK-${year}-${String(num).padStart(5, '0')}`;
}

// ---- Transaction ID generator ----
export function generateTransactionId() {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `TXN-PARK-${num}`;
}

// ---- Dashboard stats ----
export function getDashboardStats() {
  const slots = getSlots();
  const history = getHistory();
  const sessions = getSessions();

  const totalSlots = slots.length;
  const available = slots.filter((s) => s.status === 'available').length;
  const reserved = slots.filter((s) => s.status === 'reserved').length;
  const occupied = slots.filter((s) => s.status === 'occupied').length;

  const today = new Date().toDateString();
  const todayHistory = history.filter(
    (h) => new Date(h.date || h.exitTime).toDateString() === today
  );
  const todayRevenue = todayHistory.reduce((sum, h) => sum + (h.totalPaid || 0), 0);

  return {
    totalSlots,
    available,
    reserved,
    occupied,
    todayParking: todayHistory.length,
    todayRevenue,
    recentActivity: history.slice(0, 5),
  };
}

// ---- Format helpers ----
export function formatCurrency(amount) {
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}

export function formatDuration(entryTime, exitTime) {
  const diff = new Date(exitTime) - new Date(entryTime);
  const totalMinutes = Math.max(1, Math.floor(diff / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatDateTime(dateStr) {
  return `${formatDate(dateStr)} ${formatTime(dateStr)}`;
}