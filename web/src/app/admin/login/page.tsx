import Image from "next/image";
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
        <div className="login-photo">
          <Image
            src="/brand/banana-crumbs.webp"
            alt=""
            width={600}
            height={600}
            sizes="40vw"
          />
        </div>
        <p>
          Good conversations.
          <br />A little more crunch.
        </p>
      </div>
      <section className="admin-login-card">
        <p className="section-kicker">Crunchify staff</p>
        <h1>Welcome back.</h1>
        <p className="page-intro">
          Sign in to manage wholesale and partnership inquiries.
        </p>
        <form
          className="inquiry-form login-form"
          action="/api/admin/login"
          method="post"
        >
          <label>
            Username
            <input name="username" required autoComplete="username" />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
            />
          </label>
          {error && (
            <p className="form-error form-alert" role="alert">
              Unable to sign in. Check your details and try again.
            </p>
          )}
          <button className="button button-primary" type="submit">
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}
