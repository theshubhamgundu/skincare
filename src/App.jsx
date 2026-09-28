import { useEffect, useState } from 'react';
import { categories, commerceProductByHandle, commerceProducts } from './catalog.js';
import { createCartLine, defaultCookiePreferences, readCartItems, readCookiePreferences, readWishlistHandles, cookieConsentStorageKey } from './lib/store.js';
import { AnnouncementBar, MobileNav, StoreFooter, StoreHeader } from './components/StoreChrome.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import { homepageMarkup } from './pages/homepageTemplate.js';
import { CartPage, CheckoutPage, ProductPage, SearchPage, WishlistPage } from './pages/CommercePages.jsx';

function IngredientPage({ cartCount }) {
  return <><StoreHeader cartCount={cartCount} /><main id="main" className="max-w-7xl mx-auto px-4 sm:px-6 py-8"><nav className="text-xs text-stone-500 mb-10"><a href="/">Home</a><span className="mx-2">/</span>Ingredient glossary</nav><section className="bg-[#F6EEE5] px-8 py-16 mb-12"><p className="text-[11px] tracking-[0.2em] uppercase text-stone-500 mb-3">Ingredient glossary</p><h1 className="font-serif-luxury text-4xl sm:text-6xl uppercase tracking-[0.12em] text-stone-900 max-w-3xl">Know what’s in it before it’s on your face.</h1><p className="text-sm text-stone-600 font-light leading-relaxed max-w-2xl mt-5">Every product lists its full INCI, key ingredients and known conflicts. Browse by name to see what an ingredient does, which of our products contain it, and what to avoid layering it with.</p></section><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{['Centella asiatica', 'Niacinamide', 'Snail mucin', 'Hyaluronic acid', 'Vitamin C', 'AHA / BHA'].map((ingredient) => <a key={ingredient} href="#" className="border border-stone-200 p-6 text-sm uppercase tracking-widest hover:bg-stone-900 hover:text-white">{ingredient}</a>)}</div></main><StoreFooter /></>;
}

const informationPages = {
  '/policies/shipping-policy': {
    title: 'Shipping policy',
    sections: [
      { title: 'Processing Times', paragraphs: ['Orders are typically processed within 1–3 business days.'] },
      { title: 'Delivery Times', paragraphs: ['United Kingdom deliveries typically arrive within 3–7 business days after dispatch.', 'Please note that delivery times are estimates and may vary during busy periods, public holidays, or due to courier delays.'] },
      { title: 'Order Tracking', paragraphs: ['Where available, tracking information will be provided once your order has been dispatched.'] },
      { title: 'Incorrect Addresses', paragraphs: ['Customers are responsible for providing accurate shipping information. We are not responsible for orders shipped to incorrect addresses supplied at checkout.'] },
      { title: 'Lost or Delayed Orders', paragraphs: ['If your order has not arrived within the expected timeframe, contact support@skinofkorea.co.uk and we will investigate with the courier.'] },
    ],
  },
  '/policies/refund-policy': {
    title: 'Refund policy',
    sections: [
      { title: 'Returns', paragraphs: ['You may return unused and unopened products within 14 days of delivery for a refund.'], bullets: ['Be unopened', 'Be unused', 'Be in their original packaging', 'Be in a resellable condition'] },
      { title: 'Non-Returnable Items', paragraphs: ['For hygiene and safety reasons, we cannot accept returns of:'], bullets: ['Opened skincare products', 'Used products', 'Gift cards', 'Sale items (unless faulty)'] },
      { title: 'Damaged or Incorrect Items', paragraphs: ['If you receive a damaged, defective, or incorrect item, please contact us within 48 hours of delivery and include photographs where possible.'] },
      { title: 'Refund Processing', paragraphs: ['Approved refunds will be processed to the original payment method within 5–10 business days after the returned item has been received and inspected.'] },
      { title: 'Return Costs', paragraphs: ['Unless the item is faulty or incorrect, customers are responsible for return shipping costs.', 'For return enquiries contact support@skinofkorea.co.uk.'] },
    ],
  },
  '/pages/faq': {
    title: 'Frequently Asked Questions',
    sections: [
      { title: 'Are your products authentic?', paragraphs: ['Yes. We only stock genuine Korean skincare products sourced from trusted suppliers and distributors.'] },
      { title: 'How long does delivery take?', paragraphs: ['Orders are typically processed within 1–3 business days. UK delivery usually takes 3–7 business days after dispatch.'] },
      { title: 'Can I return my order?', paragraphs: ['Yes. Unopened and unused products may be returned within 14 days of delivery. Please see our Returns Policy for full details.'] },
      { title: 'What if my item arrives damaged?', paragraphs: ['If your order arrives damaged or incorrect, contact us within 48 hours of delivery and include photographs where possible.'] },
      { title: 'How do I know which products are right for my skin?', paragraphs: ['Each product page includes information about ingredients, skin types and recommended usage. If you’re unsure, contact us and we’ll be happy to help.'] },
      { title: 'Are Korean skincare products suitable for sensitive skin?', paragraphs: ['Many Korean skincare products are formulated with gentle ingredients. However, we recommend patch testing before use.'] },
      { title: 'How can I track my order?', paragraphs: ['Tracking information will be provided once your order has been dispatched.'] },
      { title: 'How can I contact you?', paragraphs: ['Email us at support@skinofkorea.co.uk and we’ll get back to you as soon as possible.'] },
    ],
  },
  '/pages/contact-us': {
    title: 'Contact Us',
    sections: [
      { title: 'We’d Love To Hear From You', paragraphs: ['Whether you have a question about a product, an order, delivery, returns, or simply need help choosing the right skincare products, our team is here to help.', 'Email hello@skinofkorea.co.uk. We aim to respond to all enquiries within 1–2 business days.'] },
      { title: 'Delivery & Orders', paragraphs: ['For an existing order enquiry, include your order number, the full name used when placing the order, and a brief description of your enquiry.'] },
      { title: 'Product Questions', paragraphs: ['We’re happy to help with general product enquiries and can guide you towards suitable cleansers, toners, serums, moisturisers, sunscreens and face masks available on our store.'] },
      { title: 'Business Enquiries', paragraphs: ['For partnership, wholesale or business enquiries, contact hello@skinofkorea.co.uk and include “Business Enquiry” in the subject line.'] },
    ],
  },
  '/pages/about-us': {
    title: 'About Us',
    sections: [
      { title: 'Bringing Authentic Korean Skincare to the UK', paragraphs: ['At MIIKOREAN, our mission is simple: to make authentic Korean skincare accessible throughout the UK.', 'We created MIIKOREAN to help UK customers discover trusted Korean skincare brands without the confusion of overseas ordering, long delivery times or concerns about product authenticity.'] },
      { title: 'Why Korean Skincare?', paragraphs: ['Korean skincare focuses on long-term skin health rather than quick fixes. Products feature ingredients such as hyaluronic acid, centella asiatica, rice extract, snail mucin, green tea, niacinamide and ceramides.'] },
      { title: 'Our Commitment to Authenticity', paragraphs: ['We carefully source products from trusted suppliers and distributors to ensure customers receive genuine Korean skincare products from brands they know and love.'] },
      { title: 'Curated Products We Believe In', paragraphs: ['We focus on carefully selected cleansers, toners, serums, moisturisers, sunscreens and face masks chosen for quality, effectiveness and customer satisfaction.'] },
      { title: 'Delivered Across the UK', paragraphs: ['MIIKOREAN aims to provide secure online shopping, reliable UK delivery, responsive customer support and a carefully curated collection of Korean skincare products.'] },
    ],
  },
};

function InformationPage({ page, cartCount }) {
  return (
    <>
      <StoreHeader cartCount={cartCount} />
      <main id="main" className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="font-serif-luxury text-4xl sm:text-5xl uppercase tracking-[0.12em] text-stone-900 mb-10">{page.title}</h1>
        <div className="space-y-9">
          {page.sections.map((section) => <section key={section.title} className="border-t border-stone-200 pt-5"><h2 className="text-sm font-semibold text-stone-900 mb-3">{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph} className="text-sm text-stone-600 leading-relaxed mb-3">{paragraph}</p>)}{section.bullets && <ul className="list-disc pl-5 space-y-1 text-sm text-stone-600">{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}</section>)}
        </div>
      </main>
      <StoreFooter />
    </>
  );
}

function CookieConsent({ initialPreferences, onSave }) {
  const [customizing, setCustomizing] = useState(false);
  const [preferences, setPreferences] = useState(initialPreferences ?? defaultCookiePreferences);

  const updatePreference = (name, enabled) => {
    setPreferences((current) => ({ ...current, [name]: enabled }));
  };

  return (
    <div
      aria-labelledby="cookieTitle"
      className="cookie-consent fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white shadow-2xl border border-stone-200 p-5 rounded-sm"
      role="dialog"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-900" id="cookieTitle">
          {customizing ? 'Cookie Preferences' : 'Cookie Consent'}
        </h3>
        <button aria-label="Reject optional cookies and close" className="text-stone-400 hover:text-stone-700" onClick={() => onSave(defaultCookiePreferences)}>
          <span aria-hidden="true" className="text-lg leading-none">&times;</span>
        </button>
      </div>
      {customizing ? (
        <>
          <p className="text-[11px] text-stone-600 leading-relaxed mb-4">Necessary cookies keep the store working. Choose whether to allow optional analytics and marketing cookies.</p>
          <fieldset className="space-y-3 mb-5">
            <legend className="sr-only">Cookie categories</legend>
            <label className="flex items-start gap-3 text-xs text-stone-800"><input checked disabled type="checkbox" className="mt-0.5 h-4 w-4 accent-stone-900" /><span><strong className="block">Necessary</strong><span className="text-[11px] text-stone-500">Required for core store features.</span></span></label>
            <label className="flex items-start gap-3 text-xs text-stone-800"><input checked={preferences.analytics} onChange={(event) => updatePreference('analytics', event.target.checked)} type="checkbox" className="mt-0.5 h-4 w-4 accent-stone-900" /><span><strong className="block">Analytics</strong><span className="text-[11px] text-stone-500">Helps us understand how the store is used.</span></span></label>
            <label className="flex items-start gap-3 text-xs text-stone-800"><input checked={preferences.marketing} onChange={(event) => updatePreference('marketing', event.target.checked)} type="checkbox" className="mt-0.5 h-4 w-4 accent-stone-900" /><span><strong className="block">Marketing</strong><span className="text-[11px] text-stone-500">Allows relevant promotions and advertising.</span></span></label>
          </fieldset>
          <div className="flex items-center gap-2">
            <button className="flex-1 border border-stone-300 text-[10px] tracking-wider uppercase font-semibold py-2 hover:bg-stone-100 transition" onClick={() => setCustomizing(false)}>Back</button>
            <button className="flex-1 bg-stone-950 text-white text-[10px] tracking-wider uppercase font-semibold py-2 hover:bg-stone-800 transition" onClick={() => onSave(preferences)}>Save choices</button>
          </div>
        </>
      ) : (
        <>
          <p className="text-[11px] text-stone-600 leading-relaxed mb-4">Necessary cookies keep the store working. You can choose whether to allow optional analytics and marketing cookies.</p>
          <div className="flex items-center gap-2 mb-2">
            <button className="flex-1 border border-stone-900 text-[10px] tracking-wider uppercase font-semibold py-2 hover:bg-stone-100 transition" onClick={() => onSave(defaultCookiePreferences)}>Reject All</button>
            <button className="flex-1 border border-stone-300 text-[10px] tracking-wider uppercase font-semibold py-2 hover:bg-stone-100 transition" onClick={() => setCustomizing(true)}>Customise</button>
          </div>
          <button className="w-full bg-stone-950 text-white text-[10px] tracking-wider uppercase font-semibold py-2 hover:bg-stone-800 transition" onClick={() => onSave({ necessary: true, analytics: true, marketing: true })}>Accept All</button>
        </>
      )}
    </div>
  );
}

export default function App() {
  const [cookiePreferences, setCookiePreferences] = useState(readCookiePreferences);
  const [showCookieConsent, setShowCookieConsent] = useState(() => cookiePreferences === null);
  const [cartItems, setCartItems] = useState(readCartItems);
  const [wishlistHandles, setWishlistHandles] = useState(readWishlistHandles);
  const [cartMessage, setCartMessage] = useState('');
  const currentPath = window.location.pathname;
  const searchQuery = new URLSearchParams(window.location.search).get('q') ?? '';
  const category = categories[currentPath];
  const informationPage = informationPages[currentPath];
  const productHandle = currentPath.match(/^\/products\/([^/]+)$/)?.[1];
  const commerceProduct = productHandle ? commerceProductByHandle[productHandle] : null;
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const handleAddToBag = (product, options = {}) => {
    if (!product) return;
    if (product.available === false) {
      setCartMessage(`${product.title} is sold out`);
      window.setTimeout(() => setCartMessage(''), 2400);
      return;
    }
    const line = createCartLine(product, options);
    setCartItems((current) => {
      const existing = current.find((item) => item.key === line.key);
      return existing
        ? current.map((item) => item.key === line.key ? { ...item, quantity: item.quantity + line.quantity } : item)
        : [...current, line];
    });
    setCartMessage(`${product.title} added to your bag`);
    window.setTimeout(() => setCartMessage(''), 2400);
  };

  const removeCartItem = (key) => setCartItems((items) => items.filter((item) => item.key !== key));

  const toggleWishlist = (handle) => {
    const wasSaved = wishlistHandles.includes(handle);
    setWishlistHandles((handles) => handles.includes(handle) ? handles.filter((item) => item !== handle) : [...handles, handle]);
    const product = commerceProductByHandle[handle];
    setCartMessage(`${product?.title ?? 'Product'} ${wasSaved ? 'removed from' : 'added to'} your wishlist`);
    window.setTimeout(() => setCartMessage(''), 2400);
  };

  const updateCartItem = (key, action) => {
    setCartItems((items) => items.flatMap((item) => {
      if (item.key !== key) return [item];
      if (action === 'increase') return [{ ...item, quantity: item.quantity + 1 }];
      if (action === 'decrease') return item.quantity > 1 ? [{ ...item, quantity: item.quantity - 1 }] : [];
      const purchaseType = action === 'one-time' ? 'one-time' : 'subscription';
      const frequency = purchaseType === 'subscription' ? Number(action.split('-')[1]) : null;
      const unitPrice = purchaseType === 'subscription' ? item.basePrice * 0.9 : item.basePrice;
      return [{ ...item, key: `${item.handle}:${purchaseType}:${frequency ?? 'once'}`, purchaseType, frequency, unitPrice }];
    }));
  };

  const saveCookiePreferences = (preferences) => {
    try {
      window.localStorage.setItem(cookieConsentStorageKey, JSON.stringify(preferences));
    } catch {}
    setCookiePreferences(preferences);
    setShowCookieConsent(false);
  };

  useEffect(() => {
    localStorage.setItem('miikorean-cart', JSON.stringify(cartItems));
    localStorage.setItem('miikorean-cart-count', String(cartCount));
    const bag = document.querySelector('[aria-label="Shopping bag"] span');
    if (bag) {
      bag.textContent = cartCount ? `Bag (${cartCount})` : 'Bag';
    }
  }, [cartItems, cartCount]);

  useEffect(() => {
    localStorage.setItem('miikorean-wishlist', JSON.stringify(wishlistHandles));
    document.querySelectorAll('[data-wishlist-handle]').forEach((button) => {
      const isSaved = wishlistHandles.includes(button.dataset.wishlistHandle);
      button.classList.toggle('is-saved', isSaved);
      button.setAttribute('aria-pressed', String(isSaved));
      button.setAttribute('aria-label', `${isSaved ? 'Remove' : 'Add'} product to wishlist`);
    });
  }, [wishlistHandles]);

  useEffect(() => {
    const handleStaticProductAction = (event) => {
      const addButton = event.target.closest('[data-add-to-bag]');
      if (addButton && !addButton.disabled) {
        const product = commerceProductByHandle[addButton.dataset.addToBag];
        if (product) handleAddToBag(product, { quantity: 1, purchaseType: 'one-time', frequency: 30 });
        return;
      }
      const wishlistButton = event.target.closest('[data-wishlist-handle]');
      if (wishlistButton) {
        toggleWishlist(wishlistButton.dataset.wishlistHandle);
        const isSaved = !wishlistHandles.includes(wishlistButton.dataset.wishlistHandle);
        wishlistButton.setAttribute('aria-pressed', String(isSaved));
        wishlistButton.setAttribute('aria-label', `${isSaved ? 'Remove' : 'Add'} product to wishlist`);
      }
    };
    document.addEventListener('click', handleStaticProductAction);
    return () => document.removeEventListener('click', handleStaticProductAction);
  }, [handleAddToBag, toggleWishlist, wishlistHandles]);

  useEffect(() => {
    const revealItems = [...document.querySelectorAll('section, article, .brand-tile, .review-item, main > div')];
    revealItems.forEach((item) => {
      item.classList.add('scroll-reveal');
      item.classList.remove('is-visible');
    });

    if (!('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [currentPath]);

  return (
    <>
      {category ? <CategoryPage category={category} cartCount={cartCount} onAddToBag={handleAddToBag} /> : commerceProduct ? <ProductPage cartCount={cartCount} onAddToBag={handleAddToBag} onToggleWishlist={toggleWishlist} product={commerceProduct} saved={wishlistHandles.includes(commerceProduct.handle)} /> : currentPath === '/cart' ? <CartPage cartCount={cartCount} cartItems={cartItems} onAddToBag={handleAddToBag} onRemove={removeCartItem} onUpdateCartItem={updateCartItem} /> : currentPath === '/checkout' ? <CheckoutPage cartCount={cartCount} cartItems={cartItems} /> : currentPath === '/account/wishlist' ? <WishlistPage cartCount={cartCount} handles={wishlistHandles} onAddToBag={handleAddToBag} onToggleWishlist={toggleWishlist} /> : currentPath === '/search' ? <SearchPage cartCount={cartCount} onAddToBag={handleAddToBag} query={searchQuery} /> : informationPage ? <InformationPage page={informationPage} cartCount={cartCount} /> : currentPath === '/ingredients' ? <IngredientPage cartCount={cartCount} /> : <><AnnouncementBar /><div dangerouslySetInnerHTML={{ __html: homepageMarkup }} /></>}
      {showCookieConsent && <CookieConsent initialPreferences={cookiePreferences} onSave={saveCookiePreferences} />}
      <MobileNav showAccount={Boolean(category || informationPage || currentPath === '/ingredients')} />
      {cartMessage && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 bg-stone-950 text-white px-5 py-3 text-xs shadow-xl" role="status">
          {cartMessage}
        </div>
      )}
    </>
  );
}
