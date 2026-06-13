const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// ======================
// CORS Configuration
// ======================
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://buildronics.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// ======================
// Body Parsers
// ======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================
// Static Files
// ======================
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);

// ======================
// API Routes
// ======================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// ======================
// Health Check
// ======================
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Buildronics API running',
    uploadPath: '/uploads/products/'
  });
});

// ======================
// Global Error Handler
// ======================
app.use((err, req, res, next) => {
  console.error('Server Error:', err);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      message: 'File too large. Max size is 5MB.'
    });
  }

  res.status(500).json({
    message: err.message || 'Internal Server Error'
  });
});

// ======================
// MongoDB Connection
// ======================
mongoose
  .connect(
    process.env.MONGO_URI || 'mongodb://localhost:27017/buildronics'
  )
  .then(() => {
    console.log('✅ MongoDB Connected');

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(
        `📁 Uploads available at /uploads/products/`
      );
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

module.exports = app;