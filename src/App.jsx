import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ParkingSlots from './pages/ParkingSlots';
import Ticket from './pages/Ticket';
import ActiveParking from './pages/ActiveParking';
import Bill from './pages/Bill';
import Payment from './pages/Payment';
import Invoice from './pages/Invoice';
import History from './pages/History';
import About from './pages/About';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <HashRouter>
          <div className="app-layout">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/slots" element={<ParkingSlots />} />
                <Route path="/ticket" element={<Ticket />} />
                <Route path="/active" element={<ActiveParking />} />
                <Route path="/bill" element={<Bill />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/invoice" element={<Invoice />} />
                <Route path="/history" element={<History />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </main>
          </div>
        </HashRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}