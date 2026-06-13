import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../utils/api';
import ProductCard from '../components/ProductCard';
import './ShopPage.css';

const SORT_OPTIONS = [
  { value: '', label: 'Recommended' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const search     = searchParams.get('search')     || '';
  const collection = searchParams.get('collection') || '';
  const sort       = searchParams.get('sort')       || '';
  const page       = parseInt(searchParams.get('page') || '1');
  const minPrice   = searchParams.get('minPrice')   || '';
  const maxPrice   = searchParams.get('maxPrice')   || '';

  useEffect(() => {
    API.get('/products/collections').then(({ data }) => setCollections(data));
  }, []);

  useEffect(() => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const params = new URLSearchParams();
    params.set('page', page);
    params.set('limit', 12);
    if (search)     params.set('search', search);
    if (collection) params.set('collection', collection);
    if (sort)       params.set('sort', sort);
    if (minPrice)   params.set('minPrice', minPrice);
    if (maxPrice)   params.set('maxPrice', maxPrice);

    API.get(`/products?${params}`).then(({ data }) => {
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [search, collection, sort, page, minPrice, maxPrice]);

  // Update a filter param and reset page to 1
  const updateFilter = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    p.delete('page'); // reset to page 1 on filter change
    setSearchParams(p);
  };

  // Go to a specific page — keep all other params intact
  const goToPage = (pageNum) => {
    const p = new URLSearchParams(searchParams);
    p.set('page', pageNum);
    setSearchParams(p);
  };

  // Quick price range — keep other params, reset page
  const applyPriceRange = (mn, mx) => {
    const p = new URLSearchParams(searchParams);
    p.set('minPrice', mn);
    p.set('maxPrice', mx);
    p.delete('page');
    setSearchParams(p);
  };

  return (
    <div className="shop-page page-enter">
      <div className="container">

        {/* ── Header ── */}
        <div className="shop-header">
          <div>
            <div className="section-label">Product Catalog</div>
            <h1>
              {collection ? collection : search ? `"${search}"` : 'All Products'}
            </h1>
            {!loading && (
              <span className="result-count">
                {total} product{total !== 1 ? 's' : ''} found
                {pages > 1 && ` — Page ${page} of ${pages}`}
              </span>
            )}
          </div>
          <select
            value={sort}
            onChange={e => updateFilter('sort', e.target.value)}
            className="sort-select"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="shop-layout">

          {/* ── Sidebar ── */}
          <aside className="shop-sidebar">
            <div className="sidebar-section">
              <h4>Category</h4>
              <button
                className={`filter-btn ${!collection ? 'active' : ''}`}
                onClick={() => updateFilter('collection', '')}
              >
                All Categories
              </button>
              {collections.map(c => (
                <button
                  key={c}
                  className={`filter-btn ${collection === c ? 'active' : ''}`}
                  onClick={() => updateFilter('collection', c)}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="sidebar-section">
              <h4>Price Range (₹)</h4>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={e => updateFilter('minPrice', e.target.value)}
                />
                <span>–</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={e => updateFilter('maxPrice', e.target.value)}
                />
              </div>
              <div className="quick-prices">
                {[[0,500],[500,1000],[1000,5000],[5000,20000]].map(([mn, mx]) => (
                  <button
                    key={`${mn}-${mx}`}
                    className={`filter-btn ${minPrice == mn && maxPrice == mx ? 'active' : ''}`}
                    onClick={() => applyPriceRange(mn, mx)}
                  >
                    ₹{mn}–₹{mx.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>

            {(collection || search || minPrice || maxPrice || sort) && (
              <button
                className="btn btn-outline btn-sm"
                style={{ width: '100%' }}
                onClick={() => setSearchParams({})}
              >
                Clear All Filters
              </button>
            )}
          </aside>

          {/* ── Products grid ── */}
          <div className="products-area">
            {loading ? (
              <div className="flex-center" style={{ height: 300 }}>
                <div className="spinner" style={{ width: 36, height: 36 }} />
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: 48 }}>📦</div>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map(p => <ProductCard key={p._id} product={p} />)}
                </div>

                {/* ── Pagination ── */}
                {pages > 1 && (
                  <div className="pagination">
                    {/* Prev button */}
                    <button
                      className="page-btn page-nav"
                      onClick={() => goToPage(page - 1)}
                      disabled={page === 1}
                    >
                      ‹
                    </button>

                    {/* Page numbers */}
                    {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        className={`page-btn ${p === page ? 'active' : ''}`}
                        onClick={() => goToPage(p)}
                      >
                        {p}
                      </button>
                    ))}

                    {/* Next button */}
                    <button
                      className="page-btn page-nav"
                      onClick={() => goToPage(page + 1)}
                      disabled={page === pages}
                    >
                      ›
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}