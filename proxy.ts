import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const proxy = auth((req) => {
  const pathname = req.nextUrl.pathname;
  const isLoggedIn = !!req.auth;

  // rutas públicas
  const publicRoutes = ["/login", "/register"];

  const isPublic = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // si no está logueado y la ruta NO es pública → login
  if (!isLoggedIn && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};