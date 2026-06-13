import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CartPage.css';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shipping = cartTotal >= 2000 ? 0 : 99;
  const tax = Math.round(cartTotal * 0.18);
  const total = cartTotal + shipping;

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container page-enter" style={{ padding: '60px 24px' }}>
        <div className="empty-state">
          <div style={{ fontSize: 56 }}>🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some electronics to get started!</p>
          <Link to="/shop" className="btn btn-primary btn-lg" style={{ marginTop: 16 }}>Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page page-enter">
      <div className="container">
        <h1 className="cart-title">Shopping Cart <span className="cart-count-text">({cartCount} items)</span></h1>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {cart.items.map(item => {
              const p = item.product;
              if (!p) return null;
              return (
                <div key={item._id} className="cart-item card">
                  <img src={p.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&q=80'} alt={p.name} />
                  <div className="cart-item-details">
                    <Link to={`/product/${p._id}`} className="cart-item-name">{p.name}</Link>
                    <div className="cart-item-meta">
                      <span className="mono">{p.sku}</span>
                      <span style={{ color: 'var(--text-3)', fontSize: 13 }}>{p.vendor}</span>
                    </div>
                    <div className="cart-item-row">
                      <div className="qty-control">
                        <button onClick={() => updateQuantity(p._id, item.quantity - 1)}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(p._id, item.quantity + 1)}>+</button>
                      </div>
                      <span className="cart-item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      <button className="remove-btn" onClick={() => removeFromCart(p._id)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="cart-summary card">
            <h3>Order Summary</h3>
            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal ({cartCount} items)</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green' : ''}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              {cartTotal < 2000 && (
                <p className="free-ship-note">
                  Add ₹{(2000 - cartTotal).toLocaleString('en-IN')} more for free shipping
                </p>
              )}
              <hr className="divider" />
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{(cartTotal + shipping).toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="summary-badges">
              <span className="badge badge-green">✓ GeM Registered</span>
              <span className="badge badge-blue">✓ 24hr Dispatch</span>
            </div>
            <button
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              onClick={() => user ? navigate('/checkout') : navigate('/login')}
            >
              {user ? 'Proceed to Checkout →' : 'Login to Checkout'}
            </button>
            <Link to="/shop" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
