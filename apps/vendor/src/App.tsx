import { useEffect, useState, type FormEvent } from 'react';
import { Store, Send, RefreshCw } from 'lucide-react';
import { checkApi, submitApplication } from './api';

export default function App() {
  const [apiStatus, setApiStatus] = useState('Checking API…');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ name:'', storeSlug:'', type:'BUSINESS' as 'BUSINESS'|'INDIVIDUAL', mobile:'', email:'', gstRegistered:false, gstin:'' });
  useEffect(() => { checkApi().then(x=>setApiStatus(`API connected · MySQL ${x.database}`)).catch(()=>setApiStatus('API unavailable')); }, []);
  const update = (key: string, value: string | boolean) => setForm(old=>({...old,[key]:value}));
  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true); setMessage('');
    try {
      const result = await submitApplication(form);
      setMessage(`Application submitted. Reference: ${result.id}. Status: ${result.status}.`);
      setForm({name:'',storeSlug:'',type:'BUSINESS',mobile:'',email:'',gstRegistered:false,gstin:''});
    } catch (err) { setMessage(err instanceof Error ? err.message : 'Submission failed'); }
    finally { setBusy(false); }
  }
  return <div className="app"><aside className="sidebar"><strong>MEGASHOPPEE<span>SELLER</span></strong><small>SELLER PORTAL</small><a className="active">▦　Apply to sell</a><div className="side-bottom">Vendor onboarding</div></aside>
    <main className="workspace"><div className="welcome"><div><span className="eyebrow">VENDOR ONBOARDING</span><h1>Start selling on Megashoppee</h1><p>Submit your initial store application for admin verification.</p></div><Store size={34}/></div>
      <div className="api-status"><span className={apiStatus.includes('connected')?'dot':'dot bad'}/>{apiStatus} <button className="text-button" onClick={()=>checkApi().then(x=>setApiStatus(`API connected · MySQL ${x.database}`)).catch(()=>setApiStatus('API unavailable'))}><RefreshCw size={14}/> Retry</button></div>
      <form className="panel application-form" onSubmit={submit}><h2>Store application</h2><p className="muted">This submits a pending application to the backend database. Document uploads, verification and vendor login are not part of this initial connected build.</p>
        <label>Seller / business name<input required minLength={2} value={form.name} onChange={e=>update('name',e.target.value)} placeholder="Your name or registered business name"/></label>
        <label>Store URL name<input required minLength={3} value={form.storeSlug} onChange={e=>update('storeSlug',e.target.value)} placeholder="my-store"/></label>
        <label>Seller type<select value={form.type} onChange={e=>update('type',e.target.value)}><option value="BUSINESS">Business</option><option value="INDIVIDUAL">Individual</option></select></label>
        <label>Mobile number<input required pattern="[6-9][0-9]{9}" maxLength={10} value={form.mobile} onChange={e=>update('mobile',e.target.value)} placeholder="10-digit Indian mobile"/></label>
        <label>Email (optional)<input type="email" value={form.email} onChange={e=>update('email',e.target.value)} placeholder="you@example.com"/></label>
        <label className="check"><input type="checkbox" checked={form.gstRegistered} onChange={e=>update('gstRegistered',e.target.checked)}/> I have GST registration</label>
        {form.gstRegistered && <label>GSTIN<input required minLength={15} maxLength={15} value={form.gstin} onChange={e=>update('gstin',e.target.value.toUpperCase())}/></label>}
        <button disabled={busy} type="submit"><Send size={16}/>{busy?'Submitting…':'Submit application'}</button>
        {message && <div className="notice">{message}</div>}
      </form>
    </main></div>;
}
