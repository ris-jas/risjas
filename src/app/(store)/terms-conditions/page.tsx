import type { Metadata } from "next";

import PolicyTemplate from "@/components/common/PolicyTemplate";
import SeoJsonLd from "@/components/common/SeoJsonLd";
import { createPageMetadata, createWebPageSchema } from "@/lib/seo";

const title = "Terms and Conditions | Risjas Shopping and Usage Rules";
const description =
  "Read the Risjas terms and conditions for orders, payments, account responsibilities, and platform usage guidelines to ensure transparent and secure shopping.";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path: "/terms-conditions",
  keywords: ["terms and conditions", "shopping rules", "payment terms", "website usage policy"]
});

export default function TermsPage() {
  const pageSchema = createWebPageSchema({ title, description, path: "/terms-conditions" });

  return (
    <>
      <SeoJsonLd id="terms-conditions-schema" schema={pageSchema} />
      <PolicyTemplate title="Terms & Conditions" updatedAt="May 7, 2026" activeHref="/terms-conditions">
        <p>By using Risjas, you agree to the following terms and conditions.</p>
        <h2>1. Orders & Pricing</h2>
        <ul>
          <li>All prices are listed in INR and may change without prior notice.</li>
          <li>Orders are confirmed after successful verification and stock availability.</li>
        </ul>
        <h2>2. Payments</h2>
        <ul>
          <li>We support secure online payments and Cash on Delivery where applicable.</li>
          <li>Payment gateway processing is handled by trusted third-party providers.</li>
        </ul>
        <h2>3. Liability</h2>
        <p>Risjas is not liable for delays due to courier disruptions, natural events, or incomplete delivery details.</p>
      </PolicyTemplate>
    </>
  );
}
