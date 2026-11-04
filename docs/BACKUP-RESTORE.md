# Database backup and restore

The application stores inquiries in the `crunchify_private` PostgreSQL schema. Backups contain private contact information and must be encrypted, access-controlled, retained under the company’s policy and removed when that policy requires. Assign an owner to monitor backup success and perform restoration rehearsals. Do not place dumps, connection strings or passwords in Git or shared logs.

On 4 November 2026, the schema was backed up and restored using PostgreSQL 18 tools in an isolated local PostgreSQL instance with synthetic data. The restored database contained the expected four products and one synthetic inquiry. This was not a backup or restore of the live database and does not establish scheduled production backups.

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
