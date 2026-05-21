export default function Head() {
  return (
    <>
      <title>Profile Login | Risjas Account</title>
      <meta
        name="description"
        content="Login to your Risjas account."
      />
      <meta name="robots" content="noindex,nofollow" />
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_SITE_URL || "https://risjas.com"}/profile`} />
    </>
  );
}
