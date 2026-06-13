import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import toast from 'react-hot-toast';
import './AdminPage.css';

const STATUSES = ['pending','confirmed','processing','packed','shipped','out_for_delivery','delivered','cancelled'];
const STATUS_COLORS = { pending:'badge-yellow', confirmed:'badge-blue', processing:'badge-blue', packed:'badge-blue', shipped:'badge-blue', out_for_delivery:'badge-blue', delivered:'badge-green', cancelled:'badge-red' };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    const params = filterStatus ? `?status=${filterStatus}` : '';
    API.get(`/orders${params}`).then(({ data }) => { setOrders(data.orders); setTotal(data.total); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [filterStatus]);

  const updateStatus = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      await API.put(`/orders/${orderId}/status`, { status });
      toast.success(`Status updated to ${status}`);
      fetchOrders();
    } catch { toast.error('Failed to update'); }
    finally { setUpdatingId(null); }
  };

  return (
    <div className="admin-page page-enter">
      <div className="container">
        <div className="admin-header">
          <div>
            <div className="section-label">Admin Panel</div>
            <h1>Manage Orders <span style={{ fontSize: 16, color: 'var(--text-3)', fontWeight: 400 }}>({total})</span></h1>
          </div>
          <Link to="/admin" className="btn btn-outline btn-sm">← Dashboard</Link>
        </div>

        <div className="filter-bar">
          <button className={`filter-chip ${!filterStatus ? 'active' : ''}`} onClick={() => setFilterStatus('')}>All</button>
          {STATUSES.map(s => (
            <button key={s} className={`filter-chip ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)}>
              {s.replace(/_/g,' ')}
            </button>
          ))}
        </div>

        {loading ? <div className="flex-center" style={{ height: 200 }}><div className="spinner" style={{ width: 32, height: 32 }} /></div> : (
          <div className="card" style={{ overflow: 'hidden' }}>
            <table className="admin-table admin-table-full">
              <thead>
                <tr>
                  <th>Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Update Status</th><th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td><Link to={`/orders/${order._id}`} className="order-link mono">#{order.orderNumber}</Link></td>
                    <td>
                      <p style={{ fontWeight: 600, fontSize: 13 }}>{order.user?.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-3)' }}>{order.user?.email}</p>
                    </td>
                    <td style={{ fontSize: 13 }}>{order.items?.length} item(s)</td>
                    <td style={{ fontWeight: 700 }}>₹{order.totalPrice?.toLocaleString('en-IN')}</td>
                    <td><span className={`badge ${order.isPaid ? 'badge-green' : 'badge-yellow'}`}>{order.isPaid ? 'Paid' : 'Unpaid'}</span></td>
                    <td><span className={`badge ${STATUS_COLORS[order.orderStatus] || 'badge-gray'}`}>{order.orderStatus?.replace(/_/g,' ')}</span></td>
                    <td>
                      <select
                        value={order.orderStatus}
                        onChange={e => updateStatus(order._id, e.target.value)}
                        disabled={updatingId === order._id}
                        style={{ fontSize: 12, padding: '4px 8px' }}
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
                      </select>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
