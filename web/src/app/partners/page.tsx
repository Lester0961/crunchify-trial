import Image from "next/image";
import { InquiryForm } from "@/features/inquiries/inquiry-form";
export const metadata = {
  title: "Brand and media",
  description:
    "Have a collaboration in mind? Contact Crunchify for brand partnerships and media inquiries.",
};
export default function Partners() {
  return (
    <main className="shell page-section form-page partner-form-page">
      <div className="form-intro">
        <p className="section-kicker">Brand & media</p>
        <h1>
          A good idea
          <br />
          starts with hello.
        </h1>
        <p className="page-intro">
          Have a collaboration in mind? We’d love to hear what you’re thinking.
        </p>
        <div className="inquiry-intro-photo">
          <Image
            src="/brand/banana-crumbs.webp"
            alt="Banana Crunch pieces"
            width={500}
            height={500}
            sizes="(max-width: 900px) 40vw, 28vw"
          />
        </div>
      </div>
      <div className="form-surface">
        <InquiryForm type="partner" />
      </div>
    </main>
  );
}
