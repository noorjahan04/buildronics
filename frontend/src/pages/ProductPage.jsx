import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { getImageUrl } from '../utils/imageUrl';
import './ProductPage.css';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('features');
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    API.get(`/products/${id}`).then(({ data }) => {
      setProduct(data);
      setLoading(false);
    }).catch(() => { toast.error('Product not found'); navigate('/shop'); });
  }, [id]);

  const handleAddToCart = () => addToCart(product._id, qty);

  const handleBuyNow = async () => {
    if (!user) { toast.error('Please login first'); navigate('/login'); return; }
    await addToCart(product._id, qty);
    navigate('/cart');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to review'); return; }
    setSubmitting(true);
    try {
      await API.post(`/products/${id}/reviews`, review);
      toast.success('Review submitted!');
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);
      setReview({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const discount = product?.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100) : 0;

  if (loading) return (
    <div className="flex-center" style={{ minHeight: 400 }}>
      <div className="spinner" style={{ width: 40, height: 40 }} />
    </div>
  );

  if (!product) return null;

  return (
    <div className="product-page page-enter">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span onClick={() => navigate('/')} className="bc-link">Home</span>
          <span>/</span>
          <span onClick={() => navigate('/shop')} className="bc-link">Shop</span>
          <span>/</span>
          <span onClick={() => navigate(`/shop?collection=${product.collection}`)} className="bc-link">{product.collection}</span>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        <div className="product-layout">
          {/* Image */}
          <div className="product-image-section">
            <div className="product-main-image">
              <img src={getImageUrl(product.image, product.collection)} alt={product.name} onError={e => { e.target.onerror=null; e.target.src='https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80'; }} />
              {discount > 0 && <span className="img-discount-badge badge badge-red">-{discount}% OFF</span>}
            </div>
            <div className="product-tags">
              {product.tags?.slice(0, 6).map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          </div>

          {/* Details */}
          <div className="product-details">
            <div className="product-collection-badge badge badge-blue">{product.collection}</div>
            <h1 className="product-title">{product.name}</h1>

            <div className="product-meta-row">
              <span className="mono" style={{ color: 'var(--text-3)', fontSize: 12 }}>SKU: {product.sku}</span>
              <span className="mono" style={{ color: 'var(--text-3)', fontSize: 12 }}>by {product.vendor}</span>
              {product.numReviews > 0 && (
                <div className="stars" style={{ fontSize: 13 }}>
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill={s <= Math.round(product.rating) ? '#f59e0b' : 'none'} stroke="#f59e0b" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                  <span style={{ color: 'var(--text-3)' }}>({product.numReviews} reviews)</span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="product-price-section">
              <span className="price" style={{ fontSize: 28 }}>₹{product.price.toLocaleString('en-IN')}</span>
              {product.comparePrice && <>
                <span className="price-compare" style={{ fontSize: 16 }}>₹{product.comparePrice.toLocaleString('en-IN')}</span>
                <span className="price-discount badge badge-green">Save {discount}%</span>
              </>}
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>Inclusive of all taxes · Free shipping above ₹2,000</p>

            {/* Stock */}
            <div className={`stock-status ${product.countInStock > 0 ? 'in-stock' : 'out-stock'}`}>
              {product.countInStock > 0
                ? `✓ In Stock (${product.countInStock} units)`
                : '✗ Out of Stock'}
            </div>

            {/* Qty + CTA */}
            {product.countInStock > 0 && (
              <div className="buy-section">
                <div className="qty-control">
                  <button onClick={() => setQty(q => Math.max(1, q-1))}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.countInStock, q+1))}>+</button>
                </div>
                <button className="btn btn-primary btn-lg" onClick={handleAddToCart} style={{ flex: 1 }}>
                  Add to Cart
                </button>
                <button className="btn btn-outline btn-lg" onClick={handleBuyNow}>
                  Buy Now
                </button>
              </div>
            )}

            {/* Info chips */}
            <div className="product-chips">
              <div className="chip"><span>⚡</span><span>24hr Dispatch</span></div>
              <div className="chip"><span>🏛️</span><span>GeM Registered</span></div>
              <div className="chip"><span>📦</span><span>HSN: {product.hsnCode}</span></div>
              <div className="chip"><span>🌍</span><span>{product.countryOfOrigin}</span></div>
            </div>

            {/* Tabs */}
            <div className="product-tabs">
              <div className="tabs-header">
                {['features', 'description', 'reviews'].map(t => (
                  <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                    {t === 'reviews' && ` (${product.numReviews})`}
                  </button>
                ))}
              </div>

              {tab === 'features' && (
                <ul className="features-list">
                  {product.features?.map((f, i) => (
                    <li key={i}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
              )}

              {tab === 'description' && (
                <p className="product-description">{product.description}</p>
              )}

              {tab === 'reviews' && (
                <div className="reviews-section">
                  {product.reviews?.length === 0 && (
                    <p style={{ color: 'var(--text-3)', fontStyle: 'italic' }}>No reviews yet. Be the first!</p>
                  )}
                  {product.reviews?.map((r, i) => (
                    <div key={i} className="review-item">
                      <div className="review-header">
                        <span className="review-author">{r.name}</span>
                        <div className="stars">
                          {[1,2,3,4,5].map(s => (
                            <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill={s <= r.rating ? '#f59e0b' : 'none'} stroke="#f59e0b" strokeWidth="2">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                          ))}
                        </div>
                        <span className="mono" style={{ color: 'var(--text-3)', fontSize: 11 }}>
                          {new Date(r.createdAt).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                      <p className="review-comment">{r.comment}</p>
                    </div>
                  ))}

                  {user && (
                    <form className="review-form" onSubmit={submitReview}>
                      <h4>Write a Review</h4>
                      <div>
                        <label>Rating</label>
                        <select value={review.rating} onChange={e => setReview(r => ({ ...r, rating: Number(e.target.value) }))}>
                          {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>)}
                        </select>
                      </div>
                      <div>
                        <label>Comment</label>
                        <textarea value={review.comment} onChange={e => setReview(r => ({ ...r, comment: e.target.value }))} placeholder="Share your experience..." required />
                      </div>
                      <button type="submit" className="btn btn-primary" disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
