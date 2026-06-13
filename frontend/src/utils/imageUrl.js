/**
 * Resolves any server image path or external URL to a full displayable URL.
 *
 * - Full https:// URL  → returned as-is
 * - /api/upload/... path  → returned as-is (already full URL)
 * - empty / null       → returns empty string for avatars
 */

const API_BASE = import.meta.env.VITE_API_URL || 'https://buildronics.onrender.com';

const PRODUCT_FALLBACKS = {
  'Microcontrollers': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
  'FPGA Boards':      'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&q=80',
  'Sensors':          'https://images.unsplash.com/photo-1574928329096-d9ffe00d9ea3?w=400&q=80',
  'Communication':    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
};
const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80';

/**
 * For product images — returns a category fallback when empty
 */
export function getImageUrl(image, collection = '') {
  if (!image) return PRODUCT_FALLBACKS[collection] || DEFAULT_FALLBACK;
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  if (image.startsWith('/')) return `${API_BASE}${image}`;
  return `${API_BASE}/uploads/products/${image}`;
}

/**
 * For avatar images — avatarUrl should be the full API endpoint: /api/upload/avatar/:userId
 * Returns empty string when not set (so initials render instead)
 */
export function getAvatarUrl(userId) {
  if (!userId) return '';
  // avatarUrl is the API endpoint path
  if (userId.startsWith('/api/upload/avatar/')) {
    return `${API_BASE}${userId}`;
  }
  // If userId is passed (the user ID), construct the endpoint
  return `${API_BASE}/api/upload/avatar/${userId}`;
}
