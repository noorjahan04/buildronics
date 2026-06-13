import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import toast from 'react-hot-toast';
import './CheckoutPage.css';

const PAYMENT_METHODS = [
  { id: 'phonepe', label: 'PhonePe / UPI', icon: '📱', desc: 'Pay via PhonePe, GPay, Paytm or any UPI app' },
  { id: 'razorpay', label: 'Razorpay', icon: '💳', desc: 'Credit / Debit card, Net Banking, UPI via Razorpay' },
  { id: 'upi', label: 'Direct UPI', icon: '⚡', desc: 'Enter UPI ID directly' },
  { id: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives' },
];

export default function CheckoutPage() {
  const { cart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1=address, 2=payment
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('phonepe');
  const [address, setAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || 'Karnataka',
    pincode: user?.address?.pincode || '',
  });

  const shipping = cartTotal >= 2000 ? 0 : 99;
  const total = cartTotal + shipping;

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const { name, phone, street, city, state, pincode } = address;
    if (!name || !phone || !street || !city || !pincode) {
      toast.error('Please fill all address fields');
      return;
    }
    setStep(2);
  };

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const items = cart.items.map(i => ({
        product: i.product._id,
        name: i.product.name,
        image: i.product.image,
        price: i.price,
        quantity: i.quantity,
        sku: i.product.sku,
      }));

      const { data: order } = await API.post('/orders', {
        items,
        shippingAddress: address,
        paymentMethod,
        itemsTotal: cartTotal,
        shippingPrice: shipping,
        totalPrice: total,
      });

      // For COD, confirm immediately
      if (paymentMethod === 'cod') {
        await API.post('/payment/cod/confirm', { orderId: order._id });
        toast.success('Order placed! Pay on delivery.');
        navigate(`/orders/${order._id}`);
      } else {
        // Go to payment page
        navigate(`/payment/${order._id}`, { state: { order, paymentMethod } });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="checkout-page page-enter">
      <div className="container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <div className="checkout-steps">
            <div className={`checkout-step ${step >= 1 ? 'active' : ''}`}>
              <span>1</span> Delivery Address
            </div>
            <div className="step-arrow">→</div>
            <div className={`checkout-step ${step >= 2 ? 'active' : ''}`}>
              <span>2</span> Payment
            </div>
          </div>
        </div>

        <div className="checkout-layout">
          <div className="checkout-main">
            {/* Step 1: Address */}
            {step === 1 && (
              <form className="card checkout-card" onSubmit={handleAddressSubmit}>
                <h3>📍 Delivery Address</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input value={address.name} onChange={e => setAddress(a => ({ ...a, name: e.target.value }))} placeholder="Your full name" required />
                  </div>
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input value={address.phone} onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))} placeholder="10-digit mobile number" required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Street Address *</label>
                  <input value={address.street} onChange={e => setAddress(a => ({ ...a, street: e.target.value }))} placeholder="House/Flat No., Street, Area" required />
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>City *</label>
                    <input value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} placeholder="City" required />
                  </div>
                  <div className="form-group">
                    <label>State *</label>
                    <select value={address.state} onChange={e => setAddress(a => ({ ...a, state: e.target.value }))}>
                      {['Karnataka','Maharashtra','Tamil Nadu','Telangana','Kerala','Andhra Pradesh','Gujarat','Rajasthan','Delhi','West Bengal','Uttar Pradesh','Other'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Pincode *</label>
                    <input value={address.pincode} onChange={e => setAddress(a => ({ ...a, pincode: e.target.value }))} placeholder="6-digit pincode" maxLength={6} required />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-lg">Continue to Payment →</button>
              </form>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="card checkout-card">
                <div className="back-btn" onClick={() => setStep(1)}>
                  ← Back to Address
                </div>
                <h3>💳 Payment Method</h3>
                <div className="payment-methods">
                  {PAYMENT_METHODS.map(pm => (
                    <label key={pm.id} className={`payment-option ${paymentMethod === pm.id ? 'selected' : ''}`}>
                      <input type="radio" name="payment" value={pm.id} checked={paymentMethod === pm.id} onChange={() => setPaymentMethod(pm.id)} />
                      <span className="pm-icon">{pm.icon}</span>
                      <div>
                        <strong>{pm.label}</strong>
                        <p>{pm.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="delivery-address-review">
                  <div className="section-label">Delivering to</div>
                  <p><strong>{address.name}</strong> · {address.phone}</p>
                  <p style={{ color: 'var(--text-2)', fontSize: 13 }}>{address.street}, {address.city}, {address.state} — {address.pincode}</p>
                </div>

                <button
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                  onClick={placeOrder}
                  disabled={placing}
                >
                  {placing ? 'Placing Order...' : paymentMethod === 'cod' ? 'Place COD Order' : `Proceed to Pay ₹${total.toLocaleString('en-IN')}`}
                </button>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div className="order-summary-side card">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {cart.items.map(item => (
                <div key={item._id} className="summary-item">
                  <img src={item.product?.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=60&q=80'} alt={item.product?.name} />
                  <div>
                    <p className="summary-item-name">{item.product?.name}</p>
                    <p className="mono" style={{ fontSize: 11, color: 'var(--text-3)' }}>Qty: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}</p>
                  </div>
                  <span className="summary-item-total">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            <div className="summary-totals">
              <div className="summary-row"><span>Subtotal</span><span>₹{cartTotal.toLocaleString('en-IN')}</span></div>
              <div className="summary-row"><span>Shipping</span><span className={shipping === 0 ? 'text-green' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
              <hr className="divider" />
              <div className="summary-row" style={{ fontWeight: 700, fontSize: 16 }}>
                <span>Total</span><span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
