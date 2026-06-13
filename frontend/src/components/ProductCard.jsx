import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../utils/imageUrl';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const discount = product.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : 0;

  return (
    <div className="product-card card">
      <Link to={`/product/${product._id}`} className="product-image-wrap">
        <img
          src={getImageUrl(product.image, product.collection)}
          alt={product.name}
          loading="lazy"
          onError={e => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80';
          }}
        />
        {discount > 0 && <span className="discount-badge">-{discount}%</span>}
        {product.isFeatured && <span className="featured-badge">Featured</span>}
      </Link>

      <div className="product-card-body">
        <div className="product-meta">
          <span className="product-collection">{product.collection}</span>
          <span className="product-vendor mono">{product.vendor}</span>
        </div>

        <Link to={`/product/${product._id}`} className="product-name">
          {product.name}
        </Link>

        <div className="product-sku mono">SKU: {product.sku}</div>

        {product.rating > 0 && (
          <div className="product-rating">
            <div className="stars">
              {[1,2,3,4,5].map(s => (
                <svg key={s} width="12" height="12" viewBox="0 0 24 24"
                  fill={s <= Math.round(product.rating) ? '#f59e0b' : 'none'}
                  stroke="#f59e0b" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              ))}
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>({product.numReviews})</span>
          </div>
        )}

        <div className="product-price-row">
          <div>
            <span className="price">₹{product.price.toLocaleString('en-IN')}</span>
            {product.comparePrice && (
              <span className="price-compare"> ₹{product.comparePrice.toLocaleString('en-IN')}</span>
            )}
          </div>
          <button
            className="add-cart-btn"
            onClick={() => addToCart(product._id)}
            disabled={product.countInStock === 0}
            title="Add to cart"
          >
            {product.countInStock === 0 ? 'OOS' : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
