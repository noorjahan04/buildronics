const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  sku: { type: String }
});

const trackingEventSchema = new mongoose.Schema({
  status: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, default: 'Bengaluru, Karnataka' },
  timestamp: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: { type: String, unique: true },
  items: [orderItemSchema],
  shippingAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  paymentMethod: {
    type: String,
    enum: ['phonepe', 'razorpay', 'cod', 'upi'],
    required: true
  },
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    transactionId: String
  },
  itemsTotal: { type: Number, required: true },
  shippingPrice: { type: Number, default: 0 },
  taxPrice: { type: Number, default: 0 },
  totalPrice: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  trackingNumber: { type: String, default: '' },
  trackingEvents: [trackingEventSchema],
  estimatedDelivery: { type: Date },
  deliveredAt: { type: Date },
  cancelledAt: { type: Date },
  cancellationReason: { type: String },
  notes: { type: String }
}, { timestamps: true });

// Auto-generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    const date = new Date();
    this.orderNumber = `BLD${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}${String(count+1).padStart(4,'0')}`;
  }
  // Auto-generate tracking number
  if (!this.trackingNumber && this.orderStatus === 'shipped') {
    this.trackingNumber = `BLDTRK${Date.now()}`;
  }
  // Set estimated delivery (3-5 business days)
  if (!this.estimatedDelivery && this.orderStatus !== 'cancelled') {
    const delivery = new Date();
    delivery.setDate(delivery.getDate() + 5);
    this.estimatedDelivery = delivery;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
