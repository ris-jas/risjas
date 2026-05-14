import type { Metadata } from "next";

import PolicyTemplate from "@/components/common/PolicyTemplate";
import SeoJsonLd from "@/components/common/SeoJsonLd";
import { createPageMetadata, createWebPageSchema } from "@/lib/seo";

const title = "Shipping Policy | Risjas Delivery Timelines and Charges";
const description =
  "Explore the Risjas shipping policy for processing times, delivery estimates, charges, and support details to track order dispatch and arrival across India.";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path: "/shipping-policy",
  keywords: ["shipping policy", "delivery timeline", "shipping charges", "order dispatch support"]
});

export default function ShippingPolicyPage() {
  const pageSchema = createWebPageSchema({ title, description, path: "/shipping-policy" });

  return (
    <>
      <SeoJsonLd id="shipping-policy-schema" schema={pageSchema} />
      <PolicyTemplate title="Shipping Policy" updatedAt="May 7, 2026" activeHref="/shipping-policy">
        <p>Orders are processed within 24 to 48 hours after confirmation.</p>
        <h2>1. Delivery Timeline</h2>
        <ul>
          <li>Metro cities: 2 to 4 business days.</li>
          <li>Other locations: 4 to 7 business days.</li>
          <li>Remote areas may require extra transit time.</li>
        </ul>
        <h2>2. Shipping Charges</h2>
        <p>Standard shipping charges are applied at checkout and free shipping is available on qualifying orders.</p>
        <h2>3. Delivery Support</h2>
        <p>For delivery issues, contact us via WhatsApp or email with your order number.</p>
      </PolicyTemplate>
    </>
  );
}
