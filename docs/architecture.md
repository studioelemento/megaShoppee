# Megashoppee architecture and domain notes

## Runtime topology
Three Vite/React applications are deployed independently and communicate with a NestJS REST API. The API is a modular monolith. MySQL is the source of truth. Prisma migrations are version-controlled.

## Core order model
A customer checkout should create one `Order` parent and one `VendorSuborder` per participating vendor. Each suborder owns its fulfilment lifecycle, items, shipping, commission and vendor payable. Payment confirmation must be webhook-driven. Stock reservation, order creation, ledger postings and payment state changes must be transaction-safe and idempotent.

## Commission calculation
Use the effective commission in this order: vendor override, category override, global default. Calculate commission on discounted product value actually paid, excluding shipping and applicable tax. Keep rounding policy explicit and covered by tests.

## Product approval versioning
`approvedSnapshot` is the live approved version. `pendingSnapshot` holds a proposed edit. A pending edit must not replace the live version until an admin approves it. Rejection clears or retains the pending snapshot for audit according to the final workflow decision.

## Security boundaries
Public catalog routes may return only active, approved data. Vendor routes must scope every query to the authenticated vendor ID. Admin routes require admin guards. Never trust IDs, prices, commission values, payment state, role or ownership supplied by a browser. All finance, approval, status and bank-detail changes need audit events.

## Deployment
Build each frontend independently and map the build output to its subdomain. Run the API behind HTTPS with environment secrets supplied by the host. Keep MySQL private. Use object storage for product/KYC files rather than storing binary data in MySQL.
