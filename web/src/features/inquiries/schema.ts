import { z } from "zod";
export const inquirySchema = z.object({
  type: z.enum(["wholesale", "partner"]),
  company: z.string().trim().min(1, "Enter your company name.").max(150),
  contact: z.string().trim().min(1, "Enter a contact person.").max(120),
  email: z.string().trim().email("Enter a valid email address.").max(254),
  phone: z.string().trim().max(50).optional().default(""),
  businessType: z.string().trim().max(80).optional().default(""),
  territory: z.string().trim().max(150).optional().default(""),
  volume: z.string().trim().max(100).optional().default(""),
  products: z.array(z.enum(["banana-crunch", "jackfruit-crunch", "apple-crunch", "broccoli-crunch"])).max(4).default([]),
  message: z.string().trim().min(1, "Enter a message.").max(5000),
  website: z.string().max(0).optional().default(""),
  source: z.string().max(500).optional().default(""),
  utm: z.record(z.string().max(50), z.string().max(200)).default({}),
  submissionId: z.string().uuid(),
}).superRefine((data, ctx) => {
  if (data.type === "wholesale") {
    for (const field of ["phone", "businessType", "territory", "volume"] as const) {
      if (!data[field]) ctx.addIssue({ code: "custom", path: [field], message: "Please complete this field." });
    }
    if (!["Distributor", "Reseller", "Retailer", "Other"].includes(data.businessType)) ctx.addIssue({ code: "custom", path: ["businessType"], message: "Choose a business type." });
    if (!data.products.length) ctx.addIssue({ code: "custom", path: ["products"], message: "Choose at least one product." });
  }
});
