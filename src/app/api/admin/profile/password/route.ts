import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

import { errorResponse, successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/server-auth";

export async function PATCH(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const payload = await request.json();

    const currentPassword = String(payload.currentPassword || "");
    const newPassword = String(payload.newPassword || "");
    const confirmPassword = String(payload.confirmPassword || "");

    if (!currentPassword || !newPassword || !confirmPassword) {
      return errorResponse("All password fields are required");
    }

    if (newPassword.length < 8) {
      return errorResponse("New password must be at least 8 characters long");
    }

    if (newPassword !== confirmPassword) {
      return errorResponse("New password and confirm password do not match");
    }

    if (currentPassword === newPassword) {
      return errorResponse("New password must be different from current password");
    }

    const user = await prisma.user.findUnique({
      where: { id: admin.id }
    });

    if (!user) {
      return errorResponse("Admin user not found", {}, 404);
    }

    const matched = await bcrypt.compare(currentPassword, user.password);
    if (!matched) {
      return errorResponse("Current password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    return successResponse("Password updated successfully");
  } catch (error: any) {
    return errorResponse(error.message || "Failed to update password", {}, error.message === "Unauthorized" ? 401 : 500);
  }
}
