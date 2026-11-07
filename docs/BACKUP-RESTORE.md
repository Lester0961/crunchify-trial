# Database backup and restore

The application stores inquiries in `crunchify_private`. On 5 November 2026, an encrypted live backup was created under `%LOCALAPPDATA%\Crunchify\Backups`. Its listing showed all five application tables. A separate synthetic archive was restored to a disposable database and checked for products, inquiries, history, and sessions. A restore rehearsal for the live archive remains pending.

On the configured Windows account, run `node scripts/backup-production.mjs` from `web/` with PostgreSQL 18 client tools. The script uses a read-only database credential, verifies the server certificate, encrypts the archive, and checks that it can be listed. Its archive limit is 64 MiB.

The local backup and its credential are protected by Windows DPAPI for the development account. Arrange company-controlled encrypted storage, retention, and recovery access before relying on backups for a permanent service.

## Backup

1. Positively identify the source database and use a PostgreSQL client version compatible with its server. Supply connection details through a protected credential mechanism such as `PGPASSFILE` and individual `PGHOST`, `PGPORT`, `PGUSER`, and `PGDATABASE` environment variables. Avoid placing the password or connection URL in shell history or command arguments. Use a direct or session-pooler connection suitable for backup; confirm availability and TLS requirements with the provider.
2. Back up the application schema with `pg_dump --format=custom --schema=crunchify_private --file=/secure/location/crunchify.dump`. Keep the dump in encrypted, access-controlled storage, with a timestamp and documented retention. A schema-only backup does not contain inquiry data; use the full command shown.
3. Confirm that the dump can be listed with `pg_restore --list /secure/location/crunchify.dump`. Listing verifies the archive can be read, not that a restore is successful.

## Restore rehearsal

1. Create a new, separate disposable database. Confirm its identity before proceeding; never rehearse a restore over production.
2. Configure protected connection variables for that database and run `pg_restore --no-owner --exit-on-error --dbname=DISPOSABLE_DATABASE /secure/location/crunchify.dump`.
3. Compare product and inquiry counts with the backup record, inspect representative records only where authorized, and exercise the application against the restored database using synthetic test inquiries and a non-production email recipient. Confirm permissions and migrations as well as data.
4. Record the test date, backup timestamp, target, results and responsible owner. Securely remove the disposable database and temporary copy according to the company’s policy.

For a real recovery, stop or coordinate writes first. Assess changes made after the backup and reconcile them rather than replacing newer inquiry records with an older snapshot. Document the approved recovery point and communicate the outcome to the operational owner.

The archive deliberately omits ownership and privileges, so recreate and verify restricted roles, grants, and any row-security policies on the chosen destination before exposing the application. Restoring an old `admin_sessions` table can revive unexpired sessions from the backup: as part of an approved recovery, invalidate restored sessions and rotate the admin session secret before reopening staff access. Rehearse these actions on a separate database first.
