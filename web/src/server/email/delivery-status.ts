import type { Pool } from "pg";

/** Keep an accepted status if a later or overlapping attempt fails. */
export async function updateDeliveryStatus(
  db: Pick<Pool, "query">,
  schema: string,
  id: string,
  delivery: { sender: boolean; company: boolean },
) {
  await db.query(
    `UPDATE ${schema}.inquiries SET
       sender_email_status = CASE
         WHEN sender_email_status = 'accepted' OR $2::boolean THEN 'accepted'
         ELSE 'failed'
       END,
       company_email_status = CASE
         WHEN company_email_status = 'accepted' OR $3::boolean THEN 'accepted'
         ELSE 'failed'
       END
     WHERE id = $1`,
    [id, delivery.sender, delivery.company],
  );
}
