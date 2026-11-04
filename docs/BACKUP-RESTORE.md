# Database backup and restore

The application stores inquiries in the `crunchify_private` PostgreSQL schema. Supabase Free does not include automatic database backups; manual or separately scheduled backups are required. Backups contain private contact information and must be encrypted, access-controlled, retained under the company’s policy and removed when that policy requires. Assign an owner to monitor backup success and perform restoration rehearsals. Do not place dumps, connection strings or passwords in Git or shared logs.

On 4 November 2026, the schema was backed up and restored using PostgreSQL 18 tools in an isolated local PostgreSQL instance with synthetic data. The restored database contained the expected four products and one synthetic inquiry. This was not a backup or restore of the live database and does not establish scheduled production backups.

On 5 November 2026 Manila time, a live schema backup was encrypted on this Windows account at `%LOCALAPPDATA%\Crunchify\Backups`; its archive listing was verified. A separate synthetic encrypted archive restored successfully to a disposable local database (four products, one inquiry). The live archive has not been restored. The backup role can read the application tables but cannot insert, update, or delete inquiries. Its credential and the archive use Windows DPAPI for the current user: they may become inaccessible if this Windows profile or machine is lost. This is a manual local copy, not an off-device or scheduled backup. Agree a company-controlled encrypted destination, recovery credentials, retention, monitoring, and a restore rehearsal before relying on it.

To create another local encrypted copy on this configured Windows account, run `node scripts/backup-production.mjs` from `web/` with PostgreSQL 18 client tools installed. The script uses the restricted credential, verifies the server certificate, encrypts the archive in memory, and verifies its listing. It fails if the archive exceeds 64 MiB. Do not commit the encrypted credential or archives; losing the Windows profile can make both unusable.

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
