import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import './OrdersPage.css';

const STATUS_COLORS = {
  pending: 'badge-yellow',
  confirmed: 'badge-blue',
  processing: 'badge-blue',
  packed: 'badge-blue',
  shipped: 'badge-blue',
  out_for_delivery: 'badge-blue',
  delivered: 'badge-green',
  cancelled: 'badge-red',
  returned: 'badge-gray',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/orders/my').then(({ data }) => { setOrders(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex-center" style={{ minHeight: 300 }}><div className="spinner" style={{ width: 36, height: 36 }} /></div>;

  return (
    <div className="orders-page page-enter">
      <div className="container">
        <h1>My Orders</h1>
        <p style={{ color: 'var(--text-3)', marginBottom: 28 }}>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 48 }}>📦</div>
            <h3>No orders yet</h3>
            <p>Your orders will appear here after purchase</p>
            <Link to="/shop" className="btn btn-primary" style={{ marginTop: 16 }}>Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card card">
                <div className="order-card-header">
                  <div>
                    <div className="section-label">Order Number</div>
                    <span className="order-number mono">#{order.orderNumber}</span>
                  </div>
                  <span className={`badge ${STATUS_COLORS[order.orderStatus] || 'badge-gray'}`}>
                    {order.orderStatus?.replace(/_/g, ' ').toUpperCase()}
                  </span>
                  <div className="hide-mobile">
                    <div className="section-label">Placed on</div>
                    <span style={{ fontSize: 13 }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                  </div>
                  <div>
                    <div className="section-label">Total</div>
                    <span style={{ fontSize: 16, fontWeight: 700 }}>₹{order.totalPrice?.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <div className="section-label">Payment</div>
                    <span className={`badge ${order.isPaid ? 'badge-green' : 'badge-yellow'}`}>
                      {order.isPaid ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                  <Link to={`/orders/${order._id}`} className="btn btn-outline btn-sm">View Details</Link>
                </div>

                <div className="order-items-preview">
                  {order.items?.slice(0, 3).map((item, i) => (
                    <div key={i} className="order-item-chip">
                      <img src={item.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=60&q=80'} alt={item.name} />
                      <div>
                        <p className="order-item-name">{item.name}</p>
                        <p className="mono" style={{ fontSize: 11, color: 'var(--text-3)' }}>Qty: {item.quantity} · ₹{item.price?.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                  {order.items?.length > 3 && (
                    <span style={{ fontSize: 12, color: 'var(--text-3)', alignSelf: 'center' }}>+{order.items.length - 3} more</span>
                  )}
                </div>

                {order.trackingNumber && (
                  <div className="tracking-chip">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                    <span className="mono" style={{ fontSize: 12 }}>Tracking: {order.trackingNumber}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
