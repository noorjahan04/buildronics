const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Order = require('../models/Order');

// Simulate Razorpay order creation
router.post('/razorpay/create-order', protect, async (req, res) => {
  try {
    const { amount } = req.body;
    // In production, use actual Razorpay SDK:
    // const Razorpay = require('razorpay');
    // const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    // const order = await razorpay.orders.create({ amount: amount * 100, currency: 'INR', receipt: `order_${Date.now()}` });
    
    // Simulated response
    const simulatedOrder = {
      id: `order_${Date.now()}`,
      amount: amount * 100,
      currency: 'INR',
      status: 'created',
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_demo'
    };
    res.json(simulatedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Verify Razorpay payment
router.post('/razorpay/verify', protect, async (req, res) => {
  try {
    const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    // In production, verify signature with crypto
    // For demo, we accept any payment
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.isPaid = true;
    order.paidAt = Date.now();
    order.orderStatus = 'confirmed';
    order.paymentResult = {
      id: razorpay_payment_id || `pay_demo_${Date.now()}`,
      status: 'paid',
      transactionId: razorpay_order_id || `ord_demo_${Date.now()}`,
      update_time: new Date().toISOString()
    };
    order.trackingEvents.push({
      status: 'confirmed',
      description: 'Payment verified via Razorpay. Order confirmed.',
      location: 'Buildronics Payment Gateway'
    });
    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PhonePe / UPI payment initiation (simulated)
router.post('/phonepe/initiate', protect, async (req, res) => {
  try {
    const { amount, orderId } = req.body;
    // In production, integrate with PhonePe SDK
    // For demo, generate a UPI intent URL
    const upiPayload = {
      transactionId: `TXN${Date.now()}`,
      amount,
      orderId,
      upiId: 'buildronics@phonepe',
      merchantName: 'Buildronics by EEKAI',
      // Simulated UPI deep link
      paymentUrl: `upi://pay?pa=buildronics@phonepe&pn=Buildronics&am=${amount}&cu=INR&tn=Order${orderId}`,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=buildronics@phonepe%26pn=Buildronics%26am=${amount}%26cu=INR`,
      status: 'PAYMENT_INITIATED'
    };
    res.json(upiPayload);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PhonePe payment status check
router.post('/phonepe/status', protect, async (req, res) => {
  try {
    const { transactionId, orderId } = req.body;
    // In production, check with PhonePe API
    // For demo, simulate successful payment
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.isPaid = true;
    order.paidAt = Date.now();
    order.orderStatus = 'confirmed';
    order.paymentResult = {
      id: transactionId,
      status: 'SUCCESS',
      transactionId,
      update_time: new Date().toISOString()
    };
    order.trackingEvents.push({
      status: 'confirmed',
      description: 'Payment successful via PhonePe/UPI. Order confirmed.',
      location: 'Buildronics Payment Gateway'
    });
    await order.save();
    res.json({ success: true, code: 'PAYMENT_SUCCESS', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// COD order confirm
router.post('/cod/confirm', protect, async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.orderStatus = 'confirmed';
    order.trackingEvents.push({
      status: 'confirmed',
      description: 'Cash on Delivery order confirmed. Will be paid at delivery.',
      location: 'Buildronics Warehouse, Bengaluru'
    });
    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
