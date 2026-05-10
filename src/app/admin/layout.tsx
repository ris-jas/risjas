import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    return <>{children}</>;
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,138,129,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(26,45,75,0.08),transparent_40%)]" />
      <AdminSidebar />
      <div className="relative flex min-w-0 flex-1 flex-col">
        <AdminHeader />
        <main className="flex-1 p-5 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

