import { LoginForm } from "@/features/admin/login-form";
export const metadata = { title: "Staff sign in" };
export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <main className="shell admin-login-page">
      <div className="login-visual">
        <p>
          A little order.
          <br />A lot of good.
        </p>
      </div>
      <section className="admin-login-card">
        <p className="section-kicker">Crunchify staff</p>
        <h1>Welcome back.</h1>
        <p className="page-intro">
          Sign in to manage wholesale and partnership inquiries.
        </p>
        <LoginForm initialError={Boolean(error)} />
      </section>
    </main>
  );
}
