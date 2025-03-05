import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // 允许所有来源访问
  const response = NextResponse.next();

  // No authentication is required if the request path is /login or /api/auth
  if (
    pathname.startsWith("/v1/login/") ||
    pathname.startsWith("/api/auth") ||
    pathname.match(/\.(.*)$/) // Matches static resources such as.js,.css,.png,.jpg,.jpeg,.svg,.gif, etc
  ) {
    return response;
  }
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // If there is no token, redirect to the /login page
  // console.log(token, "token");
  if (!token) {
    const loginUrl = new URL("/login/", req.url);
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // If there is a token, the request is allowed to continue processing
  return response;
}
