import { useEffect, useState } from 'react';
import source from '../code.html?raw';
import { categories, navigation } from './catalog.js';

const bodyMarkup = source.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? '';
const pageMarkup = bodyMarkup.replace(
  /<!-- BEGIN: CookieConsentModal -->[\s\S]*?<!-- END: CookieConsentModal -->/i,
  '',
);

const announcements = [
  'Fast 1–2 day UK dispatch',
  '100% genuine Korean skincare',
  'Ingredient conflicts checked at checkout',
  'FREE UK DELIVERY ON ORDERS OVER £40',
];

function AnnouncementBar() {
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setAnnouncementIndex((index) => (index + 1) % announcements.length), 4000);
    return () => window.clearInterval(timer);
  }, []);

  return <div className="announcement-bar" key={announcements[announcementIndex]}>{announcements[announcementIndex]}</div>;
}

function StoreHeader({ cartCount }) {
  return (
    <>
      <AnnouncementBar />
      <header className="bg-white border-b border-stone-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between gap-6">
          <label className="w-1/3 max-w-xs relative hidden sm:block">
            <span className="sr-only">Search products, ingredients and concerns</span>
            <input className="w-full text-xs placeholder:text-stone-400 bg-transparent border-b border-stone-300 py-1.5 pr-8 pl-0 text-stone-800 focus:outline-none focus:border-stone-900" placeholder="Search products, ingredients and concerns" />
          </label>
          <a className="flex-1 text-center font-serif-luxury text-2xl sm:text-3xl tracking-[0.25em] font-medium text-stone-900 uppercase" href="/">MIIKOREAN</a>
          <div className="w-1/3 flex items-center justify-end gap-4 text-xs">
            <a className="text-stone-700 hover:text-black" href="/login">Sign In</a>
            <a aria-label="Wishlist" className="text-stone-700 hover:text-black" href="#">♡</a>
            <a aria-label="Shopping bag" className="text-stone-700 hover:text-black" href="#">Bag{cartCount ? ` (${cartCount})` : ''}</a>
          </div>
        </div>
      </header>
    </>
  );
}

function StoreFooter() {
  return (
    <footer className="site-footer bg-brand-deepNight text-stone-300 py-16 px-6 sm:px-12 border-t border-stone-900 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-14">
        <div><a className="font-serif-luxury text-2xl tracking-[0.25em] font-medium text-white uppercase block mb-4" href="/">MIIKOREAN</a><p className="text-xs text-stone-400 font-light leading-relaxed max-w-xs">Korean skincare, checked ingredient by ingredient and shipped from the UK.</p></div>
        <FooterColumn title="Shop" links={navigation.slice(0, 4)} />
        <FooterColumn title="Help" links={[["Track an order", "/account"], ["Returns", "/account"], ["Sign in", "/login"]]} />
        <FooterColumn title="MiiKorean" links={[["Routine builder", "/routine"], ["Ingredient glossary", "/ingredients"], ["Points & rewards", "/account/points"], ["Subscriptions", "/account/subscriptions"]]} />
      </div>
      <div className="max-w-7xl mx-auto pt-8 border-t border-stone-800/80 text-[11px] text-stone-500 font-light">© 2026. All rights reserved.</div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return <div><h2 className="text-xs font-semibold uppercase tracking-widest text-white mb-4">{title}</h2><ul className="space-y-2.5 text-xs text-stone-400 font-light">{links.map(([label, href]) => <li key={label}><a className="hover:text-white" href={href}>{label}</a></li>)}</ul></div>;
}

const filterGroups = [
  ['Skin type', ['Dry', 'Combination', 'Sensitive']],
  ['Concern', ['Acne', 'Pores']],
  ['Formulation', ['Cruelty-free']],
  ['Price', ['All', '£10 – £19.99']],
  ['Brand', ['COSRX']],
];

function FilterPanel({ activeFilters, onToggle, onClear, sidebar = false }) {
  return (
    <div className={`${sidebar ? 'bg-white px-1 py-0' : 'border-b border-stone-200 bg-[#FCFAF7] px-5 py-6 mb-8'}`} aria-label="Filters">
      {sidebar && <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-900 mb-5">Filters</h2>}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-900">Filter</h2>
        <button className="text-[10px] uppercase tracking-widest underline underline-offset-4 text-stone-600 hover:text-stone-950" onClick={onClear}>Clear all</button>
      </div>
      <div className={`grid grid-cols-1 ${sidebar ? 'gap-6' : 'sm:grid-cols-2 lg:grid-cols-5 gap-6'}`}>
        {filterGroups.map(([group, options]) => <fieldset key={group}><legend className="text-xs font-semibold text-stone-900 mb-3">{group}</legend><div className="space-y-2">{options.map((option) => { const filterId = `${group}:${option}`; return <label key={option} className="flex items-center gap-2 text-xs text-stone-600 cursor-pointer"><input type="checkbox" checked={activeFilters.includes(filterId)} onChange={() => onToggle(filterId)} className="h-3.5 w-3.5 rounded-none border-stone-400 text-stone-900 focus:ring-stone-700" /><span>{option}</span><span className="text-stone-400">1</span></label>; })}</div></fieldset>)}
      </div>
    </div>
  );
}

function CategoryPage({ category, cartCount, onAddToBag }) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const currentPath = Object.keys(categories).find((key) => categories[key] === category);
  const related = navigation.filter(([, href]) => href !== currentPath);
  const product = category ? [category, ...(category.label === 'Masks' ? [category] : [])] : [];
  const toggleFilter = (filterId) => setActiveFilters((filters) => filters.includes(filterId) ? filters.filter((item) => item !== filterId) : [...filters, filterId]);

  return (
    <>
      <StoreHeader cartCount={cartCount} />
      <main id="main" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <nav className="text-xs text-stone-500 mb-10" aria-label="Breadcrumb"><a href="/">Home</a><span className="mx-2">/</span><span>{category.label}</span></nav>
        <div className="text-center mb-10">
          <h1 className="font-serif-luxury text-4xl sm:text-5xl uppercase tracking-[0.12em] font-normal text-stone-900 mb-4">{category.label}</h1>
          <p className="text-sm text-stone-600 font-light leading-relaxed max-w-2xl mx-auto">Every result on this page is in stock and checked for UK cosmetics compliance. Filter by skin type, concern or formulation to narrow it down.</p>
          <a className="inline-block mt-5 text-xs tracking-wide text-stone-900 hover:underline underline-offset-4" href="/routine"><span className="mr-2 text-stone-500">♧</span><strong>Not sure which one?</strong><span className="ml-2">Take the 2-minute routine quiz</span></a>
        </div>
        <nav className="flex justify-center gap-2 overflow-x-auto border-y border-stone-200 py-4 mb-8 text-[11px] uppercase tracking-wider whitespace-nowrap" aria-label="Other categories">{related.map(([label, href]) => <a key={href} className="border border-stone-400 px-5 py-2 hover:border-stone-900 hover:text-stone-950" href={href}>{label}</a>)}</nav>
        <div className="grid grid-cols-1 lg:grid-cols-[236px_minmax(0,1fr)] gap-8">
          <aside className="hidden lg:block"><FilterPanel sidebar activeFilters={activeFilters} onToggle={toggleFilter} onClear={() => setActiveFilters([])} /></aside>
          <section>
            <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-0 text-xs"><button className="lg:hidden border border-stone-800 px-5 py-2 uppercase tracking-widest hover:bg-stone-900 hover:text-white" onClick={() => setFiltersOpen((open) => !open)} aria-expanded={filtersOpen}>Filters{activeFilters.length ? ` (${activeFilters.length})` : ''}</button><p><strong>{product.length}</strong> {product.length === 1 ? 'product' : 'products'}</p><label className="flex items-center gap-2">Sort by<select className="border border-stone-300 bg-white px-3 py-2"><option>Best match</option><option>Price: low to high</option><option>Price: high to low</option><option>Top rated</option></select></label></div>
            {filtersOpen && <div className="lg:hidden mt-6"><FilterPanel activeFilters={activeFilters} onToggle={toggleFilter} onClear={() => setActiveFilters([])} /></div>}
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-6" aria-label={`${category.label} products`}>
          {product.map((item, index) => <li key={`${item.product}-${index}`}><article className="flex flex-col bg-white border border-stone-100 p-3 h-full"><div className="relative aspect-square bg-[#F8F5F2] overflow-hidden mb-3"><img alt={item.product} className="w-full h-full object-cover" src={item.image} /><button aria-label={`Add ${item.product} to wishlist`} className="absolute top-2 right-2 text-stone-500 text-xl">♡</button></div><p className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold mb-1">{item.eyebrow}</p><h2 className="text-sm font-semibold text-stone-900 leading-snug mb-2"><a href="#">{item.product}</a></h2><p className="text-xs text-stone-500 mb-4">{item.description}</p><p className="text-sm font-semibold text-stone-900 mb-3 mt-auto">{item.price}</p><button onClick={() => onAddToBag(item.product)} className="w-full border border-stone-800 text-[10px] tracking-widest uppercase font-semibold py-2 hover:bg-stone-900 hover:text-white transition">Add to bag</button></article></li>)}
        </ul>
          </section>
        </div>
      </main>
      <StoreFooter />
    </>
  );
}

function IngredientPage({ cartCount }) {
  return <><StoreHeader cartCount={cartCount} /><main id="main" className="max-w-7xl mx-auto px-4 sm:px-6 py-8"><nav className="text-xs text-stone-500 mb-10"><a href="/">Home</a><span className="mx-2">/</span>Ingredient glossary</nav><section className="bg-[#F6EEE5] px-8 py-16 mb-12"><p className="text-[11px] tracking-[0.2em] uppercase text-stone-500 mb-3">Ingredient glossary</p><h1 className="font-serif-luxury text-4xl sm:text-6xl uppercase tracking-[0.12em] text-stone-900 max-w-3xl">Know what’s in it before it’s on your face.</h1><p className="text-sm text-stone-600 font-light leading-relaxed max-w-2xl mt-5">Every product lists its full INCI, key ingredients and known conflicts. Browse by name to see what an ingredient does, which of our products contain it, and what to avoid layering it with.</p></section><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{['Centella asiatica', 'Niacinamide', 'Snail mucin', 'Hyaluronic acid', 'Vitamin C', 'AHA / BHA'].map((ingredient) => <a key={ingredient} href="#" className="border border-stone-200 p-6 text-sm uppercase tracking-widest hover:bg-stone-900 hover:text-white">{ingredient}</a>)}</div></main><StoreFooter /></>;
}

function CookieConsent({ onClose }) {
  return (
    <div
      aria-labelledby="cookieTitle"
      aria-modal="true"
      className="cookie-consent fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white shadow-2xl border border-stone-200 p-5 rounded-sm"
      role="dialog"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-900" id="cookieTitle">
          Cookie Consent
        </h3>
        <button aria-label="Close cookie banner" className="text-stone-400 hover:text-stone-700" onClick={onClose}>
          <span aria-hidden="true" className="text-lg leading-none">&times;</span>
        </button>
      </div>
      <p className="text-[11px] text-stone-600 leading-relaxed mb-4">
        We use cookies to personalise your experience, deliver analytics, and for marketing purposes. You can customise your preferences below.
      </p>
      <p className="text-[11px] text-stone-800 font-medium mb-3">
        You can accept all, reject all, or customise which <span className="underline">cookies you&apos;d like to</span> allow.
      </p>
      <div className="flex items-center gap-2 mb-2">
        <button className="flex-1 border border-stone-900 text-[10px] tracking-wider uppercase font-semibold py-2 hover:bg-stone-100 transition" onClick={onClose}>
          Reject All
        </button>
        <button className="flex-1 border border-stone-300 text-[10px] tracking-wider uppercase font-semibold py-2 hover:bg-stone-100 transition" onClick={onClose}>
          Customise
        </button>
      </div>
      <button className="w-full bg-stone-950 text-white text-[10px] tracking-wider uppercase font-semibold py-2 hover:bg-stone-800 transition" onClick={onClose}>
        Accept All
      </button>
    </div>
  );
}

function MobileNav({ showAccount }) {
  return <nav className="mobile-bottom-nav" aria-label="Mobile navigation"><a href="/">⌂<span>Home</span></a><a href="#">⌕<span>Search</span></a><a href="/routine">♧<span>Routine</span></a><a href="#">♡<span>Wishlist</span></a>{showAccount && <a href="/login">◯<span>Account</span></a>}</nav>;
}

export default function App() {
  const [showCookieConsent, setShowCookieConsent] = useState(true);
  const [cartCount, setCartCount] = useState(() => Number(localStorage.getItem('miikorean-cart-count') || 0));
  const [cartMessage, setCartMessage] = useState('');
  const currentPath = window.location.pathname;
  const category = categories[currentPath];

  const handleAddToBag = (product) => {
    setCartCount((count) => count + 1);
    setCartMessage(`${product} added to your bag`);
    window.setTimeout(() => setCartMessage(''), 2400);
  };

  useEffect(() => {
    localStorage.setItem('miikorean-cart-count', String(cartCount));
    const bag = document.querySelector('[aria-label="Shopping bag"] span');
    if (bag) {
      bag.textContent = cartCount ? `Bag (${cartCount})` : 'Bag';
    }
  }, [cartCount]);

  useEffect(() => {
    const addToBagButtons = [...document.querySelectorAll('button')].filter(
      (button) => button.textContent.trim().toLowerCase() === 'add to bag',
    );

    const handleAddToBag = (event) => {
      const product = event.currentTarget.closest('article')?.querySelector('h3')?.textContent.trim();
      handleAddToBag(product || 'Item');
    };

    addToBagButtons.forEach((button) => button.addEventListener('click', handleAddToBag));
    return () => addToBagButtons.forEach((button) => button.removeEventListener('click', handleAddToBag));
  }, []);

  useEffect(() => {
    const revealItems = [...document.querySelectorAll('section, article, .brand-tile, .review-item, main > div')];
    revealItems.forEach((item) => item.classList.add('scroll-reveal'));

    if (!('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

    revealItems.forEach((item) => {
      const bounds = item.getBoundingClientRect();
      if (bounds.top < window.innerHeight && bounds.bottom > 0) {
        item.classList.add('is-visible');
      } else {
        observer.observe(item);
      }
    });
    return () => observer.disconnect();
  }, [currentPath]);

  return (
    <>
      {category ? <CategoryPage category={category} cartCount={cartCount} onAddToBag={handleAddToBag} /> : currentPath === '/ingredients' ? <IngredientPage cartCount={cartCount} /> : <><AnnouncementBar /><div dangerouslySetInnerHTML={{ __html: pageMarkup }} /></>}
      {showCookieConsent && <CookieConsent onClose={() => setShowCookieConsent(false)} />}
      <MobileNav showAccount={Boolean(category || currentPath === '/ingredients')} />
      {cartMessage && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 bg-stone-950 text-white px-5 py-3 text-xs shadow-xl" role="status">
          {cartMessage}
        </div>
      )}
    </>
  );
}
