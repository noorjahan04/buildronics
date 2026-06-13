const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const User = require('../models/User');

// Separate multer config for avatars (saved to /uploads/avatars/)
const multer = require('multer');

const avatarStorage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = path.join(__dirname, '..', 'uploads', 'avatars');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename(req, file, cb) {
    // e.g. avatar-userId-timestamp.jpg  — one file per user keeps storage clean
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `avatar-${req.user._id}${ext}`);
  },
});

const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3 MB max
  fileFilter(req, file, cb) {
    const ok = /jpeg|jpg|png|gif|webp/.test(path.extname(file.originalname).toLowerCase());
    ok ? cb(null, true) : cb(new Error('Only image files allowed'));
  },
});

/**
 * POST /api/upload/avatar
 * Upload logged-in user's profile picture.
 * Body: form-data  →  key: "avatar"  type: File
 * Returns: { avatarUrl: "/uploads/avatars/avatar-userId.jpg" }
 */
router.post('/avatar', protect, avatarUpload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided. Use form-data key "avatar".' });
    }
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    // Save to user document
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarUrl },
      { new: true }
    );

    res.json({
      message: 'Profile picture updated',
      avatarUrl,
      fullUrl: `${req.protocol}://${req.get('host')}${avatarUrl}`,
      user,
    });
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