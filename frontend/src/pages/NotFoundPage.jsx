import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 100, color: 'var(--border)', lineHeight: 1 }}>404</div>
        <h2 style={{ fontSize: 22, marginBottom: 12 }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-3)', marginBottom: 24 }}>This page doesn't exist or has been moved.</p>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    </div>
  );
}
