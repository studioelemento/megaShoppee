# Prisma migrations

This development package initializes a fresh local database using `pnpm db:push` from the repository root. The schema source of truth is `schema.prisma`.

Before production, generate and commit reviewed migration SQL from a clean development database:

```bash
pnpm --filter @megashoppee/api exec prisma migrate dev --name initial
```

Then deploy schema changes with:

```bash
pnpm --filter @megashoppee/api exec prisma migrate deploy
```

Do not use `db push` as the production deployment migration strategy.
