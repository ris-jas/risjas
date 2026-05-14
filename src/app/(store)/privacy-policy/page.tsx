import type { Metadata } from "next";

import PolicyTemplate from "@/components/common/PolicyTemplate";
import SeoJsonLd from "@/components/common/SeoJsonLd";
import { createPageMetadata, createWebPageSchema } from "@/lib/seo";

const title = "Privacy Policy | Risjas Data Protection and Security Terms";
const description =
  "Read the Risjas privacy policy to understand how we collect, use, and secure your personal information for safe shopping, payments, and customer support.";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path: "/privacy-policy",
  keywords: ["privacy policy", "data protection", "customer information security", "Risjas policy"]
});

export default function PrivacyPolicyPage() {
  const pageSchema = createWebPageSchema({ title, description, path: "/privacy-policy" });

  return (
    <>
      <SeoJsonLd id="privacy-policy-schema" schema={pageSchema} />
      <PolicyTemplate title="Privacy Policy" updatedAt="May 7, 2026" activeHref="/privacy-policy">
        <p>At Risjas, accessible from our website, one of our main priorities is the privacy of our visitors.</p>
        <h2>1. Information We Collect</h2>
        <ul>
          <li>Account information including name, email, phone and address.</li>
          <li>Transaction details for orders and payment confirmations.</li>
          <li>Usage data such as device type, browser and page interactions.</li>
        </ul>
        <h2>2. How We Use Information</h2>
        <ul>
          <li>To process orders and provide support.</li>
          <li>To improve product recommendations and site performance.</li>
          <li>To prevent fraud and maintain secure transactions.</li>
        </ul>
        <h2>3. Data Security</h2>
        <p>We use secure infrastructure and trusted third-party payment processors to protect customer data.</p>
      </PolicyTemplate>
    </>
  );
}
