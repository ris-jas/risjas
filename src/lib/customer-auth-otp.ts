import crypto from "crypto";

const OTP_TTL_MINUTES = 10;
const OTP_SECRET = process.env.CUSTOMER_OTP_SECRET || process.env.NEXTAUTH_SECRET || "dev-otp-secret-change-me";

type OtpPurpose = "LOGIN" | "SIGNUP";

type OtpPayload = {
  email: string;
  purpose: OtpPurpose;
  expiresAt: number;
  otpHash: string;
  name?: string;
  phone?: string;
};

function base64UrlEncode(value: string) {
  return Buffer.from(value).toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signPayload(encodedPayload: string) {
  return crypto.createHmac("sha256", OTP_SECRET).update(encodedPayload).digest("base64url");
}

function hashOtp(code: string) {
  return crypto.createHash("sha256").update(`${code}:${OTP_SECRET}`).digest("hex");
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function normalizePhone(phone: string) {
  return phone.trim().replace(/[^\d+]/g, "");
}

export function generateOtp() {
  return String(crypto.randomInt(100000, 1000000));
}

export function createOtpSession(input: {
  email: string;
  purpose: OtpPurpose;
  code: string;
  name?: string;
  phone?: string;
}) {
  const payload: OtpPayload = {
    email: normalizeEmail(input.email),
    purpose: input.purpose,
    expiresAt: Date.now() + OTP_TTL_MINUTES * 60 * 1000,
    otpHash: hashOtp(input.code),
    name: input.name,
    phone: input.phone
  };

  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = signPayload(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function parseAndVerifySession(token: string) {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    throw new Error("Invalid OTP session");
  }

  const expected = signPayload(encodedPayload);
  if (signature !== expected) {
    throw new Error("Invalid OTP session");
  }

  const payload = JSON.parse(base64UrlDecode(encodedPayload)) as OtpPayload;
  if (payload.expiresAt < Date.now()) {
    throw new Error("OTP expired. Please request a new OTP.");
  }

  return payload;
}

export function verifyOtpCode(code: string, codeHash: string) {
  return hashOtp(code) === codeHash;
}

export async function dispatchOtpEmail(params: { email: string; code: string; purpose: OtpPurpose }) {
  // TODO: Integrate real email provider here.
  console.log(`[customer-auth-otp] Send ${params.purpose} OTP to ${params.email}: ${params.code}`);
}

export function getOtpTtlMinutes() {
  return OTP_TTL_MINUTES;
}
