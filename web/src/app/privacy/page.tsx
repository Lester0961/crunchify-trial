import Link from "next/link";
export const metadata = { title: "Privacy" };
export default function Privacy() { return <main className="shell page-section narrow"><h1>Privacy</h1><p className="page-intro">Information submitted through our inquiry forms is used to respond to your request. For questions about your inquiry, please use our <Link className="text-link" href="/inquire">contact form</Link>.</p></main>; }
