import { navigation } from '../catalog.js';

const announcements = [
  'Shop our latest arrivals!',
  'Authentic Korean Skincare',
  'UK Based Store',
  'Fast Delivery Nationwide',
];

export function AnnouncementBar() {
  return (
    <div className="announcement-bar" role="region" aria-label="Store announcements">
      <div className="announcement-track">
        <div className="announcement-group">{announcements.map((announcement) => <span key={announcement}>{announcement}</span>)}</div>
        <div className="announcement-group" aria-hidden="true">{announcements.map((announcement) => <span key={announcement}>{announcement}</span>)}</div>
      </div>
    </div>
  );
}

export function StoreHeader({ cartCount }) {
  return (
    <>
      <AnnouncementBar />
      <header className="bg-white border-b border-stone-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between gap-6 relative">
          <form action="/search" method="get" className="w-1/3 max-w-xs relative hidden sm:block">
            <label className="sr-only" htmlFor="header-search">Search products, ingredients and concerns</label>
            <input id="header-search" name="q" type="search" className="w-full text-xs placeholder:text-stone-400 bg-transparent border-b border-stone-300 py-1.5 pr-8 pl-0 text-stone-800 focus:outline-none focus:border-stone-900" placeholder="Search products, ingredients and concerns" />
            <button aria-label="Search" type="submit" className="absolute right-0 top-1.5 text-stone-400 hover:text-stone-700">⌕</button>
          </form>
          <a className="absolute left-1/2 -translate-x-1/2 text-center whitespace-nowrap font-serif-luxury text-2xl sm:text-3xl tracking-[0.25em] font-medium text-stone-900 uppercase z-10" href="/">MIIKOREAN</a>
          <div className="ml-auto w-1/3 flex items-center justify-end gap-4 text-xs">
            <a className="hidden sm:inline text-stone-700 hover:text-black" href="/login">Sign In</a>
            <a aria-label="Wishlist" className="text-stone-700 hover:text-black" href="/account/wishlist">♡</a>
            <a aria-label="Shopping bag" className="text-stone-700 hover:text-black" href="/cart">Bag{cartCount ? ` (${cartCount})` : ''}</a>
          </div>
        </div>
        <nav className="hidden sm:flex items-center justify-center gap-8 border-t border-stone-100 py-3 text-[10px] uppercase tracking-widest text-stone-600" aria-label="Primary">
          <a href="/collections/all" className="hover:text-stone-950">Shop</a>
          <a href="/pages/about-us" className="hover:text-stone-950">About Us</a>
          <a href="/pages/contact-us" className="hover:text-stone-950">Contact</a>
        </nav>
      </header>
    </>
  );
}

export function StoreFooter() {
  return (
    <footer className="site-footer bg-brand-deepNight text-stone-300 py-16 px-6 sm:px-12 border-t border-stone-900 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-14">
        <div><a className="font-serif-luxury text-2xl tracking-[0.25em] font-medium text-white uppercase block mb-4" href="/">MIIKOREAN</a><p className="text-xs text-stone-400 font-light leading-relaxed max-w-xs">Authentic Korean skincare delivered to your door.</p></div>
        <FooterColumn title="Shop" links={navigation} />
        <FooterColumn title="Help" links={[["Shipping", "/policies/shipping-policy"], ["Returns", "/policies/refund-policy"], ["FAQ", "/pages/faq"], ["Contact", "/pages/contact-us"]]} />
        <FooterColumn title="Company" links={[["About Us", "/pages/about-us"], ["Contact", "/pages/contact-us"]]} />
      </div>
      <div className="max-w-7xl mx-auto pt-8 border-t border-stone-800/80 text-[11px] text-stone-500 font-light">© 2026 MIIKOREAN. All rights reserved.</div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return <div><h2 className="text-xs font-semibold uppercase tracking-widest text-white mb-4">{title}</h2><ul className="space-y-2.5 text-xs text-stone-400 font-light">{links.map(([label, href]) => <li key={label}><a className="hover:text-white" href={href}>{label}</a></li>)}</ul></div>;
}

export function MobileNav({ showAccount }) {
  return <nav className="mobile-bottom-nav" aria-label="Mobile navigation"><a href="/">⌂<span>Home</span></a><a href="/search">⌕<span>Search</span></a><a href="/#routine-steps">♧<span>Routine</span></a><a href="/account/wishlist">♡<span>Wishlist</span></a>{showAccount && <a href="/login">◯<span>Account</span></a>}</nav>;
}