# Crunchify handover

[Live site](https://crunchify.vercel.app/) · [Staff sign-in](https://crunchify.vercel.app/admin/login) · [Source repository](https://github.com/Lester0961/crunchify-trial)

The repository is private. Mathew’s GitHub access is pending his account details. Share staff credentials separately from the repository.

## Work with an inquiry

1. Sign in and use the search, type, and status filters to find the inquiry.
2. Open the record to see the contact details, selected products or collaboration type, message, and source information.
3. Update the status or add a note. The detail page shows the recent changes made through the shared staff account.
4. Check the email panel for the sender confirmation and team notification. “Accepted by provider” records Brevo’s response. Check Brevo’s delivery history when delivery is uncertain, then use **Retry pending emails** for the messages that still need attention.

Both forms use the same branded email layout. The trial’s team notification goes to the configured temporary address. Set `MAIL_FROM` and `INQUIRY_NOTIFICATION_TO` to the company’s verified sender and team address when those are available.

## Maintain the deployment

- Vercel builds the app from `web/`. Follow the [release notes](PRODUCTION-RELEASE.md) for the live build and rollback point.
- Supabase hosts PostgreSQL. Preview and Production use separate schemas and credentials in the same database. The [setup guide](../web/README.md#environment-variables) lists the connection variables.
- Confirm account ownership and rotate staff and database credentials as part of the company handover. Review the legacy rollback connection and earlier deployments when transferring access.
- Use the [backup guide](BACKUP-RESTORE.md) for backups and recovery. The current encrypted live copy belongs to the development Windows account.

The [trial status](REQUIREMENTS-TRACEABILITY.md) lists what is ready for review and what needs company input.
