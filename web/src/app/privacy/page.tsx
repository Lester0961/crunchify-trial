import Link from "next/link";
export const metadata = { title: "Privacy" };
export default function Privacy() {
  return (
    <main className="shell page-section document-page">
      <p className="section-kicker">Your information</p>
      <h1>Privacy notice</h1>
      <p className="page-intro">
        Here’s what happens to the information you share through this website.
      </p>
      <section>
        <h2>What you share</h2>
        <p>
          Our inquiry forms collect your organization or company name, contact
          name, email address and message. Wholesale inquiries also ask for your
          phone number, business type, territory, estimated monthly volume and
          products of interest. Brand and media inquiries may include a
          collaboration type.
        </p>
      </section>
      <section>
        <h2>How it is used</h2>
        <p>
          We store your inquiry so staff can review and respond to it. We send
          an email confirmation to the address you provide and a notification to
          the team using Brevo, our email service provider. Email-provider
          acceptance does not guarantee that a message reaches an inbox.
        </p>
      </section>
      <section>
        <h2>How you found us</h2>
        <p>
          The first page you visit and any campaign tags in its address, such as
          UTM source or campaign, are remembered in your browser’s session
          storage. If you send an inquiry, those values are included to help us
          understand how you found the website. The forms also use an IP-based
          attempt limit to reduce automated submissions.
        </p>
      </section>
      <section>
        <h2>Questions or corrections</h2>
        <p>
          To ask about your inquiry, correct your details or request removal,
          use our{" "}
          <Link className="text-link" href="/inquire">
            inquiry form
          </Link>{" "}
          or the supplied{" "}
          <a className="text-link" href="https://instagram.com/crunchify.eats">
            Crunchify Instagram page
          </a>
          . Include the email address used for the original inquiry so the team
          can identify it.
        </p>
      </section>
    </main>
  );
}
