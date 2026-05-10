import PolicyTemplate from "@/components/common/PolicyTemplate";

export default function TermsPage() {
  return (
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
  );
}

