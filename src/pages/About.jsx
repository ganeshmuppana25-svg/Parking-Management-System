export default function About() {
  const steps = [
    {
      num: 1,
      title: 'Find an Available Slot',
      desc: 'Browse the parking lot view and select an available slot from Section A, B, or C.',
    },
    {
      num: 2,
      title: 'Reserve the Slot',
      desc: 'Enter your vehicle number, select the vehicle type, and choose an estimated duration.',
    },
    {
      num: 3,
      title: 'Check In Your Vehicle',
      desc: 'When you arrive at the parking lot, check in your vehicle to start the parking session.',
    },
    {
      num: 4,
      title: 'Park Your Vehicle',
      desc: 'Drive to your reserved slot and park your vehicle safely.',
    },
    {
      num: 5,
      title: 'Exit When Finished',
      desc: 'When you\'re ready to leave, click "Exit Vehicle" from the Active Parking page.',
    },
    {
      num: 6,
      title: 'Review Your Final Bill',
      desc: 'Your parking duration and fee are calculated automatically based on actual usage.',
    },
    {
      num: 7,
      title: 'Complete Simulated Payment',
      desc: 'Pay using UPI, Card, or Cash. This is a demo — no real money is processed.',
    },
    {
      num: 8,
      title: 'Download Your Invoice',
      desc: 'Get a professional PDF invoice with all your parking and payment details.',
    },
  ];

  const pricing = [
    { type: '🏍️ Bike', rate: '₹10', desc: 'Per hour' },
    { type: '🚗 Car', rate: '₹30', desc: 'Per hour' },
    { type: '🚙 SUV', rate: '₹40', desc: 'Per hour' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>How It Works</h1>
        <p>A step-by-step guide to using the Parking Management System</p>
      </div>

      {/* Steps */}
      <div className="steps-grid mb-6">
        {steps.map((step) => (
          <div className="step-card animate-in" key={step.num} style={{ animationDelay: `${step.num * 0.05}s` }}>
            <div className="step-number">{step.num}</div>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </div>
        ))}
      </div>

      {/* Pricing */}
      <div className="card animate-in" style={{ animationDelay: '0.5s' }}>
        <div className="card-header">
          <h2 className="card-title">💰 Pricing</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
          {pricing.map((p, i) => (
            <div key={i} style={{ padding: '16px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{p.type.split(' ')[0]}</div>
              <div style={{ fontWeight: 700, fontSize: 24, color: 'var(--accent)' }}>{p.rate}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="card animate-in mt-4" style={{ animationDelay: '0.6s' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 24 }}>ℹ️</span>
          <div>
            <h3 style={{ fontSize: 16, marginBottom: 6 }}>Demo Application</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              This is a demonstration application built for educational and portfolio purposes.
              All payments are simulated — no real money is processed. No personal or financial
              data is collected or stored on any server. All data is stored locally in your browser
              using localStorage.
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="card animate-in mt-4" style={{ animationDelay: '0.7s' }}>
        <div className="card-header">
          <h2 className="card-title">🛠️ Technology Stack</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px', fontSize: 14 }}>
          <div style={{ padding: '10px 14px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
            <strong>React 19</strong> + Vite
          </div>
          <div style={{ padding: '10px 14px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
            <strong>React Router</strong> v7
          </div>
          <div style={{ padding: '10px 14px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
            <strong>jsPDF</strong> PDF Generation
          </div>
          <div style={{ padding: '10px 14px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
            <strong>localStorage</strong> Data Persistence
          </div>
          <div style={{ padding: '10px 14px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
            <strong>CSS</strong> Custom Design System
          </div>
          <div style={{ padding: '10px 14px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
            <strong>GitHub Pages</strong> Deployment
          </div>
        </div>
      </div>
    </div>
  );
}