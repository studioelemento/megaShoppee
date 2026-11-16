const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';
export type Application = { id: string; name: string; storeSlug: string; type: 'INDIVIDUAL'|'BUSINESS'; mobile: string; email?: string; gstRegistered: boolean; gstin?: string };
export async function submitApplication(data: Application) {
  const response = await fetch(`${API_BASE}/vendor-applications`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.message || 'Application could not be submitted');
  return payload as { id: string; name: string; storeSlug: string; status: string };
}
export async function checkApi() {
  const response = await fetch(`${API_BASE}/health`);
  if (!response.ok) throw new Error('API unavailable');
  return response.json() as Promise<{status:string;database:string}>;
}
