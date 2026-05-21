"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, LockKeyhole, Mail, Phone, RefreshCcw, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import Reveal from "@/components/common/Reveal";
import SeoJsonLd from "@/components/common/SeoJsonLd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createWebPageSchema } from "@/lib/seo";

const title = "Sign Up | Risjas";
const description = "Create a Risjas account with email OTP verification.";

export default function ProfileSignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signupOtp, setSignupOtp] = useState("");
  const [signupOtpSession, setSignupOtpSession] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const pageSchema = createWebPageSchema({ title, description, path: "/profile/signup" });

  const cleanName = name.trim();
  const cleanPhone = phone.trim();
  const cleanEmail = email.trim().toLowerCase();
  const emailPattern = /^\S+@\S+\.\S+$/;

  const canSendSignupOtp = emailPattern.test(cleanEmail) && cleanName.length >= 2 && cleanPhone.length >= 10;
  const canSignupSubmit =
    canSendSignupOtp &&
    password.length >= 6 &&
    confirmPassword.length >= 6 &&
    password === confirmPassword &&
    signupOtp.length === 6 &&
    Boolean(signupOtpSession);

  const resetSignupOtpState = () => {
    setSignupOtp("");
    setSignupOtpSession("");
  };

  const sendSignupOtp = async (resend = false) => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(resend ? "/api/auth/customer/resend-otp" : "/api/auth/customer/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purpose: "SIGNUP",
          name: cleanName,
          phone: cleanPhone,
          email: cleanEmail
        })
      });

      const data = await response.json();
      if (!data.success) {
        setError(data.message || "Failed to send OTP");
        return;
      }

      setSignupOtpSession(data.data.otpSession);
      setMessage(
        data?.data?.devOtp
          ? `${resend ? "OTP resent" : "OTP sent"}. Dev OTP: ${data.data.devOtp}`
          : `${resend ? "OTP resent" : "OTP sent"} to your email.`
      );
    } catch (requestError: any) {
      setError(requestError?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/customer/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          phone: cleanPhone,
          email: cleanEmail,
          password,
          confirmPassword,
          otpCode: signupOtp,
          otpSession: signupOtpSession
        })
      });

      const data = await response.json();
      if (!data.success) {
        setError(data.message || "Failed to create account");
        return;
      }

      const loginResult = await signIn("credentials", {
        email: cleanEmail,
        password,
        redirect: false
      });

      if (loginResult?.error) {
        setMessage("Account created. Please login now.");
        setPassword("");
        setConfirmPassword("");
        resetSignupOtpState();
        return;
      }

      setMessage("Account created and logged in. Redirecting...");
      router.push("/");
      router.refresh();
    } catch (requestError: any) {
      setError(requestError?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !canSignupSubmit) return;
    await handleSignup();
  };

  return (
    <div className="container-page section-space pt-10">
      <SeoJsonLd id="profile-signup-page-schema" schema={pageSchema} />

      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red">Blue. Pink. White.</p>
        <h1 className="mt-3 text-4xl font-bold text-navy sm:text-5xl">Create Your Risjas Profile</h1>
        <p className="mt-3 text-base font-light text-slate-600">Sign up with email OTP verification.</p>
      </Reveal>

      <div className="mx-auto mt-10 grid max-w-5xl gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <Reveal className="relative overflow-hidden rounded-[34px] border border-red/30 bg-navy p-6 text-white shadow-premium transition-transform duration-500 hover:-translate-y-1 sm:p-8">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-red/35 blur-2xl animate-float" />
          <div className="absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-white/10 blur-2xl animate-float" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
              <Sparkles className="h-3.5 w-3.5 text-red" />
              New customer signup
            </div>

            <h2 className="mt-4 text-3xl font-bold text-white">Start Your Style Journey</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-200">Create your account with email OTP verification for secure access.</p>

            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur transition-all duration-300 hover:bg-white/15">
                <LockKeyhole className="mt-0.5 h-4 w-4 text-red" />
                <div>
                  <p className="text-sm font-semibold text-white">Email OTP verification</p>
                  <p className="text-xs text-slate-200">Verify your email before account activation.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur transition-all duration-300 hover:bg-white/15">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-red" />
                <div>
                  <p className="text-sm font-semibold text-white">Secure credentials</p>
                  <p className="text-xs text-slate-200">Keep your account details private and secure.</p>
                </div>
              </div>
            </div>

            <Link href="/track-order" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white underline underline-offset-4 transition-transform duration-300 hover:translate-x-1">
              Need order status? Track here <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Reveal>

        <Reveal className="relative overflow-hidden rounded-[34px] border border-red/25 bg-white p-6 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-premium sm:p-8" delay={0.05}>
          <div className="absolute -right-10 top-0 h-32 w-32 rounded-full bg-red-soft/80 blur-2xl animate-float" />
          <div className="absolute -left-8 bottom-0 h-28 w-28 rounded-full bg-blue-100/70 blur-2xl animate-float" />

          <form className="relative" onSubmit={onSubmit}>
            <div className="mb-5">
              <h3 className="text-2xl font-bold text-navy">Sign Up</h3>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input value={name} onChange={(e) => { setName(e.target.value); resetSignupOtpState(); }} placeholder="Full Name" className="h-12 rounded-2xl border border-red/20 bg-white pl-10 transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(217,138,129,0.22)]" />
              </div>

              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input value={phone} onChange={(e) => { setPhone(e.target.value.replace(/[^\d+]/g, "").slice(0, 15)); resetSignupOtpState(); }} placeholder="Mobile Number" className="h-12 rounded-2xl border border-red/20 bg-white pl-10 transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(217,138,129,0.22)]" />
              </div>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input value={email} onChange={(e) => { setEmail(e.target.value); resetSignupOtpState(); }} placeholder="Email Address" className="h-12 rounded-2xl border border-red/20 bg-white pl-10 transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(217,138,129,0.22)]" />
              </div>

              <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="h-12 rounded-2xl border border-red/20 bg-white transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(217,138,129,0.22)]" />

              <Input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="Confirm Password" className="h-12 rounded-2xl border border-red/20 bg-white transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(217,138,129,0.22)]" />

              <div className="grid gap-2 sm:grid-cols-[1fr_160px]">
                <Input value={signupOtp} onChange={(e) => setSignupOtp(e.target.value.replace(/[^\d]/g, "").slice(0, 6))} placeholder="Email OTP" className="h-12 rounded-2xl border border-red/20 bg-white transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(217,138,129,0.22)]" />
                <Button type="button" variant="secondary" className="h-12 border border-red/25 bg-white text-navy transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-soft" disabled={loading || !canSendSignupOtp} onClick={() => sendSignupOtp(Boolean(signupOtpSession))}>
                  {signupOtpSession ? (
                    <>
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Resend OTP
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="mt-5 h-12 w-full border-0 bg-gradient-to-r from-navy via-navy to-red text-white transition-all duration-300 hover:scale-[1.01] hover:opacity-95 hover:shadow-[0_12px_28px_rgba(26,45,75,0.28)]" disabled={loading || !canSignupSubmit}>
              {loading ? "Please wait..." : "Create Account"}
            </Button>

            <p className="mt-3 text-xs text-slate-500">For signup: verify email OTP, then account will be created.</p>

            {error ? <div className="mt-4 rounded-2xl border border-red/30 bg-red-soft px-4 py-3 text-sm font-medium text-navy">{error}</div> : null}

            {message ? (
              <div className="mt-4 flex items-start gap-2 rounded-2xl border border-navy/15 bg-blue-50 px-4 py-3 text-sm font-medium text-navy">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{message}</span>
              </div>
            ) : null}

            <div className="mt-4 flex justify-end">
              <Link href="/profile" className="inline-flex items-center gap-1 text-sm font-semibold text-navy underline underline-offset-4 transition-colors duration-200 hover:text-red">
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to login
              </Link>
            </div>
          </form>
        </Reveal>
      </div>
    </div>
  );
}
