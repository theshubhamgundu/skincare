export const cookieConsentStorageKey = 'miikorean-cookie-preferences';
export const defaultCookiePreferences = { necessary: true, analytics: false, marketing: false };

export function readCookiePreferences() {
  try {
    const preferences = JSON.parse(window.localStorage.getItem(cookieConsentStorageKey));
    if (typeof preferences?.analytics !== 'boolean' || typeof preferences?.marketing !== 'boolean') {
      return null;
    }
    return { necessary: true, analytics: preferences.analytics, marketing: preferences.marketing };
  } catch {
    return null;
  }
}

export function readCartItems() {
  try {
    const items = JSON.parse(window.localStorage.getItem('miikorean-cart') || '[]');
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

export function readWishlistHandles() {
  try {
    const handles = JSON.parse(window.localStorage.getItem('miikorean-wishlist') || '[]');
    return Array.isArray(handles) ? handles : [];
  } catch {
    return [];
  }
}

export function createCartLine(product, options = {}) {
  const variant = product.variants?.[0];
  const basePrice = Number(product.price ?? variant?.price ?? 0);
  const purchaseType = options.purchaseType ?? 'one-time';
  const frequency = purchaseType === 'subscription' ? options.frequency ?? 30 : null;
  const key = `${product.handle}:${purchaseType}:${frequency ?? 'once'}`;

  return {
    key,
    handle: product.handle,
    title: product.title,
    vendor: product.vendor,
    category: product.category ?? product.type ?? product.product_type,
    description: product.description ?? '',
    image: product.image ?? product.images?.[0]?.src ?? '',
    basePrice,
    unitPrice: purchaseType === 'subscription' ? basePrice * 0.9 : basePrice,
    purchaseType,
    frequency,
    quantity: options.quantity ?? 1,
  };
}

export const formatPrice = (price) => `£${Number(price).toFixed(2)}`;