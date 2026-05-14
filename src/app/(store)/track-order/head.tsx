export default function Head() {
  return (
    <>
      <title>Track Order | Risjas Live Delivery and Status Updates</title>
      <meta
        name="description"
        content="Track your Risjas order using order ID and phone number to get live status updates, delivery progress, item details, and quick support in one place."
      />
      <meta name="keywords" content="track order, order status, Risjas tracking, delivery updates, shipment progress" />
      <meta name="robots" content="noindex,nofollow" />
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_SITE_URL || "https://risjas.com"}/track-order`} />
    </>
  );
}
