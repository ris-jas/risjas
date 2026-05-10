import { getServerSession } from "next-auth";

import ProfileLogoutButton from "@/components/admin/ProfileLogoutButton";
import ProfilePasswordForm from "@/components/admin/ProfilePasswordForm";
import { authOptions } from "@/lib/auth";

export default async function AdminProfilePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-4xl font-bold leading-tight text-navy sm:text-5xl">Profile & Security</h1>
            <p className="mt-2 text-base text-slate-600 sm:text-lg">Manage your admin account details and keep your access secure.</p>
          </div>
          <ProfileLogoutButton />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1.1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-2xl font-bold text-navy">Account Details</h2>
          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Name</p>
              <p className="mt-1 text-sm font-medium text-slate-700">{session?.user?.name || "Admin"}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</p>
              <p className="mt-1 text-sm font-medium text-slate-700">{session?.user?.email || "-"}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Role</p>
              <p className="mt-1 text-sm font-medium text-slate-700">{session?.user?.role || "ADMIN"}</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-2xl font-bold text-navy">Change Password</h2>
          <p className="mt-2 text-sm text-slate-600">Use a strong password with at least 8 characters.</p>
          <div className="mt-4">
            <ProfilePasswordForm />
          </div>
        </section>
      </div>
    </div>
  );
}
