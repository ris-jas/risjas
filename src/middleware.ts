import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

import { ADMIN_API_PATH, ADMIN_PANEL_PATH } from "@/lib/admin-path";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLegacyAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");
  const isLegacyAdminApi = pathname === "/api/admin" || pathname.startsWith("/api/admin/");
  const isSecureAdminPage = pathname === ADMIN_PANEL_PATH || pathname.startsWith(`${ADMIN_PANEL_PATH}/`);
  const isSecureAdminSubPage = pathname.startsWith(`${ADMIN_PANEL_PATH}/`);
  const isSecureAdminApi = pathname === ADMIN_API_PATH || pathname.startsWith(`${ADMIN_API_PATH}/`);
  const isOldSecurePath = pathname === "/rj-control-9x7k" || pathname.startsWith("/rj-control-9x7k/");
  const isSecureAdminRoot = pathname === ADMIN_PANEL_PATH;
  const isLegacyAdminRoot = pathname === "/admin";
  const requiresAdminToken = isLegacyAdminApi || isSecureAdminApi || isSecureAdminSubPage;

  if (isOldSecurePath) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = pathname.replace("/rj-control-9x7k", ADMIN_PANEL_PATH);
    return NextResponse.redirect(rewriteUrl);
  }

  if (!isLegacyAdminPage && !isLegacyAdminApi && !isSecureAdminPage && !isSecureAdminApi) {
    return NextResponse.next();
  }

  if (isSecureAdminRoot || isLegacyAdminRoot) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (token?.role === "ADMIN") {
      return NextResponse.redirect(new URL(`${ADMIN_PANEL_PATH}/dashboard`, request.url));
    }
  }

  if (requiresAdminToken) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "ADMIN") {
      if (isLegacyAdminApi || isSecureAdminApi) {
        return NextResponse.json({ success: false, message: "Unauthorized", errors: {} }, { status: 401 });
      }

      return NextResponse.redirect(new URL(ADMIN_PANEL_PATH, request.url));
    }
  }

  if (isLegacyAdminPage) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = pathname.replace("/admin", ADMIN_PANEL_PATH);
    return NextResponse.redirect(rewriteUrl);
  }

  if (isSecureAdminPage) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = pathname.replace(ADMIN_PANEL_PATH, "/admin");
    return NextResponse.rewrite(rewriteUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/api/admin",
    "/api/admin/:path*",
    "/dashboard/admin",
    "/dashboard/admin/:path*",
    "/rj-control-9x7k",
    "/rj-control-9x7k/:path*"
  ]
};
