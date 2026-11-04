export const metadata = { title: "Staff sign in" };
export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <main className="shell page-section narrow"><p className="eyebrow">Crunchify staff</p><h1>Sign in</h1><p className="page-intro">Access wholesale and partnership inquiries.</p><form className="inquiry-form login-form" action="/api/admin/login" method="post"><label>Username<input name="username" required autoComplete="username" /></label><label>Password<input type="password" name="password" required autoComplete="current-password" /></label>{error && <p className="form-error" role="alert">Unable to sign in. Check your details and try again.</p>}<button className="button button-primary">Sign in</button></form></main>;
}
