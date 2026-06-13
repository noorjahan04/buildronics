/**
 * Resolves any server image path or external URL to a full displayable URL.
 *
 * - Full https:// URL  → returned as-is
 * - /uploads/... path  → prepends API base (https://buildronics.onrender.com)
 * - empty / null       → returns category fallback for products, empty string for avatars
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
 * For avatar images — returns empty string when not set (so initials render instead)
 */
export function getAvatarUrl(avatar) {
  if (!avatar) return '';
  if (avatar.startsWith('http://') || avatar.startsWith('https://')) return avatar;
  if (avatar.startsWith('/')) return `${API_BASE}${avatar}`;
  return `${API_BASE}/uploads/avatars/${avatar}`;
}
