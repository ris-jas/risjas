export default function Head() {
  return (
    <>
      <title>Sign Up | Risjas Account</title>
      <meta
        name="description"
        content="Create a Risjas account using full name, mobile number, email, and email OTP verification."
      />
      <meta name="robots" content="noindex,nofollow" />
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_SITE_URL || "https://risjas.com"}/profile/signup`} />
    </>
  );
}
