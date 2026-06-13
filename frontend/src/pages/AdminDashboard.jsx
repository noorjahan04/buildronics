import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import './AdminPage.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/stats').then(({ data }) => { setStats(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex-center" style={{ minHeight: 300 }}><div className="spinner" style={{ width: 36, height: 36 }} /></div>;

  const STATUS_COLORS = { pending:'badge-yellow', confirmed:'badge-blue', processing:'badge-blue', packed:'badge-blue', shipped:'badge-blue', out_for_delivery:'badge-blue', delivered:'badge-green', cancelled:'badge-red' };

  return (
    <div className="admin-page page-enter">
      <div className="container">
        <div className="admin-header">
          <div>
            <div className="section-label">Admin Panel</div>
            <h1>Dashboard</h1>
          </div>
          <div className="admin-nav">
            <Link to="/admin/orders" className="btn btn-outline btn-sm">Manage Orders</Link>
            <Link to="/admin/products" className="btn btn-outline btn-sm">Manage Products</Link>
          </div>
        </div>

        <div className="stats-grid">
          {[
            { label: 'Total Revenue', value: `₹${stats?.totalRevenue?.toLocaleString('en-IN') || 0}`, icon: '💰', color: 'green' },
            { label: 'Total Orders', value: stats?.totalOrders || 0, icon: '📦', color: 'blue' },
            { label: 'Total Users', value: stats?.totalUsers || 0, icon: '👥', color: 'accent' },
            { label: 'Products', value: stats?.totalProducts || 0, icon: '🔧', color: 'yellow' },
          ].map(s => (
            <div key={s.label} className={`stat-card card stat-${s.color}`}>
              <span className="stat-icon">{s.icon}</span>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="admin-grid">
          <div className="card admin-section">
            <h3>Recent Orders</h3>
            <table className="admin-table">
              <thead><tr><th>Order #</th><th>Customer</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {stats?.recentOrders?.map(order => (
                  <tr key={order._id}>
                    <td><Link to={`/orders/${order._id}`} className="order-link mono">#{order.orderNumber}</Link></td>
                    <td>{order.user?.name || 'N/A'}</td>
                    <td>₹{order.totalPrice?.toLocaleString('en-IN')}</td>
                    <td><span className={`badge ${STATUS_COLORS[order.orderStatus] || 'badge-gray'}`}>{order.orderStatus?.replace(/_/g,' ')}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Link to="/admin/orders" className="btn btn-ghost btn-sm" style={{ marginTop: 12 }}>View All Orders →</Link>
          </div>

          <div className="card admin-section">
            <h3>Orders by Status</h3>
            <div className="status-breakdown">
              {stats?.ordersByStatus?.map(s => (
                <div key={s._id} className="status-row">
                  <span className={`badge ${STATUS_COLORS[s._id] || 'badge-gray'}`}>{s._id?.replace(/_/g,' ')}</span>
                  <span className="status-count">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
