const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';

export type Category = { id: string; name: string; slug: string };
export type Product = {
  id: string; title: string; slug: string; description?: string | null;
  regularPrice: string | number; salePrice?: string | number | null; stock: number;
  images?: unknown; vendor: { name: string; storeSlug: string };
  category: { name: string; slug: string };
};

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) throw new Error(`API request failed (${response.status})`);
  return response.json() as Promise<T>;
}
export const getCategories = () => request<Category[]>('/catalog/categories');
export const getProducts = (q = '') => request<Product[]>(`/catalog/products?take=24${q ? `&q=${encodeURIComponent(q)}` : ''}`);
export const getHealth = () => request<{status:string;database:string}>('/health');
