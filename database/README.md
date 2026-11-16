# MySQL Workbench setup

Full install and connection guide: see the root [`readme.md`](../readme.md).

## What this folder is for

MySQL Workbench is a **client** (a window to talk to MySQL). It is not the database engine.

A **running MySQL Server** is required (on Windows this is often the service **MySQL80**, port **3306**).

The file `mysql-workbench-setup.sql` creates:

- an empty database named `megashoppee`
- a MySQL login named `megashoppee_app` with a password

It does **not** create application tables (`product`, `order`, and so on). Prisma creates those when you run `pnpm db:push` from the `megashoppee` project folder.

## How this fits the app

```text
Workbench (you, once)
  runs mysql-workbench-setup.sql
        │
        ▼
MySQL Server
  database: megashoppee
  user:     megashoppee_app + password
        ▲
        │  apps/api/.env  →  DATABASE_URL
        │
API (every time you run pnpm dev or pnpm db:push)
```

Workbench and the API use the **same MySQL Server**. Workbench is only for setup and inspection. The API logs in using `DATABASE_URL` in `apps/api/.env`.

## What to do in MySQL Workbench

1. Start **MySQL Server** if it is not running (Windows: Services → **MySQL80** → Running).
2. Open **MySQL Workbench**.
3. Connect to your local instance (for example **Local instance MySQL80**) using an account that can create databases and users (usually **root**).
4. **File → Open SQL Script**.
5. Open `mysql-workbench-setup.sql` from this folder.
6. Optional: change every `'ChangeThisStrongPassword'` to a password you choose. Use that **same** password in `apps/api/.env`.
7. Click **Execute** (lightning bolt) so the **whole** script runs, not a single line.
8. Check the **Output** pane for errors (access denied means you are not connected as an admin user).
9. In the left **Schemas** panel, click **refresh**.
10. Confirm database **`megashoppee`** is listed. Expand it later after `pnpm db:push` to see **Tables**.

Do not run other queries from old projects (`DROP DATABASE`, `USE cafe_pos`, and similar) in this tab.

## What the script does (how it works)

| SQL in the script | Effect |
|-------------------|--------|
| `CREATE DATABASE ... megashoppee` | Creates an empty named database (a container). No tables yet. |
| `CREATE USER ... megashoppee_app` | Creates a login the **API** will use (not root). |
| `IDENTIFIED BY '...'` | Sets that user’s password. |
| `GRANT ... ON megashoppee.*` | Allows that user to use only the `megashoppee` database. |
| `FLUSH PRIVILEGES` | Applies the grants immediately. |
| `SHOW DATABASES LIKE 'megashoppee'` | Confirms the database exists. |

The username, password, and database name in this script must match `DATABASE_URL`:

```env
DATABASE_URL="mysql://megashoppee_app:ChangeThisStrongPassword@127.0.0.1:3306/megashoppee"
```

| URL part | From this SQL |
|----------|----------------|
| `megashoppee_app` | `CREATE USER` |
| password | `IDENTIFIED BY` |
| `megashoppee` | `CREATE DATABASE` |
| `127.0.0.1:3306` | Your local MySQL Server (not in the script; default host/port) |

## After Workbench (not in this folder)

From the **`megashoppee`** project folder (parent of `database/`):

```bash
pnpm db:push
```

That uses `DATABASE_URL`, connects as `megashoppee_app`, and creates tables. Then refresh Workbench → **megashoppee → Tables**.
