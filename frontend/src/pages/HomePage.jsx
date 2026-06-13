import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

const MARQUEE_ITEMS = [
  'ESP32-S3', 'Arduino Uno R3', 'Raspberry Pi Pico W', 'Xilinx Artix-7',
  'MPU-6050 IMU', 'NEO-6M GPS', 'SIM800L GSM', 'ADS1115 ADC',
  'HC-05 Bluetooth', 'AD8232 ECG', 'MAX30100 SpO2', 'CP2102 USB-UART',
  'Digilent Basys 3', 'ESP32-WROOM', 'Arduino Nano', 'FPGA Dev Boards',
];

const COLLECTIONS = [
  { name: 'Microcontrollers', icon: '🔲', desc: 'ESP32, Arduino, Pico & more', q: 'Microcontrollers' },
  { name: 'FPGA Boards', icon: '⬡', desc: 'Xilinx Artix-7 platforms', q: 'FPGA Boards' },
  { name: 'Sensors', icon: '📡', desc: 'IMU, ADC, Bio-signals', q: 'Sensors' },
  { name: 'Communication', icon: '📶', desc: 'GPS, GSM, BT, USB-UART', q: 'Communication' },
];

const FEATURES = [
  { icon: '⚡', title: '24hr Dispatch', desc: 'All in-stock orders dispatched within 24 hours' },
  { icon: '🚚', title: 'Free Shipping', desc: 'Free delivery on orders above ₹2,000' },
  { icon: '🏛️', title: 'GeM Registered', desc: 'Official government supplier — trusted by institutions' },
  { icon: '🔧', title: 'Tech Support', desc: 'Engineer-backed product support for every order' },
];

const WHY_CARDS = [
  {
    icon: '📦',
    tag: 'Logistics',
    title: '24hr Dispatch, Every Time',
    desc: 'We know project deadlines don\'t wait. Every in-stock order leaves our Bengaluru warehouse within 24 hours — no exceptions, no excuses.',
    metric: '24hr',
    metricLabel: 'dispatch SLA',
    accent: '#e84c1e',
  },
  {
    icon: '✅',
    tag: 'Quality',
    title: '100% Genuine Components',
    desc: 'Every chip, board and module is sourced directly from authorised distributors. No grey-market parts, no counterfeits — ever.',
    metric: '100%',
    metricLabel: 'genuine parts',
    accent: '#1a7a4a',
  },
  {
    icon: '🏛️',
    tag: 'Trust',
    title: 'GeM Registered Supplier',
    desc: 'Officially listed on India\'s Government e-Marketplace. Colleges, research labs and PSUs can procure directly through GeM.',
    metric: 'GeM',
    metricLabel: 'certified',
    accent: '#1a5fa8',
  },
  {
    icon: '🔧',
    tag: 'Support',
    title: 'Real Engineer Support',
    desc: 'Got a pinout question? Stuck on an I²C issue? Our team speaks embedded systems — reach us before or after your order.',
    metric: 'Live',
    metricLabel: 'tech support',
    accent: '#d4880a',
  },
  {
    icon: '🚚',
    tag: 'Shipping',
    title: 'Free Shipping Above ₹2,000',
    desc: 'No surprise delivery fees on bigger orders. Flat ₹99 below the threshold. Pan-India delivery to your lab, home or institution.',
    metric: '₹0',
    metricLabel: 'above ₹2k',
    accent: '#7c3aed',
  },
  {
    icon: '🔄',
    tag: 'Returns',
    title: 'Hassle-Free 7-Day Returns',
    desc: 'Wrong part shipped or DOA on arrival? We make returns painless. Replacement or refund — your call, zero questions asked.',
    metric: '7 days',
    metricLabel: 'return window',
    accent: '#0891b2',
  },
];

const WORKFLOW_STEPS = [
  { step: '01', title: 'Browse & Filter', desc: 'Search by category, spec, or keyword. Filter by price, brand or collection.' },
  { step: '02', title: 'Add to Cart', desc: 'Add multiple components in one go. Cart persists across sessions.' },
  { step: '03', title: 'Checkout', desc: 'Deliver to your lab or home. GeM billing available for institutions.' },
  { step: '04', title: 'Pay Your Way', desc: 'UPI, PhonePe, Razorpay, Net Banking or Cash on Delivery.' },
  { step: '05', title: 'Track Live', desc: 'Real-time order tracking from dispatch to doorstep.' },
  { step: '06', title: 'Build', desc: 'Components arrive ready to use — no soldering prep required for modules.' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/products/featured').then(({ data }) => {
      setFeatured(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="home-page page-enter">
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-label">⬡ EEKAI Innovations · Bengaluru · GeM Certified</div>
            <h1 className="hero-title">
              Electronics for<br />
              <span className="hero-accent">Builders &</span><br />
              Engineers
            </h1>
            <p className="hero-desc">
              Dev boards, sensors, FPGA, communication modules — everything you need to build the future.
              Fast dispatch, genuine components, trusted by institutions across India.
            </p>
            <div className="hero-cta">
              <Link to="/shop" className="btn btn-primary btn-lg">Shop Now</Link>
              <Link to="/shop?collection=FPGA Boards" className="btn btn-outline btn-lg">FPGA Boards</Link>
            </div>
            <div className="hero-stats">
              <div><strong>15+</strong><span>Products</span></div>
              <div><strong>4</strong><span>Categories</span></div>
              <div><strong>24hr</strong><span>Dispatch</span></div>
              <div><strong>GeM</strong><span>Registered</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-img-grid">
              <img src="https://i.pinimg.com/736x/35/c7/4e/35c74e942afd68702639b32656f84d1a.jpg" alt="Electronics" />
              <img src="https://i.pinimg.com/736x/18/b0/14/18b014e30a64ec3eeb7c8c99f3ed3b5d.jpg" alt="Arduino" />
              <img src="https://i.pinimg.com/736x/dd/aa/44/ddaa44cdc83c2c6576f4f287cc86aaaf.jpg" alt="FPGA" />
              <img src="https://i.pinimg.com/736x/74/d2/37/74d237212eeef0707019f45316c6777e.jpg" alt="Sensor" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── MARQUEE ─── */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="marquee-item">
              <span className="marquee-dot">◆</span>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="features-bar">
        <div className="container">
          <div className="features-grid">
            {FEATURES.map(f => (
              <div key={f.title} className="feature-item">
                <span className="feature-icon">{f.icon}</span>
                <div>
                  <strong>{f.title}</strong>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-label">Product Categories</div>
            <h2>Shop by Category</h2>
          </div>
          <div className="collections-grid">
            {COLLECTIONS.map(c => (
              <Link key={c.name} to={`/shop?collection=${encodeURIComponent(c.q)}`} className="collection-card card">
                <div className="collection-image">
                  <img
                    src={
                      c.name === 'Microcontrollers' ? 'https://i.pinimg.com/736x/d6/36/2e/d6362ed53ff81e20e96db072c7c45d91.jpg' :
                      c.name === 'FPGA Boards' ? 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&q=80' :
                      c.name === 'Sensors' ? 'https://i.pinimg.com/736x/b7/03/0b/b7030b3afdcfd7a75086bb5cde436c40.jpg' :
                      'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=600&q=80'
                    }
                    alt={c.name}
                    loading="lazy"
                  />
                </div>
                <div className="collection-content">
                  <span className="coll-icon">{c.icon}</span>
                  <div className="collection-text">
                    <strong>{c.name}</strong>
                    <p>{c.desc}</p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 'auto', flexShrink: 0 }}>
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WHY CHOOSE BUILDRONICS (MOVED HERE)
      ══════════════════════════════════════════ */}
      <section className="why-section">

        {/* Subtle top noise texture */}
        <div className="why-noise" aria-hidden="true" />

        <div className="container">

          {/* Section heading - CENTERED */}
          <div className="why-heading why-heading--centered">
            <div className="why-heading-left">
              <span className="why-overline">
                <span className="why-overline-line" />
                Why Choose Buildronics
              </span>
              <h2 className="why-title">
                Tools Built for How<br />
                <span className="why-title-accent">Engineers Actually Work</span>
              </h2>
            </div>
          </div>

          {/* 6-card grid */}
          <div className="why-grid">
            {WHY_CARDS.map((card, i) => (
              <div
                key={card.title}
                className={`why-card ${i === 0 ? 'why-card--featured' : ''}`}
                style={{ '--card-accent': card.accent }}
              >
                {/* Top row: icon + tag */}
                <div className="why-card-top">
                  <div className="why-card-icon">{card.icon}</div>
                  <span className="why-card-tag">{card.tag}</span>
                </div>

                {/* Metric badge */}
                <div className="why-card-metric">
                  <strong>{card.metric}</strong>
                  <span>{card.metricLabel}</span>
                </div>

                {/* Text */}
                <h3 className="why-card-title">{card.title}</h3>
                <p className="why-card-desc">{card.desc}</p>

                {/* Bottom accent bar */}
                <div className="why-card-bar" />
              </div>
            ))}
          </div>

          {/* How it works — workflow strip */}
          <div className="workflow-wrap">
            <div className="workflow-header">
              <span className="why-overline">
                <span className="why-overline-line" />
                The Buildronics Flow
              </span>
              <h3 className="workflow-title">From Browse to Build in 6 Steps</h3>
            </div>
            <div className="workflow-steps">
              {WORKFLOW_STEPS.map((s, i) => (
                <div key={s.step} className="workflow-step">
                  <div className="ws-step-num">{s.step}</div>
                  {i < WORKFLOW_STEPS.length - 1 && (
                    <div className="ws-connector">
                      <div className="ws-connector-line" />
                      <svg className="ws-connector-arrow" width="10" height="10" viewBox="0 0 10 10">
                        <polyline points="2,2 8,5 2,8" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                  )}
                  <strong className="ws-title">{s.title}</strong>
                  <p className="ws-desc">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA row */}
          {/* <div className="why-cta-row">
            <div className="why-cta-text">
              <strong>Still deciding?</strong>
              <span>Browse our catalog — no account needed to explore.</span>
            </div>
            <div className="why-cta-buttons">
              <Link to="/shop" className="btn btn-primary">Browse Catalog →</Link>
              <Link to="/register" className="btn btn-outline">Create Free Account</Link>
            </div>
          </div> */}

        </div>
      </section>

      {/* Featured products */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-label">Handpicked</div>
              <h2>Featured Products</h2>
            </div>
            <Link to="/shop" className="btn btn-outline btn-sm">View All →</Link>
          </div>

          {loading ? (
            <div className="flex-center" style={{ height: 200 }}>
              <div className="spinner" style={{ width: 32, height: 32 }} />
            </div>
          ) : (
            <div className="grid-4">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── Promo Banner ── */}
      <section className="promo-banner">
        <div className="promo-ring promo-ring--1" />
        <div className="promo-ring promo-ring--2" />
        <div className="promo-ring promo-ring--3" />

        <div className="container">
          <div className="promo-inner">
            <div className="promo-copy">
              <div className="promo-badge">
                <span className="promo-badge-dot" />
                <span>EEKAI Innovations · GeM Certified</span>
              </div>
              <h2 className="promo-title">
                Ready to build<br />
                <em className="promo-title-accent">something great?</em>
              </h2>
              <p className="promo-desc">
                Browse dev boards, sensors, FPGA &amp; modules. Genuine components,
                fast dispatch — trusted by engineers across India.
              </p>
              <div className="promo-stats">
                <div className="promo-stat">
                  <strong>15+</strong>
                  <span>Products</span>
                </div>
                <div className="promo-stat-divider" />
                <div className="promo-stat">
                  <strong>24hr</strong>
                  <span>Dispatch</span>
                </div>
                <div className="promo-stat-divider" />
                <div className="promo-stat">
                  <strong>GeM</strong>
                  <span>Registered</span>
                </div>
              </div>
            </div>

            <div className="promo-actions">
              <Link to="/shop" className="btn promo-btn-primary">
                Browse Full Catalog
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
              <Link to="/shop?collection=FPGA+Boards" className="promo-btn-ghost">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="8" height="8" rx="1"/><rect x="14" y="2" width="8" height="8" rx="1"/>
                  <rect x="2" y="14" width="8" height="8" rx="1"/><rect x="14" y="14" width="8" height="8" rx="1"/>
                </svg>
                Explore FPGA Boards
              </Link>
              <div className="promo-trust">
                <div className="promo-trust-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3a8c66" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Free shipping above ₹2,000
                </div>
                <div className="promo-trust-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3a8c66" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Engineer-backed support
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}