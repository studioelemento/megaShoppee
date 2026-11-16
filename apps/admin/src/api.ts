const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';
export type Overview = { vendors:number; pendingVendors:number; products:number; pendingProducts:number; orders:number; openTickets:number; customers:number };
export async function getOverview(key: string): Promise<Overview> {
  const response = await fetch(`${API_BASE}/admin/overview`, { headers: { 'x-admin-api-key': key } });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.message || 'Admin API access denied');
  return payload;
}
