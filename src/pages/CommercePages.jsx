import { useState } from 'react';
import { commerceProductByHandle, commerceProducts } from '../catalog.js';
import { StoreFooter, StoreHeader } from '../components/StoreChrome.jsx';
import { formatPrice } from '../lib/store.js';

export function ProductPage({ product, cartCount, onAddToBag, saved, onToggleWishlist }) {
  const [purchaseType, setPurchaseType] = useState('one-time');
  const [frequency, setFrequency] = useState(30);
  const [quantity, setQuantity] = useState(1);
  const price = purchaseType === 'subscription' ? product.price * 0.9 : product.price;
  const pairedProducts = (product.pairsWith ?? []).map((handle) => commerceProductByHandle[handle]).filter(Boolean);
  const collectionHandle = { Cleanse: 'cleansers', Tone: 'toners', Essence: 'toners', Serum: 'serums', Mask: 'face-masks' }[product.category] ?? 'best-sellers';

  return (
    <>
      <StoreHeader cartCount={cartCount} />
      <main id="main" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <nav className="text-xs text-stone-500 mb-8" aria-label="Breadcrumb"><a href="/">Home</a><span className="mx-2">/</span><a href={`/collections/${collectionHandle}`}>{product.category}</a><span className="mx-2">/</span>{product.title}</nav>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
          <div className="aspect-square bg-[#F8F5F2] overflow-hidden"><img alt={product.title} className="w-full h-full object-cover" src={product.image} /></div>
          <div className="py-2 md:py-8">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-stone-500 mb-4"><span>{product.category}</span><span>In stock</span></div>
            <p className="text-xs uppercase tracking-widest text-stone-500 mb-2">{product.vendor}</p>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl text-stone-900 leading-tight">{product.title}</h1>
            <p className="text-sm text-stone-600 mt-3">{product.description}</p>
            <div className="flex flex-wrap gap-2 mt-5">{product.badges.map((badge) => <span key={badge} className="border border-stone-200 px-2.5 py-1 text-[10px] uppercase tracking-wide text-stone-600">{badge}</span>)}</div>
            <fieldset className="mt-8 space-y-3">
              <legend className="text-xs font-semibold text-stone-900 mb-3">How would you like it?</legend>
              <label className="flex items-center justify-between gap-3 border border-stone-300 p-3 text-sm cursor-pointer"><span className="flex items-center gap-3"><input checked={purchaseType === 'one-time'} name="purchaseType" onChange={() => setPurchaseType('one-time')} type="radio" />One-time purchase</span><strong>{formatPrice(product.price)}</strong></label>
              {product.subscriptionEligible && <label className="flex items-start justify-between gap-3 border border-stone-300 p-3 text-sm cursor-pointer"><span className="flex items-start gap-3"><input checked={purchaseType === 'subscription'} name="purchaseType" onChange={() => setPurchaseType('subscription')} type="radio" /><span><strong className="block">Subscribe &amp; save 10%</strong><span className="text-[11px] text-stone-500">Skip, reschedule or cancel from your account</span></span></span><span className="text-right"><strong className="block">{formatPrice(product.price * 0.9)}</strong><span className="text-xs text-stone-400 line-through">{formatPrice(product.price)}</span></span></label>}
            </fieldset>
            {purchaseType === 'subscription' && <div className="mt-3"><p className="text-xs text-stone-600 mb-2">Delivery frequency</p><div className="flex gap-2">{[30, 60, 90].map((days) => <button key={days} aria-pressed={frequency === days} className={`border px-3 py-2 text-xs ${frequency === days ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-300 text-stone-600'}`} onClick={() => setFrequency(days)} type="button">Every {days} days</button>)}</div><p className="text-[11px] text-stone-500 mt-2">First order ships now, then every {frequency} days. Skip or cancel any time.</p></div>}
            <div className="flex gap-3 mt-6">
              <div className="flex items-center border border-stone-300"><button aria-label="Decrease quantity" className="px-3 py-2 disabled:text-stone-300" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button><span className="min-w-8 text-center text-sm">{quantity}</span><button aria-label="Increase quantity" className="px-3 py-2" onClick={() => setQuantity((value) => value + 1)}>+</button></div>
              <button className="flex-1 bg-stone-900 px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white hover:bg-stone-700" onClick={() => onAddToBag(product, { quantity, purchaseType, frequency })}>Add to bag — {formatPrice(price * quantity)}</button>
              <button aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'} aria-pressed={saved} className="border border-stone-300 px-4 text-xl" onClick={() => onToggleWishlist(product.handle)}>{saved ? '♥' : '♡'}</button>
            </div>
            <div className="mt-5 border-t border-stone-200 pt-4 text-xs text-stone-600 space-y-2"><p>Standard delivery £2.95 · 3–5 working days</p><p>Earn {Math.floor(price)} points with this order</p></div>
            {product.keyIngredients?.length > 0 && <section className="mt-8 border-t border-stone-200 pt-5"><h2 className="text-sm font-semibold text-stone-900 mb-3">Key ingredients</h2><div className="flex gap-2">{product.keyIngredients.map((ingredient) => <span key={ingredient} className="border border-stone-200 px-3 py-2 text-xs">{ingredient}</span>)}</div></section>}
            {product.safety && <section className="mt-6 border-t border-stone-200 pt-5"><h2 className="text-sm font-semibold text-stone-900 mb-3">Safety &amp; compliance</h2><dl className="grid grid-cols-2 gap-3 text-xs"><dt className="text-stone-500">SCPN notified</dt><dd>{product.safety.scpn}</dd><dt className="text-stone-500">Period after opening</dt><dd>{product.safety.pao}</dd><dt className="text-stone-500">Country of origin</dt><dd>{product.safety.origin}</dd></dl></section>}
          </div>
        </section>
        {pairedProducts.length > 0 && <section className="mt-16"><h2 className="font-serif-luxury text-2xl uppercase tracking-widest text-stone-900">Pairs well with</h2><p className="text-sm text-stone-600 mt-2 mb-5">Checked against this product for conflicts.</p><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{pairedProducts.map((paired) => <article key={paired.handle} className="border border-stone-200 p-3"><img alt={paired.title} className="aspect-square w-full object-cover bg-[#F8F5F2]" src={paired.image} /><p className="text-[10px] uppercase tracking-wider text-stone-500 mt-3">{paired.vendor} · {paired.category}</p><h3 className="text-sm font-semibold mt-1">{paired.title}</h3><p className="text-xs text-stone-500 mt-1">{paired.description}</p><p className="text-sm font-semibold mt-3">{formatPrice(paired.price)}</p><button className="mt-3 w-full border border-stone-800 py-2 text-[10px] uppercase tracking-widest" onClick={() => onAddToBag(paired, { quantity: 1, purchaseType: 'one-time', frequency: 30 })}>Add to bag</button></article>)}</div></section>}
      </main>
      <StoreFooter />
    </>
  );
}

export function CartPage({ cartCount, cartItems, onAddToBag, onRemove, onUpdateCartItem }) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const freeShippingGap = Math.max(0, 40 - subtotal);
  const recommendationProducts = commerceProducts.filter((product) => !cartItems.some((item) => item.handle === product.handle)).slice(1, 3);

  if (cartItems.length === 0) {
    return <><StoreHeader cartCount={cartCount} /><main className="max-w-7xl mx-auto px-4 py-16 text-center"><h1 className="font-serif-luxury text-4xl text-stone-900">Your bag is empty</h1><a className="inline-block mt-6 border border-stone-900 px-6 py-3 text-xs uppercase tracking-widest" href="/">Continue shopping</a></main><StoreFooter /></>;
  }

  return (
    <>
      <StoreHeader cartCount={cartCount} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-end justify-between border-b border-stone-200 pb-5"><h1 className="font-serif-luxury text-4xl text-stone-900">Your bag</h1><span className="text-sm text-stone-600">{cartCount} {cartCount === 1 ? 'item' : 'items'}</span></div>
        <section className="mt-6 border border-[#dfe8e2] bg-[#f5f8f5] px-4 py-3 text-sm text-stone-700"><strong>No ingredient conflicts</strong> between the products in your bag.</section>
        <section className="mt-4 border border-stone-200 p-4"><p className="text-xs text-stone-600">{freeShippingGap > 0 ? `Add ${formatPrice(freeShippingGap)} more for free UK delivery` : 'Your order qualifies for free UK delivery'}</p><progress className="mt-2 h-2 w-full accent-stone-800" max="40" value={Math.min(subtotal, 40)} aria-label="Free shipping progress" /></section>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-10 mt-8">
          <section>
            <ul className="divide-y divide-stone-200">{cartItems.map((item) => <li key={item.key} className="grid grid-cols-[96px_minmax(0,1fr)_auto] gap-4 py-5"><img alt={item.title} className="h-24 w-24 object-cover bg-[#F8F5F2]" src={item.image} /><div><p className="text-[10px] uppercase tracking-widest text-stone-500">{item.vendor} · {item.category}</p><a className="block font-semibold text-stone-900 mt-1" href={`/products/${item.handle}`}>{item.title}</a><p className="text-xs text-stone-500 mt-1">{item.description}</p><label className="block mt-3 text-xs text-stone-600">Delivery frequency<select className="ml-2 border border-stone-300 bg-white px-2 py-1" value={item.purchaseType === 'subscription' ? `subscription-${item.frequency}` : 'one-time'} onChange={(event) => onUpdateCartItem(item.key, event.target.value)}><option value="one-time">One-off purchase</option><option value="subscription-30">Every 30 days · 10% off</option><option value="subscription-60">Every 60 days · 10% off</option><option value="subscription-90">Every 90 days · 10% off</option></select></label></div><div className="text-right"><p className="font-semibold">{formatPrice(item.unitPrice * item.quantity)}</p><div className="flex items-center justify-end mt-3 border border-stone-300"><button aria-label={`Decrease ${item.title} quantity`} className="px-2 py-1" onClick={() => onUpdateCartItem(item.key, 'decrease')}>−</button><span className="min-w-7 text-center text-xs">{item.quantity}</span><button aria-label={`Increase ${item.title} quantity`} className="px-2 py-1" onClick={() => onUpdateCartItem(item.key, 'increase')}>+</button></div><button className="mt-2 text-[10px] uppercase tracking-widest underline" onClick={() => onRemove(item.key)}>Remove</button></div></li>)}</ul>
            <a className="inline-block mt-5 text-xs underline underline-offset-4" href="/">← Continue shopping</a>
            <section className="mt-12"><h2 className="font-serif-luxury text-2xl uppercase tracking-widest">Complete the routine</h2><div className="grid sm:grid-cols-2 gap-3 mt-4">{recommendationProducts.map((product) => <div key={product.handle} className="flex items-center gap-3 border border-stone-200 p-3"><img alt={product.title} className="h-16 w-16 object-cover bg-[#F8F5F2]" src={product.image} /><div className="min-w-0 flex-1"><p className="text-xs font-semibold truncate">{product.title}</p><p className="text-xs text-stone-500">{formatPrice(product.price)}</p></div><button aria-label={`Add ${product.title}`} className="border border-stone-300 px-3 py-2" onClick={() => onAddToBag(product, { quantity: 1, purchaseType: 'one-time', frequency: 30 })}>+</button></div>)}</div></section>
          </section>
          <aside className="h-fit border border-stone-200 p-5"><h2 className="text-sm font-semibold uppercase tracking-widest">Order summary</h2><div className="flex justify-between mt-5 text-sm"><span>Subtotal · {cartCount} {cartCount === 1 ? 'item' : 'items'}</span><span>{formatPrice(subtotal)}</span></div><div className="flex justify-between mt-3 text-sm"><span>Delivery</span><span>{subtotal >= 40 ? 'Free' : 'Calculated at checkout'}</span></div><div className="flex justify-between border-t border-stone-200 mt-5 pt-4 font-semibold"><span>Total</span><span>{formatPrice(subtotal)}</span></div><a className="mt-5 flex w-full items-center justify-center bg-stone-900 px-5 py-3 text-xs uppercase tracking-widest text-white" href="/checkout">Checkout securely</a><p className="mt-3 text-[11px] text-stone-500">You’ll earn {Math.floor(subtotal)} points on this order.</p></aside>
        </div>
      </main>
      <StoreFooter />
    </>
  );
}

export function WishlistPage({ cartCount, handles, onToggleWishlist, onAddToBag }) {
  const products = handles.map((handle) => commerceProductByHandle[handle]).filter(Boolean);
  return (
    <>
      <StoreHeader cartCount={cartCount} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="font-serif-luxury text-4xl text-stone-900 mb-8">Wishlist</h1>
        {products.length === 0 ? <div className="py-12 text-center"><p className="text-sm text-stone-600">Your wishlist is empty.</p><a className="inline-block mt-5 border border-stone-900 px-6 py-3 text-xs uppercase tracking-widest" href="/">Continue shopping</a></div> : <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">{products.map((product) => <li key={product.handle}><article className="flex h-full flex-col border border-stone-200 p-3"><img alt={product.title} className="aspect-square w-full object-cover bg-[#F8F5F2]" src={product.image} /><p className="mt-3 text-[10px] uppercase tracking-widest text-stone-500">{product.vendor} · {product.category}</p><h2 className="mt-1 font-semibold">{product.title}</h2><p className="mt-auto pt-4 font-semibold">{formatPrice(product.price)}</p><div className="mt-3 flex gap-2"><button className="flex-1 bg-stone-900 py-2 text-[10px] uppercase tracking-widest text-white" onClick={() => onAddToBag(product, { quantity: 1, purchaseType: 'one-time', frequency: 30 })}>Add to bag</button><button aria-label={`Remove ${product.title} from wishlist`} className="border border-stone-300 px-3" onClick={() => onToggleWishlist(product.handle)}>×</button></div></article></li>)}</ul>}
      </main>
      <StoreFooter />
    </>
  );
}

export function SearchPage({ cartCount, query, onAddToBag }) {
  const [searchTerm, setSearchTerm] = useState(query);
  const normalizedQuery = searchTerm.trim().toLowerCase();
  const products = commerceProducts.filter((product) => !normalizedQuery || `${product.title} ${product.vendor} ${product.category} ${product.description}`.toLowerCase().includes(normalizedQuery));

  return (
    <>
      <StoreHeader cartCount={cartCount} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="font-serif-luxury text-4xl text-stone-900 mb-5">Search</h1>
        <form action="/search" className="flex max-w-xl gap-2" method="get"><input autoFocus className="min-w-0 flex-1 border border-stone-300 px-3 py-3 text-sm" defaultValue={query} name="q" onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search products, ingredients and concerns" type="search" /><button className="bg-stone-900 px-5 text-xs uppercase tracking-widest text-white" type="submit">Search</button></form>
        <p className="mt-8 text-xs text-stone-500">{products.length} products</p>
        {products.length === 0 ? <p className="py-10 text-sm text-stone-600">No products found.</p> : <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-3">{products.map((product) => <li key={product.handle}><article className="flex h-full flex-col border border-stone-200 p-3"><a href={`/products/${product.handle}`}><img alt={product.title} className="aspect-square w-full object-cover bg-[#F8F5F2]" src={product.image} /></a><p className="mt-3 text-[10px] uppercase tracking-widest text-stone-500">{product.vendor} · {product.category}</p><h2 className="mt-1 font-semibold"><a href={`/products/${product.handle}`}>{product.title}</a></h2><p className="mt-auto pt-4 font-semibold">{formatPrice(product.price)}</p><button className="mt-3 border border-stone-800 py-2 text-[10px] uppercase tracking-widest" onClick={() => onAddToBag(product, { quantity: 1, purchaseType: 'one-time', frequency: 30 })}>Add to bag</button></article></li>)}</ul>}
      </main>
      <StoreFooter />
    </>
  );
}

export function CheckoutPage({ cartCount, cartItems }) {
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [paymentNotice, setPaymentNotice] = useState('');
  const subtotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const deliveryPrices = { standard: 2.95, heavy: 4.95, tracked: 5.95 };
  const delivery = subtotal >= 40 ? 0 : deliveryPrices[deliveryMethod];

  if (cartItems.length === 0) return <><StoreHeader cartCount={cartCount} /><main className="max-w-4xl mx-auto px-4 py-16 text-center"><h1 className="font-serif-luxury text-4xl">Your bag is empty</h1><a className="inline-block mt-6 underline" href="/">Continue shopping</a></main><StoreFooter /></>;

  return (
    <>
      <StoreHeader cartCount={cartCount} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="font-serif-luxury text-4xl text-stone-900 mb-8">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-10">
          <form className="space-y-8" onSubmit={(event) => { event.preventDefault(); setPaymentNotice('Secure payment is not connected in this preview. Your bag is saved; no order was placed.'); }}>
            <section><h2 className="text-sm font-semibold uppercase tracking-widest mb-4">Contact</h2><label className="block text-xs text-stone-600">Email<input className="mt-2 w-full border border-stone-300 px-3 py-3 text-sm" name="email" required type="email" /></label><label className="mt-3 flex items-center gap-2 text-xs text-stone-600"><input type="checkbox" />Email me new arrivals and offers <span className="text-stone-400">Optional. Unsubscribe any time.</span></label></section>
            <section><h2 className="text-sm font-semibold uppercase tracking-widest mb-4">Delivery address</h2><div className="grid sm:grid-cols-2 gap-3"><label className="text-xs text-stone-600">First name<input className="mt-2 w-full border border-stone-300 px-3 py-3 text-sm" name="firstName" required /></label><label className="text-xs text-stone-600">Last name<input className="mt-2 w-full border border-stone-300 px-3 py-3 text-sm" name="lastName" required /></label><label className="sm:col-span-2 text-xs text-stone-600">Address line 1<input className="mt-2 w-full border border-stone-300 px-3 py-3 text-sm" name="address" required /></label><label className="sm:col-span-2 text-xs text-stone-600">Address line 2 (optional)<input className="mt-2 w-full border border-stone-300 px-3 py-3 text-sm" name="address2" /></label><label className="text-xs text-stone-600">City<input className="mt-2 w-full border border-stone-300 px-3 py-3 text-sm" name="city" required /></label><label className="text-xs text-stone-600">Postcode<input className="mt-2 w-full border border-stone-300 px-3 py-3 text-sm" name="postcode" required /></label><label className="text-xs text-stone-600">Phone (optional)<input className="mt-2 w-full border border-stone-300 px-3 py-3 text-sm" name="phone" type="tel" /></label></div></section>
            <fieldset><legend className="text-sm font-semibold uppercase tracking-widest mb-4">Delivery method</legend><div className="space-y-2">{[['standard', 'Standard Delivery', '3–5 working days', 2.95], ['heavy', 'Standard Delivery (Heavy)', '3–5 working days', 4.95], ['tracked', 'Royal Mail Tracked 24', '1–2 working days', 5.95]].map(([value, label, timing, price]) => <label key={value} className="flex items-center justify-between border border-stone-200 p-3 text-sm"><span className="flex items-center gap-3"><input checked={deliveryMethod === value} name="delivery" onChange={() => setDeliveryMethod(value)} type="radio" /><span>{label}<span className="block text-xs text-stone-500">{timing}</span></span></span><strong>{subtotal >= 40 ? 'Free' : formatPrice(price)}</strong></label>)}</div></fieldset>
            <section><h2 className="text-sm font-semibold uppercase tracking-widest mb-3">Payment</h2><p className="text-sm text-stone-600 mb-4">Card details are entered after you continue. No payment will be taken in this preview.</p><button className="w-full bg-stone-900 px-5 py-3 text-xs uppercase tracking-widest text-white" type="submit">Continue to payment</button>{paymentNotice && <p className="mt-3 text-sm text-stone-600" role="status">{paymentNotice}</p>}</section>
          </form>
          <aside className="h-fit border border-stone-200 p-5"><h2 className="text-sm font-semibold uppercase tracking-widest">Order summary</h2><ul className="divide-y divide-stone-200 my-4">{cartItems.map((item) => <li key={item.key} className="flex justify-between gap-3 py-3 text-xs"><span>{item.title} × {item.quantity}</span><span>{formatPrice(item.unitPrice * item.quantity)}</span></li>)}</ul><div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div><div className="flex justify-between mt-3 text-sm"><span>Delivery</span><span>{delivery === 0 ? 'Free' : formatPrice(delivery)}</span></div><div className="flex justify-between border-t border-stone-200 mt-4 pt-4 font-semibold"><span>Total</span><span>{formatPrice(subtotal + delivery)}</span></div></aside>
        </div>
      </main>
      <StoreFooter />
    </>
  );
}