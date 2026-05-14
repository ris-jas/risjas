export default function Head() {
  return (
    <>
      <title>Risjas Checkout | Secure Payment and Fast Delivery</title>
      <meta
        name="description"
        content="Complete your Risjas order with secure payments, verified checkout steps, and quick shipping support to deliver your products safely across India."
      />
      <meta name="keywords" content="Risjas checkout, secure payment, fast delivery, order payment, online shopping checkout" />
      <meta name="robots" content="noindex,nofollow" />
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_SITE_URL || "https://risjas.com"}/checkout`} />
    </>
  );
}
