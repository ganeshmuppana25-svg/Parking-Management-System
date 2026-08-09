# 🅿️ Parking Management System

A modern, frontend-only Parking Management System built with React + Vite. Reserve parking slots, manage vehicle check-ins/outs, calculate fees, make simulated payments, and download PDF invoices.

## 🌟 Features

- **Dashboard** — Real-time overview of parking stats, availability, revenue
- **Parking Slot Visualization** — Interactive grid layout with 30 slots across 3 sections
- **Reservation System** — Select slots, enter vehicle details, get instant booking
- **Parking Ticket** — Professional ticket generation with unique IDs
- **Vehicle Check-In** — Confirm vehicle entry and start parking session
- **Active Parking** — Monitor live parking sessions with real-time duration & fee
- **Vehicle Exit** — Automatic duration and fee calculation
- **Pricing System** — JSON-based pricing for Bike (₹10/hr), Car (₹30/hr), SUV (₹40/hr)
- **Final Bill** — Detailed breakdown of parking charges
- **Simulated Payment** — Demo UPI, Card, and Cash payment options
- **PDF Invoice** — Download professional PDF invoice using jsPDF
- **Parking History** — View and search all completed sessions
- **Dark/Light Mode** — Polished theme toggle with localStorage persistence
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Search & Filter** — Search by ticket, vehicle number, or slot; filter by status and type

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI Library |
| Vite | Build Tool |
| React Router v7 | Client-side Routing |
| jsPDF | PDF Invoice Generation |
| localStorage | Data Persistence |
| CSS3 | Custom Design System |

## 🚀 How to Run Locally

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/parking-management-system.git

# Navigate to project directory
cd parking-management-system

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173/parking-management-system/](http://localhost:5173/parking-management-system/) in your browser.

## 📦 Build

```bash
npm run build
```

The production build will be in the `dist/` directory.

## 🌐 Deploy to GitHub Pages

1. Push your code to GitHub
2. Go to repository **Settings → Pages**
3. Set **Source** to **GitHub Actions**
4. Or run:

```bash
npm run build
npx gh-pages -d dist
```

The site will be live at: `https://YOUR_USERNAME.github.io/parking-management-system/`

## 📁 Project Structure

```
src/
├── components/
│   └── Navbar.jsx          # Navigation bar
├── context/
│   ├── ThemeContext.jsx     # Dark/Light mode context
│   ├── ToastContext.jsx     # Toast notification context
│   └── Toast.css           # Toast styles
├── data/
│   ├── parkingSlots.json   # Initial 30 parking slots
│   ├── parkingPricing.json # Pricing rates
│   └── demoVehicles.json   # Demo vehicle data
├── pages/
│   ├── Home.jsx            # Landing/Hero page
│   ├── Dashboard.jsx       # Stats dashboard
│   ├── ParkingSlots.jsx    # Slot grid + reservation form
│   ├── Ticket.jsx          # Reservation ticket view
│   ├── ActiveParking.jsx   # Reserved/occupied management
│   ├── Bill.jsx            # Final bill view
│   ├── Payment.jsx         # Simulated payment page
│   ├── Invoice.jsx         # Invoice download page
│   ├── History.jsx         # Parking history
│   └── About.jsx           # How it works page
├── utils/
│   ├── storage.js          # localStorage utility + helpers
│   └── pdfGenerator.js     # jsPDF invoice generator
├── App.jsx                 # Root component with routing
├── main.jsx                # Entry point
└── index.css               # Global styles + design system
```

## ⚠️ Project Limitations

- **Frontend-only** — No backend, database, or server
- **Simulated payments** — No real payment gateway integration
- **No authentication** — No user login or registration
- **localStorage** — Data is browser-specific and can be cleared
- **Demo purposes** — Built for college portfolio/demo use

## 📝 License

This project is open source and available for educational purposes.