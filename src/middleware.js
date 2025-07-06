import { NextResponse } from "next/server";

export const config = {
  matcher: "/integrations/:path*",
};

export function middleware(request) {
  return NextResponse.next();
}