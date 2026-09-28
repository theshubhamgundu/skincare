import { useEffect, useState } from 'react';
import { StoreFooter, StoreHeader } from '../components/StoreChrome.jsx';

function FilterPanel({
  availableCount,
  inStockOnly,
  maxPrice,
  minPrice,
  onAvailabilityChange,
  onMaxPriceChange,
  onMinPriceChange,
  totalCount,
}) {
  return (
    <div className="border-b border-stone-200 bg-[#FCFAF7] px-5 py-6 mb-6" aria-label="Filters">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-900 mb-5">Filters</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <fieldset>
          <legend className="text-xs font-semibold text-stone-900 mb-3">Availability</legend>
          <label className="flex items-center gap-2 text-xs text-stone-600 cursor-pointer">
            <input checked={inStockOnly} onChange={(event) => onAvailabilityChange(event.target.checked)} type="checkbox" className="h-3.5 w-3.5 border-stone-400 text-stone-900 focus:ring-stone-700" />
            <span>In stock</span><span className="text-stone-400">{availableCount}</span>
          </label>
        </fieldset>
        <fieldset>
          <legend className="text-xs font-semibold text-stone-900 mb-3">Price</legend>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1 text-xs text-stone-600">£<input aria-label="Minimum price" className="w-20 border border-stone-300 px-2 py-1" min="0" onChange={(event) => onMinPriceChange(Number(event.target.value))} type="number" value={minPrice} /></label>
            <span className="text-stone-400">to</span>
            <label className="flex items-center gap-1 text-xs text-stone-600">£<input aria-label="Maximum price" className="w-20 border border-stone-300 px-2 py-1" min="0" onChange={(event) => onMaxPriceChange(Number(event.target.value))} type="number" value={maxPrice} /></label>
          </div>
        </fieldset>
        <p className="self-end text-xs text-stone-500">{totalCount} products in this collection</p>
      </div>
    </div>
  );
}

export default function CategoryPage({ category, cartCount, onAddToBag }) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [products, setProducts] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortOrder, setSortOrder] = useState('featured');

  useEffect(() => {
    let active = true;
    setProducts(null);
    setLoadError(false);
    fetch(`https://skinofkorea.co.uk/collections/${category.handle}/products.json?limit=250`)
      .then((response) => {
        if (!response.ok) throw new Error('Collection request failed');
        return response.json();
      })
      .then((data) => {
        if (active) setProducts(data.products);
      })
      .catch(() => {
        if (active) {
          setProducts([]);
          setLoadError(true);
        }
      });
    return () => { active = false; };
  }, [category.handle]);

  const availableCount = products?.filter((item) => item.variants.some((variant) => variant.available)).length ?? 0;
  const visibleProducts = (products ?? []).filter((item) => {
    const available = item.variants.some((variant) => variant.available);
    const price = Number(item.variants[0]?.price ?? 0);
    return (!inStockOnly || available) && price >= minPrice && price <= maxPrice;
  }).sort((first, second) => {
    const firstPrice = Number(first.variants[0]?.price ?? 0);
    const secondPrice = Number(second.variants[0]?.price ?? 0);
    if (sortOrder === 'low-to-high') return firstPrice - secondPrice;
    if (sortOrder === 'high-to-low') return secondPrice - firstPrice;
    return 0;
  });

  return (
    <>
      <StoreHeader cartCount={cartCount} />
      <main id="main" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <nav className="text-xs text-stone-500 mb-10" aria-label="Breadcrumb"><a href="/">Home</a><span className="mx-2">/</span><span>{category.title}</span></nav>
        <div className="text-center mb-10">
          <h1 className="font-serif-luxury text-4xl sm:text-5xl uppercase tracking-[0.12em] font-normal text-stone-900 mb-4">{category.title}</h1>
          {category.description && <p className="text-sm text-stone-600 font-light leading-relaxed max-w-2xl mx-auto">{category.description}</p>}
        </div>
        <section>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4 mb-0 text-xs">
              <p><strong>{products === null ? '…' : visibleProducts.length}</strong> products</p>
              <div className="flex flex-wrap items-center justify-end gap-3">
                <button aria-controls="collection-filters" aria-expanded={filtersOpen} className="border border-stone-800 px-4 py-2 uppercase tracking-widest hover:bg-stone-900 hover:text-white" onClick={() => setFiltersOpen((open) => !open)} type="button">Filters</button>
                <label className="flex items-center gap-2">Sort by<select className="border border-stone-300 bg-white px-3 py-2" onChange={(event) => setSortOrder(event.target.value)} value={sortOrder}><option value="featured">Featured</option><option value="low-to-high">Price: low to high</option><option value="high-to-low">Price: high to low</option></select></label>
              </div>
            </div>
            {filtersOpen && <div className="mt-6" id="collection-filters"><FilterPanel availableCount={availableCount} inStockOnly={inStockOnly} maxPrice={maxPrice} minPrice={minPrice} onAvailabilityChange={setInStockOnly} onMaxPriceChange={setMaxPrice} onMinPriceChange={setMinPrice} totalCount={products?.length ?? 0} /></div>}
            {loadError ? <p className="py-10 text-sm text-stone-600" role="status">Products could not be loaded right now. Please try again later.</p> : products === null ? <p className="py-10 text-sm text-stone-600" role="status">Loading products…</p> : visibleProducts.length === 0 ? <p className="py-10 text-sm text-stone-600">No products found.</p> : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 pt-6" aria-label={`${category.title} products`}>
                {visibleProducts.map((item) => {
                  const available = item.variants.some((variant) => variant.available);
                  const price = item.variants[0]?.price;
                  const brand = item.vendor === 'Skin Of Korea' ? 'MIIKOREAN' : item.vendor;
                  return <li key={item.id}><article className="flex flex-col bg-white border border-stone-100 p-3 h-full"><div className="relative aspect-square bg-[#F8F5F2] overflow-hidden mb-3">{item.images[0]?.src && <img alt={item.title} className="w-full h-full object-cover" src={item.images[0].src} />}</div><p className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold mb-1">{brand} · {item.product_type}</p><h2 className="text-sm font-semibold text-stone-900 leading-snug mb-2"><a className="hover:underline" href={`/products/${item.handle}`}>{item.title}</a></h2><p className="text-sm font-semibold text-stone-900 mb-3 mt-auto">£{price}</p><button disabled={!available} onClick={() => onAddToBag(item)} className="w-full border border-stone-800 text-[10px] tracking-widest uppercase font-semibold py-2 hover:bg-stone-900 hover:text-white transition disabled:border-stone-300 disabled:text-stone-500 disabled:hover:bg-transparent disabled:hover:text-stone-500 disabled:cursor-not-allowed">{available ? 'Add to bag' : 'Sold out'}</button></article></li>;
                })}
              </ul>
            )}
        </section>
      </main>
      <StoreFooter />
    </>
  );
}