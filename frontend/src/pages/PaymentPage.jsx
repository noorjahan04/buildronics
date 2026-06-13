import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import toast from 'react-hot-toast';
import './PaymentPage.css';

export default function PaymentPage() {
  const { orderId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(state?.order || null);
  const [loading, setLoading] = useState(!state?.order);
  const [upiData, setUpiData] = useState(null);
  const [upiId, setUpiId] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    if (!order) {
      API.get(`/orders/${orderId}`).then(({ data }) => { setOrder(data); setLoading(false); });
    }
  }, [orderId]);

  useEffect(() => {
    if (order && (order.paymentMethod === 'phonepe' || order.paymentMethod === 'upi')) {
      initiateUPI();
    }
  }, [order]);

  const initiateUPI = async () => {
    try {
      const { data } = await API.post('/payment/phonepe/initiate', {
        amount: order.totalPrice,
        orderId: order._id
      });
      setUpiData(data);
    } catch {}
  };

  const confirmPayment = async (method) => {
    setVerifying(true);
    try {
      let res;
      if (method === 'phonepe' || method === 'upi') {
        res = await API.post('/payment/phonepe/status', {
          transactionId: upiData?.transactionId || `TXN${Date.now()}`,
          orderId: order._id
        });
      } else if (method === 'razorpay') {
        res = await API.post('/payment/razorpay/verify', {
          orderId: order._id,
          razorpay_payment_id: `pay_demo_${Date.now()}`,
          razorpay_order_id: `ord_demo_${Date.now()}`,
          razorpay_signature: 'demo_signature'
        });
      }
      if (res?.data?.success) {
        setPaid(true);
        toast.success('Payment successful! 🎉');
        setTimeout(() => navigate(`/orders/${order._id}`), 2000);
      }
    } catch (err) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  if (loading) return <div className="flex-center" style={{ minHeight: 400 }}><div className="spinner" style={{ width: 36, height: 36 }} /></div>;
  if (!order) return null;

  if (paid) return (
    <div className="payment-page page-enter">
      <div className="container">
        <div className="payment-success card">
          <div className="success-icon">✅</div>
          <h2>Payment Successful!</h2>
          <p>Your order <strong>#{order.orderNumber}</strong> has been confirmed.</p>
          <p style={{ color: 'var(--text-3)', fontSize: 13 }}>Redirecting to order details...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="payment-page page-enter">
      <div className="container">
        <h1>Complete Payment</h1>
        <p className="payment-subtitle">Order <span className="mono">#{order.orderNumber}</span> · ₹{order.totalPrice?.toLocaleString('en-IN')}</p>

        <div className="payment-layout">
          <div className="payment-card card">
            {/* PhonePe / UPI */}
            {(order.paymentMethod === 'phonepe' || order.paymentMethod === 'upi') && (
              <div className="payment-section">
                <div className="payment-method-header">
                  <span className="pm-icon-lg">📱</span>
                  <div>
                    <h3>PhonePe / UPI Payment</h3>
                    <p>Scan QR code or use UPI ID to pay</p>
                  </div>
                </div>

                {upiData && (
                  <div className="upi-section">
                    <div className="qr-wrap">
                      <img src={upiData.qrCode} alt="UPI QR Code" className="qr-code" />
                      <p>Scan with any UPI app</p>
                    </div>
                    <div className="upi-divider"><span>OR</span></div>
                    <div className="upi-id-section">
                      <div className="upi-id-display">
                        <span className="section-label">UPI ID</span>
                        <div className="upi-id-box mono">{upiData.upiId}</div>
                      </div>
                      <div className="upi-apps">
                        {['PhonePe', 'GPay', 'Paytm', 'BHIM'].map(app => (
                          <div key={app} className="upi-app-chip">{app}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="confirm-section">
                  <p style={{ fontSize: 13, color: 'var(--text-3)' }}>
                    After completing payment in your UPI app, click below to confirm
                  </p>
                  <button
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%' }}
                    onClick={() => confirmPayment(order.paymentMethod)}
                    disabled={verifying}
                  >
                    {verifying ? (
                      <><div className="spinner" style={{ width: 16, height: 16 }} /> Verifying Payment...</>
                    ) : 'I have completed payment'}
                  </button>
                </div>
              </div>
            )}

            {/* Razorpay */}
            {order.paymentMethod === 'razorpay' && (
              <div className="payment-section">
                <div className="payment-method-header">
                  <span className="pm-icon-lg">💳</span>
                  <div>
                    <h3>Razorpay Payment Gateway</h3>
                    <p>Cards, Net Banking, UPI via Razorpay</p>
                  </div>
                </div>
                <div className="razorpay-demo">
                  <div className="demo-notice">
                    <strong>🔒 Demo Mode</strong>
                    <p>In production, Razorpay checkout window opens automatically. Click below to simulate a successful payment.</p>
                  </div>
                  <div className="card-form-demo">
                    <div className="form-group">
                      <label>Card Number (Demo)</label>
                      <input value="4111 1111 1111 1111" readOnly style={{ fontFamily: 'monospace', letterSpacing: '0.1em' }} />
                    </div>
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>Expiry</label>
                        <input value="12/27" readOnly />
                      </div>
                      <div className="form-group">
                        <label>CVV</label>
                        <input value="123" readOnly />
                      </div>
                    </div>
                  </div>
                  <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => confirmPayment('razorpay')} disabled={verifying}>
                    {verifying ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Processing...</> : `Pay ₹${order.totalPrice?.toLocaleString('en-IN')}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className="card" style={{ padding: 20, alignSelf: 'flex-start' }}>
            <h3 style={{ fontSize: 16, marginBottom: 16 }}>Order Details</h3>
            <div className="order-detail-rows">
              <div className="od-row"><span>Order No.</span><span className="mono">#{order.orderNumber}</span></div>
              <div className="od-row"><span>Items</span><span>{order.items?.length}</span></div>
              <div className="od-row"><span>Shipping</span><span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span></div>
              <div className="od-row total-row"><span>Total</span><span>₹{order.totalPrice?.toLocaleString('en-IN')}</span></div>
            </div>
            <div style={{ marginTop: 16, padding: '12px', background: 'var(--bg-alt)', borderRadius: 6 }}>
              <p style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 600 }}>DELIVERING TO</p>
              <p style={{ fontSize: 13, marginTop: 4 }}>{order.shippingAddress?.name}</p>
              <p style={{ fontSize: 12, color: 'var(--text-2)' }}>{order.shippingAddress?.street}, {order.shippingAddress?.city}</p>
              <p style={{ fontSize: 12, color: 'var(--text-2)' }}>{order.shippingAddress?.state} — {order.shippingAddress?.pincode}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
