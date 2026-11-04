import { InquiryForm } from "@/features/inquiries/inquiry-form";
export const metadata = { title: "Wholesale inquiry" };
export default async function Inquire({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  const { product } = await searchParams;
  return <main className="shell page-section form-page"><div><p className="eyebrow">Wholesale inquiry</p><h1>Let’s work together.</h1><p className="page-intro">Tell us about your business and what you’re looking for. All fields are required.</p></div><InquiryForm type="wholesale" initialProduct={product} /></main>;
}
