import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import OrderTracker from '../components/OrderTracker';
import toast from 'react-hot-toast';
import './OrderDetailPage.css';

const STATUS_COLORS = { pending:'badge-yellow', confirmed:'badge-blue', processing:'badge-blue', packed:'badge-blue', shipped:'badge-blue', out_for_delivery:'badge-blue', delivered:'badge-green', cancelled:'badge-red' };

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrder = () => API.get(`/orders/${id}`).then(({ data }) => { setOrder(data); setLoading(false); }).catch(() => setLoading(false));

  useEffect(() => { fetchOrder(); }, [id]);

  const cancelOrder = async () => {
    if (!window.confirm('Cancel this order?')) return;
    setCancelling(true);
    try {
      await API.put(`/orders/${id}/cancel`, { reason: 'Cancelled by customer' });
      toast.success('Order cancelled');
      fetchOrder();
    } catch (err) { toast.error(err.response?.data?.message || 'Cannot cancel'); }
    finally { setCancelling(false); }
  };

  if (loading) return <div className="flex-center" style={{ minHeight: 300 }}><div className="spinner" style={{ width: 36, height: 36 }} /></div>;
  if (!order) return <div className="container" style={{ padding: '60px 24px' }}><h2>Order not found</h2></div>;

  const canCancel = !['shipped','out_for_delivery','delivered','cancelled'].includes(order.orderStatus);

  return (
    <div className="order-detail-page page-enter">
      <div className="container">
        <div className="od-header">
          <button className="back-link" onClick={() => navigate('/orders')}>← My Orders</button>
          <div className="od-title-row">
            <div>
              <h1>Order <span className="mono">#{order.orderNumber}</span></h1>
              <p style={{ color:'var(--text-3)', fontSize:13, marginTop:4 }}>
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle:'long' })}
              </p>
            </div>
            <div className="od-actions">
              <span className={`badge ${STATUS_COLORS[order.orderStatus] || 'badge-gray'}`} style={{ fontSize:13, padding:'6px 14px' }}>
                {order.orderStatus?.replace(/_/g,' ').toUpperCase()}
              </span>
              {canCancel && (
                <button className="btn btn-outline btn-sm" onClick={cancelOrder} disabled={cancelling} style={{ color:'var(--accent)', borderColor:'var(--accent)' }}>
                  {cancelling ? 'Cancelling...' : 'Cancel Order'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="od-grid">
          {/* Left */}
          <div className="od-left">
            {/* Tracker */}
            <div className="card od-section">
              <h3>Order Tracking</h3>
              {order.trackingNumber && (
                <div className="tracking-number-display">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                  <span>Tracking No: </span><strong className="mono">{order.trackingNumber}</strong>
                </div>
              )}
              {order.estimatedDelivery && order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled' && (
                <p style={{ fontSize:13, color:'var(--text-3)', marginBottom:8 }}>
                  Estimated delivery: <strong>{new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { dateStyle:'medium' })}</strong>
                </p>
              )}
              <OrderTracker order={order} />
            </div>

            {/* Items */}
            <div className="card od-section">
              <h3>Items Ordered ({order.items?.length})</h3>
              <div className="od-items">
                {order.items?.map((item, i) => (
                  <div key={i} className="od-item">
                    <img src={item.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=80&q=80'} alt={item.name} />
                    <div className="od-item-info">
                      <p className="od-item-name">{item.name}</p>
                      <p className="mono" style={{ fontSize:11, color:'var(--text-3)' }}>SKU: {item.sku}</p>
                      <p style={{ fontSize:13, color:'var(--text-2)', marginTop:4 }}>Qty: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}</p>
                    </div>
                    <span className="od-item-total">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="od-right">
            {/* Payment */}
            <div className="card od-section">
              <h3>Payment</h3>
              <div className="info-rows">
                <div className="info-row"><span>Method</span><span style={{ textTransform:'capitalize' }}>{order.paymentMethod?.replace(/_/g,' ')}</span></div>
                <div className="info-row"><span>Status</span><span className={`badge ${order.isPaid ? 'badge-green' : 'badge-yellow'}`}>{order.isPaid ? 'Paid' : 'Pending'}</span></div>
                {order.isPaid && order.paidAt && <div className="info-row"><span>Paid on</span><span>{new Date(order.paidAt).toLocaleDateString('en-IN')}</span></div>}
                {order.paymentResult?.transactionId && <div className="info-row"><span>Txn ID</span><span className="mono" style={{ fontSize:11 }}>{order.paymentResult.transactionId}</span></div>}
              </div>
            </div>

            {/* Price breakdown */}
            <div className="card od-section">
              <h3>Price Breakdown</h3>
              <div className="info-rows">
                <div className="info-row"><span>Subtotal</span><span>₹{order.itemsTotal?.toLocaleString('en-IN')}</span></div>
                <div className="info-row"><span>Shipping</span><span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span></div>
                <hr className="divider" />
                <div className="info-row" style={{ fontWeight:700, fontSize:16 }}><span>Total</span><span>₹{order.totalPrice?.toLocaleString('en-IN')}</span></div>
              </div>
            </div>

            {/* Delivery address */}
            <div className="card od-section">
              <h3>Delivery Address</h3>
              <div className="address-block">
                <strong>{order.shippingAddress?.name}</strong>
                <p>{order.shippingAddress?.phone}</p>
                <p>{order.shippingAddress?.street}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                <p>PIN: {order.shippingAddress?.pincode}</p>
              </div>
            </div>

            {/* Need payment */}
            {!order.isPaid && order.orderStatus !== 'cancelled' && (
              <button className="btn btn-primary btn-lg" style={{ width:'100%' }} onClick={() => navigate(`/payment/${order._id}`)}>
                Complete Payment →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
