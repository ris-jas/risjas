import { NextRequest } from "next/server";

import { POST as requestOtpHandler } from "@/app/api/auth/customer/request-otp/route";

export async function POST(request: NextRequest) {
  return requestOtpHandler(request);
}
