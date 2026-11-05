import Image from "next/image";
import { InquiryForm } from "@/features/inquiries/inquiry-form";
export const metadata = { title: "Brand and media" };
export default function Partners() {
  return <main className="shell page-section form-page partner-form-page"><div className="partner-form-intro"><div className="crunch-accent" aria-hidden="true"><Image src="/brand/banana-crumbs.webp" alt="" width={190} height={190} /></div><p className="eyebrow">Brand and media</p><h1>Let’s create something together.</h1><p className="page-intro">Have a collaboration in mind? Tell us a little about it.</p></div><InquiryForm type="partner" /></main>;
}
