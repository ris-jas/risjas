export default function Head() {
  return (
    <>
      <title>Risjas Cart | Review Items and Checkout Securely Fast</title>
      <meta
        name="description"
        content="Review your Risjas cart, update quantities, and proceed to secure checkout with clear pricing, fast shipping options, and trusted customer support."
      />
      <meta name="keywords" content="Risjas cart, shopping cart, secure checkout, order summary, cart management" />
      <meta name="robots" content="noindex,nofollow" />
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_SITE_URL || "https://risjas.com"}/cart`} />
    </>
  );
}
