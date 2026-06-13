const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Get all products with filters
router.get('/', async (req, res) => {
  try {
    const { search, collection, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { vendor: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }
    if (collection) query.collection = collection;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortObj = {};
    if (sort === 'price_asc')  sortObj = { price: 1 };
    else if (sort === 'price_desc') sortObj = { price: -1 };
    else if (sort === 'rating')     sortObj = { rating: -1 };
    else if (sort === 'newest')     sortObj = { createdAt: -1 };
    else sortObj = { isFeatured: -1, createdAt: -1 };

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query).sort(sortObj).skip(skip).limit(Number(limit));

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get featured products
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true }).limit(8);
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get distinct collections
router.get('/collections', async (req, res) => {
  try {
    const collections = await Product.distinct('collection', { isActive: true });
    res.json(collections);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Add review (protected)
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const already = product.reviews.find(r => r.user.toString() === req.user._id.toString());
    if (already) return res.status(400).json({ message: 'Product already reviewed by you' });

    product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
    await product.save();
    res.status(201).json({ message: 'Review added' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/**
 * ─────────────────────────────────────────────
 * ADMIN — Create product
 *
 * Two ways to create with an image:
 *
 * OPTION A — JSON body with an image URL (external or already uploaded)
 *   POST /api/products
 *   Content-Type: application/json
 *   { "name": "...", "image": "https://... or /uploads/products/product-xxx.jpg", ... }
 *
 * OPTION B — multipart/form-data (upload image + fields in one request)
 *   POST /api/products/with-image
 *   form-data:  image (File) + all other fields as text
 * ─────────────────────────────────────────────
 */

// Admin: Create product (JSON body — image as URL string)
router.post('/', protect, admin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: Create product WITH image file upload in one request
router.post('/with-image', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };

    // Parse JSON arrays/booleans that come as strings in form-data
    if (data.features && typeof data.features === 'string') {
      try { data.features = JSON.parse(data.features); } catch { data.features = data.features.split('\n').filter(Boolean); }
    }
    if (data.tags && typeof data.tags === 'string') {
      try { data.tags = JSON.parse(data.tags); } catch { data.tags = data.tags.split(',').map(t => t.trim()).filter(Boolean); }
    }
    if (data.price)         data.price         = Number(data.price);
    if (data.comparePrice)  data.comparePrice  = Number(data.comparePrice);
    if (data.costPrice)     data.costPrice     = Number(data.costPrice);
    if (data.countInStock)  data.countInStock  = Number(data.countInStock);
    if (data.isFeatured !== undefined) data.isFeatured = data.isFeatured === 'true' || data.isFeatured === true;

    // If a file was uploaded, use its server path as the image
    if (req.file) {
      data.image = `/uploads/products/${req.file.filename}`;
    }

    const product = await Product.create(data);
    res.status(201).json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: Update product (JSON body)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: Update product image only
router.put('/:id/image', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image file provided' });
    const imageUrl = `/uploads/products/${req.file.filename}`;
    const product = await Product.findByIdAndUpdate(req.params.id, { image: imageUrl }, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Image updated', image: imageUrl, product });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: Delete product
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
