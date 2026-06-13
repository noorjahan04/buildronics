const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const User = require('../models/User');

// ===========================
// Avatar Upload (MongoDB)
// ===========================
const multer = require('multer');

// Memory storage for avatars — saves file buffer to MongoDB
const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 }, // 3 MB max
  fileFilter(req, file, cb) {
    const ok = /jpeg|jpg|png|gif|webp/.test(path.extname(file.originalname).toLowerCase());
    ok ? cb(null, true) : cb(new Error('Only image files allowed'));
  },
});

/**
 * POST /api/upload/avatar
 * Upload logged-in user's profile picture to MongoDB.
 * Body: form-data  →  key: "avatar"  type: File
 * Returns: { success: true, message, user }
 */
router.post('/avatar', protect, avatarUpload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided. Use form-data key "avatar".' });
    }

    // Save file buffer directly to MongoDB
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        avatar: {
          data: req.file.buffer,
          contentType: req.file.mimetype,
          uploadedAt: new Date()
        }
      },
      { new: true }
    );

    res.json({
      message: 'Profile picture updated successfully',
      success: true,
      user: user.toJSON(),
      // Return download URL for avatar
      avatarUrl: `/api/upload/avatar/${req.user._id}`
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/upload/avatar/:userId
 * Retrieve user's avatar from MongoDB
 */
router.get('/avatar/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user || !user.avatar || !user.avatar.data) {
      return res.status(404).json({ message: 'Avatar not found' });
    }

    res.set('Content-Type', user.avatar.contentType);
    res.set('Cache-Control', 'max-age=86400'); // Cache for 24 hours
    res.send(user.avatar.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * POST /api/upload
 * Upload a single product image.
 * Returns: { imageUrl: "/uploads/products/product-xxx.jpg" }
 *
 * Use in Postman:
 *   - Method: POST
 *   - URL: http://localhost:5000/api/upload
 *   - Auth: Bearer <admin_token>
 *   - Body: form-data  →  key: "image" (type: File)  →  value: choose your image file
 */
router.post('/', protect, admin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided. Use form-data with key "image".' });
  }

  // Return the public URL path
  const imageUrl = `/uploads/products/${req.file.filename}`;
  res.json({
    message: 'Image uploaded successfully',
    imageUrl,
    filename: req.file.filename,
    size: req.file.size,
    fullUrl: `${req.protocol}://${req.get('host')}${imageUrl}`,
  });
});

/**
 * POST /api/upload/url
 * Alternatively, just validate and store an external image URL.
 * Body: { "imageUrl": "https://example.com/image.jpg" }
 */
router.post('/url', protect, admin, (req, res) => {
  const { imageUrl } = req.body;
  if (!imageUrl) {
    return res.status(400).json({ message: 'imageUrl is required' });
  }
  // Basic URL validation
  try {
    new URL(imageUrl);
  } catch {
    return res.status(400).json({ message: 'Invalid URL format' });
  }
  res.json({ message: 'URL accepted', imageUrl });
});

module.exports = router;