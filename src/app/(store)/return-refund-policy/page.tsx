import type { Metadata } from "next";

import PolicyTemplate from "@/components/common/PolicyTemplate";
import SeoJsonLd from "@/components/common/SeoJsonLd";
import { createPageMetadata, createWebPageSchema } from "@/lib/seo";

const title = "Return Policy | Risjas Easy Returns and Refund Support";
const description =
  "Review the Risjas return and refund policy for eligibility, timelines, exchange support, and steps to request smooth replacements or refunds for valid orders.";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path: "/return-refund-policy",
  keywords: ["return policy", "refund policy", "exchange support", "order return process"]
});

export default function ReturnRefundPolicyPage() {
  const pageSchema = createWebPageSchema({ title, description, path: "/return-refund-policy" });

  return (
    <>
      <SeoJsonLd id="return-refund-policy-schema" schema={pageSchema} />
      <PolicyTemplate title="Return & Refund Policy" updatedAt="May 7, 2026" activeHref="/return-refund-policy">
        <p>Customer satisfaction is important to us. Eligible returns are accepted under policy terms.</p>
        <h2>1. Return Window</h2>
        <ul>
          <li>Returns are accepted within 7 days of delivery.</li>
          <li>Item must be unused and in original packaging.</li>
          <li>Certain hygiene and personal-use products may be non-returnable.</li>
        </ul>
        <h2>2. Refund Timeline</h2>
        <p>Approved refunds are processed to the original payment method within 5 to 7 business days.</p>
        <h2>3. Exchange & Damaged Items</h2>
        <p>If you receive a damaged or wrong item, contact support within 48 hours of delivery for quick resolution.</p>
      </PolicyTemplate>
    </>
  );
}
