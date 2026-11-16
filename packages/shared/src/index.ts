export type AppRole = 'CUSTOMER' | 'VENDOR' | 'ADMIN';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED';
export type OrderStatus = 'NEW' | 'PROCESSING' | 'READY_TO_DISPATCH' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED' | 'RETURN_REQUESTED' | 'RETURNED';
export type Money = { amountPaise: number; currency: 'INR' };
export const BRAND = { navy: '#102A43', blue: '#2563EB', white: '#FFFFFF', softBlue: '#EFF6FF', yellow: '#F5C542', slate: '#334155' } as const;
export const formatINR = (paise: number) => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2}).format(paise/100);
