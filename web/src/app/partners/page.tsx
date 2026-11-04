import { InquiryForm } from "@/features/inquiries/inquiry-form";
export const metadata = { title: "Brand and media" };
export default function Partners() {
  return <main className="shell page-section form-page"><div><p className="eyebrow">Brand and media</p><h1>Let’s create something together.</h1><p className="page-intro">Have a collaboration in mind? Tell us a little about it.</p></div><InquiryForm type="partner" /></main>;
}
