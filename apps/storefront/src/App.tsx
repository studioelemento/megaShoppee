import { useEffect, useMemo, useState } from 'react';
import { Search, ShoppingBag, Store, RefreshCw } from 'lucide-react';
import { getCategories, getProducts, getHealth, type Category, type Product } from './api';

const money = (value: string | number | null | undefined) =>
  `₹${Number(value ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

export default function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Connecting to marketplace API…');
  const [error, setError] = useState('');

  async function load(search = '') {
    setError('');
    try {
      const [cats, items, health] = await Promise.all([getCategories(), getProducts(search), getHealth()]);
      setCategories(cats); setProducts(items);
      setStatus(`API connected · MySQL ${health.database}`);
    } catch {
      setStatus('API not connected');
      setError('Could not load live marketplace data. Start MySQL and the API, then refresh this page.');
    }
  }
  useEffect(() => { void load(); }, []);

  const hasProducts = useMemo(() => products.length > 0, [products]);
  return <div className="app">
    <header><div className="top">
      <strong>MEGASHOPPEE</strong>
      <form className="search" onSubmit={(e) => { e.preventDefault(); void load(query); }}>
        <Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search products and stores"/>
        <button type="submit">Search</button>
      </form>
      <button className="outline" onClick={() => void load()}><RefreshCw size={15}/> Refresh</button>
      <button className="cart"><ShoppingBag size={16}/> Cart · 0</button>
    </div><nav>{categories.map(c=><a key={c.id} href={`#${c.slug}`}>{c.name}</a>)}</nav></header>
    <main>
      <div className="api-status"><span className={error?'dot bad':'dot'}/>{status}</div>
      {error && <div className="notice error">{error} <code>http://localhost:4000/api/v1/health</code></div>}
      <section className="hero"><div><span className="eyebrow">THE MARKETPLACE FOR EVERYDAY INDIA</span><h1>Good finds.<br/><em>Great prices.</em></h1><p>Explore products from independent stores and trusted sellers across India.</p><a className="primary-link" href="#products">Explore marketplace</a></div><div className="hero-art"><div className="orb">✦</div><div className="tag">Discover something new</div></div></section>
      <section><div className="section-head"><div><span className="eyebrow">EXPLORE</span><h2>Shop by category</h2></div></div>
        <div className="categories">{categories.map((c,i)=><a className="category" key={c.id} id={c.slug} href={`#products`}><div className="category-icon">{['⌘','✳','⌂','♧','✿','◉'][i%6]}</div><b>{c.name}</b><small>Explore collection</small></a>)}
        {!categories.length && !error && <p>Categories will appear here once seeded.</p>}</div>
      </section>
      <section id="products"><div className="section-head"><div><span className="eyebrow">LIVE FROM YOUR DATABASE</span><h2>Latest products</h2></div><span>{products.length} products</span></div>
        <div className="product-grid">{products.map(p=><article className="product-card" key={p.id}>
          <div className="product-image"><ShoppingBag size={32}/></div><div className="product-info"><small>{p.category?.name}</small><h3>{p.title}</h3><p className="vendor"><Store size={13}/> {p.vendor?.name}</p><div className="price">{money(p.salePrice ?? p.regularPrice)} {p.salePrice && <del>{money(p.regularPrice)}</del>}</div><small>{p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}</small></div>
        </article>)}</div>
        {!hasProducts && !error && <div className="empty">No active products yet. Run the database seed command to add a demo listing.</div>}
      </section>
    </main><footer>© 2026 Megashoppee <span>Shop smarter. Support local.</span></footer>
  </div>;
}
