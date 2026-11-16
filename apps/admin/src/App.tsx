import { useState, type FormEvent } from 'react';
import { Activity, ShieldCheck, RefreshCw } from 'lucide-react';
import { getOverview, type Overview } from './api';

export default function App() {
  const [key,setKey] = useState('');
  const [data,setData] = useState<Overview|null>(null);
  const [error,setError] = useState('');
  const [busy,setBusy] = useState(false);
  async function connect(e?: FormEvent) {
    e?.preventDefault(); setBusy(true); setError('');
    try { setData(await getOverview(key)); } catch(err) { setData(null); setError(err instanceof Error?err.message:'Could not connect'); }
    finally { setBusy(false); }
  }
  return <div className="app"><aside className="sidebar"><strong>MEGASHOPPEE<span>CONTROL</span></strong><small>OPERATIONS</small><a className="active">▦　Dashboard</a><a>♙　Vendors</a><a>◇　Products</a><a>▣　Orders</a><a>₹　Finance & payouts</a><a>▤　Inventory</a><div className="side-bottom">Development admin console</div></aside>
    <main className="workspace"><div className="welcome"><div><span className="eyebrow">MARKETPLACE OVERVIEW</span><h1>Control centre</h1><p>Live counts retrieved from the Megashoppee API and MySQL database.</p></div><Activity size={34}/></div>
      <div className="notice"><b><ShieldCheck size={17}/> Protected development endpoint</b><p>Enter the server-side ADMIN_API_KEY configured in apps/api/.env. It is not bundled into the frontend. This temporary key gate must be replaced with full admin authentication and role permissions before production.</p></div>
      <form className="admin-connect" onSubmit={connect}><input type="password" value={key} onChange={e=>setKey(e.target.value)} placeholder="Admin API key" required/><button disabled={busy}>{busy?'Connecting…':'Load live overview'}</button></form>
      {error && <div className="notice error">{error}</div>}
      {data && <><div className="api-status"><span className="dot"/>Live database data loaded</div><div className="stats">
        {[[ 'Total vendors',data.vendors ],['Pending vendors',data.pendingVendors],['Total products',data.products],['Pending product approvals',data.pendingProducts],['Total orders',data.orders],['Open support tickets',data.openTickets],['Customers',data.customers]].map(([label,value])=><article key={String(label)}><small>{label}</small><h2>{Number(value).toLocaleString('en-IN')}</h2><span>Live database count</span></article>)}
      </div><button className="refresh" onClick={()=>void connect()}><RefreshCw size={15}/> Refresh data</button></>}
    </main></div>;
}
