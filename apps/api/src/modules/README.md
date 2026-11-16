# API module map

The API is wired to the Prisma service registered in `AppModule`.

- `PrismaService` extends PrismaClient, connects on Nest startup and disconnects on shutdown.
- `HealthController` performs a real `SELECT 1` against MySQL.
- `CatalogController` serves categories/products with explicit public field selection.
- `VendorApplicationsController` validates and persists new vendor applications.
- `AdminController` serves overview/vendor records behind `AdminApiKeyGuard`.
- `CreateVendorApplicationDto` enforces runtime request validation.

The admin API key is a temporary development gate, not production authentication. Replace it with user accounts, hashed credentials, JWT/session lifecycle, role and ownership guards, MFA for privileged actions, rate limits and audit logging before launch. Vendor application listing and admin overview are not public.
