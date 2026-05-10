import { NextResponse } from "next/server";

export function successResponse(message: string, data: unknown = {}) {
  return NextResponse.json({
    success: true,
    message,
    data
  });
}

export function errorResponse(message: string, errors: unknown = {}, status = 400) {
  return NextResponse.json(
    {
      success: false,
      message,
      errors
    },
    { status }
  );
}
