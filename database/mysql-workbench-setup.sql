-- Megashoppee local MySQL setup for MySQL Workbench
-- Run this script in a local MySQL Server connection using an account with
-- permission to CREATE DATABASE, CREATE USER and GRANT privileges.
--
-- Change the password below to a strong local development password.
-- Use the same password in apps/api/.env (DATABASE_URL).

CREATE DATABASE IF NOT EXISTS megashoppee
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'megashoppee_app'@'localhost'
  IDENTIFIED BY 'ChangeThisStrongPassword';

CREATE USER IF NOT EXISTS 'megashoppee_app'@'127.0.0.1'
  IDENTIFIED BY 'ChangeThisStrongPassword';

ALTER USER 'megashoppee_app'@'localhost'
  IDENTIFIED BY 'ChangeThisStrongPassword';
ALTER USER 'megashoppee_app'@'127.0.0.1'
  IDENTIFIED BY 'ChangeThisStrongPassword';

GRANT ALL PRIVILEGES ON megashoppee.* TO 'megashoppee_app'@'localhost';
GRANT ALL PRIVILEGES ON megashoppee.* TO 'megashoppee_app'@'127.0.0.1';

FLUSH PRIVILEGES;

-- Verify the database exists:
SHOW DATABASES LIKE 'megashoppee';
