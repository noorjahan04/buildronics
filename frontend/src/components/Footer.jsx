import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <span style={{ color: 'var(--accent)', fontSize: '20px' }}>⬡</span>
              <span>BUILDRONICS</span>
            </div>
            <p>India's premier electronics component store for makers, engineers & students. GeM Registered Supplier.</p>
            <div className="footer-badges">
              <span className="f-badge">GeM Registered</span>
              <span className="f-badge">24hr Dispatch</span>
              <span className="f-badge">Free Ship ₹2000+</span>
            </div>
          </div>

          <div className="footer-col">
            <h4>Shop</h4>
            <Link to="/shop?collection=Microcontrollers">Microcontrollers</Link>
            <Link to="/shop?collection=FPGA Boards">FPGA Boards</Link>
            <Link to="/shop?collection=Sensors">Sensors</Link>
            <Link to="/shop?collection=Communication">Communication</Link>
            <Link to="/shop">All Products</Link>
          </div>

          <div className="footer-col">
            <h4>Account</h4>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Create Account</Link>
            <Link to="/orders">My Orders</Link>
            <Link to="/profile">Profile</Link>
          </div>

          <div className="footer-col">
            <h4>Info</h4>
            <p className="footer-info">EEKAI Innovations Pvt Ltd</p>
            <p className="footer-info">Bengaluru, Karnataka 560001</p>
            <p className="footer-info">support@buildronics.com</p>
            <p className="footer-info">GST: 29AABCE1234F1Z5</p>
            <p className="footer-info">HSN: 85340000</p>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="mono" style={{ color: 'var(--text-3)', fontSize: '12px' }}>
            © {new Date().getFullYear()} EEKAI Innovations Pvt Ltd — All rights reserved
          </span>
          <div className="payment-icons">
            <span>PhonePe</span>
            <span>Razorpay</span>
            <span>UPI</span>
            <span>COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
