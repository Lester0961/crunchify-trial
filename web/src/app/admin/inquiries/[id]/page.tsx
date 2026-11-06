import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/server/security/admin";
import { database, databaseSchema } from "@/server/db";
import { isInquiryId } from "@/server/security/inquiry-id";
import { formatInquiryDetails } from "@/features/inquiries/display";
import { products } from "@/features/products/data";
import { AdminDetail, type InquiryHistory } from "@/components/admin-detail";

export const metadata = { title: "Inquiry details" };

export default async function InquiryDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    saved?: string;
    retried?: string;
    returnTo?: string;
  }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { id } = await params;
  if (!isInquiryId(id)) notFound();
  const result = await database().query(
    `SELECT * FROM ${databaseSchema()}.inquiries WHERE id=$1`,
    [id],
  );
  const inquiry = result.rows[0];
  if (!inquiry) notFound();
  const history = await database().query<InquiryHistory>(
    `SELECT id, changed_at, actor, old_status, new_status, old_note, new_note FROM ${databaseSchema()}.inquiry_history WHERE inquiry_id=$1 ORDER BY changed_at DESC, id DESC LIMIT 100`,
    [id],
  );
  const details = inquiry.details as Record<string, unknown> | null;
  const company =
    typeof details?.company === "string" && details.company
      ? details.company
      : "Inquiry";
  const productNames = Object.fromEntries(
    products.map((product) => [product.slug, product.name]),
  );
  const fields = formatInquiryDetails(details, inquiry.kind, productNames);
  const query = await searchParams;
  const backHref =
    typeof query.returnTo === "string" &&
    (query.returnTo === "/admin" || query.returnTo.startsWith("/admin?"))
      ? query.returnTo
      : "/admin";
  return (
    <AdminDetail
      id={id}
      company={company}
      kind={inquiry.kind}
      createdAt={inquiry.created_at}
      fields={fields}
      senderEmailStatus={inquiry.sender_email_status}
      companyEmailStatus={inquiry.company_email_status}
      status={inquiry.status}
      note={inquiry.internal_note || ""}
      history={history.rows}
      backHref={backHref}
      notice={
        query.saved === "1"
          ? "saved"
          : query.retried === "1"
            ? "retried"
            : undefined
      }
    />
  );
}
