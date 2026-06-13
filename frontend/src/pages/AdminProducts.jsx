import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { getImageUrl } from '../utils/imageUrl';
import toast from 'react-hot-toast';
import './AdminPage.css';
import './AdminProducts.css';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [imageMode, setImageMode] = useState('url'); // 'url' | 'upload'
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImg, setUploadingImg] = useState(false);
  const fileRef = useRef();

  const [form, setForm] = useState({
    name: '', sku: '', vendor: '', collection: 'Microcontrollers',
    price: '', comparePrice: '', countInStock: '50',
    description: '', isFeatured: false, image: '',
    features: '', tags: '',
  });

  const fetchProducts = () => {
    setLoading(true);
    const params = search ? `?search=${search}&limit=50` : '?limit=50';
    API.get(`/products${params}`)
      .then(({ data }) => { setProducts(data.products); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, [search]);

  const resetForm = () => {
    setForm({ name:'', sku:'', vendor:'', collection:'Microcontrollers', price:'', comparePrice:'', countInStock:'50', description:'', isFeatured:false, image:'', features:'', tags:'' });
    setEditingId(null); setShowForm(false); setImagePreview(''); setImageMode('url');
  };

  const editProduct = (p) => {
    setForm({
      name: p.name, sku: p.sku, vendor: p.vendor, collection: p.collection,
      price: p.price, comparePrice: p.comparePrice || '', countInStock: p.countInStock,
      description: p.description, isFeatured: p.isFeatured || false, image: p.image || '',
      features: Array.isArray(p.features) ? p.features.join('\n') : '',
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : '',
    });
    setImagePreview(getImageUrl(p.image, p.collection));
    setImageMode(p.image?.startsWith('/uploads') ? 'upload' : 'url');
    setEditingId(p._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Upload image file first, get back the URL, then store in form
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImg(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await API.post('/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm(f => ({ ...f, image: data.imageUrl }));
      setImagePreview(data.fullUrl || `http://localhost:5000${data.imageUrl}`);
      toast.success('Image uploaded!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploadingImg(false);
    }
  };

  const handleUrlChange = (url) => {
    setForm(f => ({ ...f, image: url }));
    setImagePreview(url);
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        comparePrice: form.comparePrice ? Number(form.comparePrice) : undefined,
        countInStock: Number(form.countInStock),
        features: form.features ? form.features.split('\n').map(s => s.trim()).filter(Boolean) : [],
        tags: form.tags ? form.tags.split(',').map(s => s.trim()).filter(Boolean) : [],
      };

      if (editingId) {
        await API.put(`/products/${editingId}`, payload);
        toast.success('Product updated!');
      } else {
        await API.post('/products', payload);
        toast.success('Product created!');
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="admin-page page-enter">
      <div className="container">
        <div className="admin-header">
          <div>
            <div className="section-label">Admin Panel</div>
            <h1>Manage Products</h1>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/admin" className="btn btn-outline btn-sm">← Dashboard</Link>
            <button className="btn btn-primary btn-sm" onClick={() => { resetForm(); setShowForm(true); }}>+ Add Product</button>
          </div>
        </div>

        {/* ── PRODUCT FORM ── */}
        {showForm && (
          <div className="card admin-section product-form-card">
            <h3>{editingId ? '✏️ Edit Product' : '➕ Add New Product'}</h3>
            <form onSubmit={saveProduct} className="product-form">

              {/* Image section */}
              <div className="image-upload-section">
                <div className="image-preview-box">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview"
                      onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&q=80'; }} />
                  ) : (
                    <div className="no-image-placeholder">
                      <span>🖼️</span>
                      <p>No image</p>
                    </div>
                  )}
                </div>

                <div className="image-input-area">
                  <div className="image-mode-tabs">
                    <button type="button" className={`mode-tab ${imageMode === 'url' ? 'active' : ''}`} onClick={() => setImageMode('url')}>🔗 Image URL</button>
                    <button type="button" className={`mode-tab ${imageMode === 'upload' ? 'active' : ''}`} onClick={() => setImageMode('upload')}>📁 Upload File</button>
                  </div>

                  {imageMode === 'url' ? (
                    <div>
                      <label>Paste any image URL (Unsplash, CDN, etc.)</label>
                      <input
                        type="url"
                        value={form.image}
                        onChange={e => handleUrlChange(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-xxx?w=400"
                      />
                      <p className="field-hint">Works with Unsplash, imgur, your CDN, etc.</p>
                    </div>
                  ) : (
                    <div>
                      <label>Upload image from your computer (JPG, PNG, WebP — max 5MB)</label>
                      <div className="file-drop-zone" onClick={() => fileRef.current?.click()}>
                        {uploadingImg ? (
                          <><div className="spinner" style={{ width: 20, height: 20 }} /> Uploading...</>
                        ) : (
                          <>
                            <span style={{ fontSize: 28 }}>📤</span>
                            <p>Click to choose file</p>
                            <p className="field-hint">or drag & drop here</p>
                          </>
                        )}
                        <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                      </div>
                      {form.image && form.image.startsWith('/uploads') && (
                        <p className="upload-success-note">✅ Uploaded: <span className="mono">{form.image}</span></p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Product fields */}
              <div className="form-grid-2">
                <div className="form-group"><label>Product Name *</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required /></div>
                <div className="form-group"><label>SKU *</label><input value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} placeholder="EEKAI-MCU-XXXXX" required /></div>
                <div className="form-group"><label>Vendor</label><input value={form.vendor} onChange={e => setForm(f => ({ ...f, vendor: e.target.value }))} /></div>
                <div className="form-group">
                  <label>Collection</label>
                  <select value={form.collection} onChange={e => setForm(f => ({ ...f, collection: e.target.value }))}>
                    {['Microcontrollers', 'FPGA Boards', 'Sensors', 'Communication'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Price (₹) *</label><input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required /></div>
                <div className="form-group"><label>Compare Price (₹)</label><input type="number" value={form.comparePrice} onChange={e => setForm(f => ({ ...f, comparePrice: e.target.value }))} /></div>
                <div className="form-group"><label>Stock Count</label><input type="number" value={form.countInStock} onChange={e => setForm(f => ({ ...f, countInStock: e.target.value }))} /></div>
                <div className="form-group" style={{ alignSelf: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 0 }}>
                    <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} style={{ width: 'auto' }} />
                    Featured on Homepage
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Product description..." />
              </div>
              <div className="form-group">
                <label>Features (one per line)</label>
                <textarea value={form.features} onChange={e => setForm(f => ({ ...f, features: e.target.value }))} rows={4} placeholder={"Dual core @ 240MHz\nWiFi 4 + BLE 5.0\n8MB Flash"} />
              </div>
              <div className="form-group">
                <label>Tags (comma separated)</label>
                <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="ESP32, WiFi, IoT, microcontroller" />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn btn-primary" disabled={saving || uploadingImg}>
                  {saving ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
                </button>
                <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* ── SEARCH ── */}
        <div style={{ marginBottom: 16 }}>
          <input type="text" placeholder="🔍 Search products by name, SKU..." value={search}
            onChange={e => setSearch(e.target.value)} style={{ maxWidth: 360 }} />
        </div>

        {/* ── TABLE ── */}
        {loading ? (
          <div className="flex-center" style={{ height: 200 }}><div className="spinner" style={{ width: 32, height: 32 }} /></div>
        ) : (
          <div className="card" style={{ overflow: 'auto' }}>
            <table className="admin-table admin-table-full">
              <thead>
                <tr>
                  <th>Product</th><th>SKU</th><th>Collection</th>
                  <th>Price</th><th>Stock</th><th>Featured</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img
                          src={getImageUrl(p.image, p.collection)}
                          alt={p.name}
                          onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=60&q=80'; }}
                          style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)', flexShrink: 0 }}
                        />
                        <span style={{ fontSize: 13, fontWeight: 500, maxWidth: 200 }}>{p.name}</span>
                      </div>
                    </td>
                    <td><span className="mono" style={{ fontSize: 11 }}>{p.sku}</span></td>
                    <td style={{ fontSize: 13 }}>{p.collection}</td>
                    <td style={{ fontWeight: 700 }}>₹{p.price?.toLocaleString('en-IN')}</td>
                    <td>
                      <span className={`badge ${p.countInStock > 0 ? 'badge-green' : 'badge-red'}`}>
                        {p.countInStock > 0 ? `${p.countInStock} units` : 'Out of stock'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>{p.isFeatured ? '⭐' : '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <Link to={`/product/${p._id}`} className="btn btn-ghost btn-sm" style={{ fontSize: 11 }}>View</Link>
                        <button className="btn btn-outline btn-sm" style={{ fontSize: 11 }} onClick={() => editProduct(p)}>Edit</button>
                        <button className="btn btn-ghost btn-sm" style={{ fontSize: 11, color: 'var(--accent)' }} onClick={() => deleteProduct(p._id, p.name)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && (
              <div className="empty-state" style={{ padding: 40 }}>
                <p>No products found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
