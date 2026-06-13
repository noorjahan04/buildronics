const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  sku: { type: String, required: true, unique: true },
  vendor: { type: String, required: true },
  collection: { type: String, required: true },
  description: { type: String, required: true },
  features: [{ type: String }],
  price: { type: Number, required: true },
  comparePrice: { type: Number },
  costPrice: { type: Number },
  tags: [{ type: String }],
  images: [{ type: String }],
  image: { type: String, default: '' },
  countInStock: { type: Number, default: 50 },
  sellWhenOutOfStock: { type: Boolean, default: false },
  weight: { type: Number, default: 0.1 },
  countryOfOrigin: { type: String, default: 'China' },
  hsnCode: { type: String, default: '85340000' },
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  seoTitle: { type: String },
  seoDescription: { type: String }
}, { timestamps: true });

productSchema.pre('save', function(next) {
  if (this.reviews.length > 0) {
    this.rating = this.reviews.reduce((acc, r) => acc + r.rating, 0) / this.reviews.length;
    this.numReviews = this.reviews.length;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
