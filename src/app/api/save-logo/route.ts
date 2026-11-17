import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/server-auth";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const payload = await request.json();
    if (typeof payload?.base64 !== "string" || payload.base64.length > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: "Invalid image" }, { status: 400 });
    }
    const match = payload.base64.match(/^data:image\/(png|jpeg);base64,([A-Za-z0-9+/=]+)$/);
    if (!match) return NextResponse.json({ success: false, message: "Invalid image" }, { status: 400 });
    const buffer = Buffer.from(match[2], "base64");
    const valid = match[1] === "png"
      ? buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      : buffer.subarray(0, 3).equals(Buffer.from([255, 216, 255]));
    if (!valid || buffer.length > 5 * 1024 * 1024) return NextResponse.json({ success: false, message: "Invalid image" }, { status: 415 });
    const filePath = path.join(process.cwd(), "public", "imgs", "Logo-Clean.png");
    fs.writeFileSync(filePath, buffer, { flag: "w" });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[save-logo] failed", error);
    return NextResponse.json({ success: false, message: "Unable to save image" }, { status: 500 });
  }
}
