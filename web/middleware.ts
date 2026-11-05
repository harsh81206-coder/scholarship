import { NextRequest, NextResponse } from "next/server";

const HOME: Record<string, string> = {
  student: "/student",
  school: "/school",
  taluka: "/tpeo",
  tpeo: "/tpeo",
  deo: "/deo",
  admin: "/admin",
  vendor: "/vendor",
  demo: "/demo/simulate",
};

const ROUTE_ROLE: Array<[string, string[]]> = [
  ["/student", ["student"]],
  ["/school", ["school"]],
  ["/tpeo", ["taluka", "tpeo"]],
  ["/deo", ["deo"]],
  ["/admin", ["admin"]],
  ["/vendor", ["vendor"]],
  ["/demo", ["demo", "admin"]],
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const match = ROUTE_ROLE.find(([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  if (!match) return NextResponse.next();
  const token = request.cookies.get("vps_access_token")?.value;
  const role = request.cookies.get("vps_role")?.value;
  if (!token || !role) return NextResponse.redirect(new URL("/login", request.url));
  if (!match[1].includes(role)) {
    return NextResponse.redirect(new URL(HOME[role] ?? "/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/student/:path*", "/school/:path*", "/tpeo/:path*", "/deo/:path*", "/admin/:path*", "/vendor/:path*", "/demo/:path*"],
};
