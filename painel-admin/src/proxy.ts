import { NextResponse, type NextRequest } from "next/server";

// Next.js 16: `middleware` foi renomeado para `proxy`.
// Aqui fazemos só duas coisas baratas (sem tocar no banco):
//   1. CORS para /api/* (consumido pelo app Expo em outra origem)
//   2. checagem "otimista" de sessão para as páginas do painel
// A autorização real acontece nas rotas/《Server Components》 via `auth()` / `requireUser()`.

const CORS_ORIGIN = process.env.API_CORS_ORIGIN || "*";

const SESSION_COOKIES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
];

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": CORS_ORIGIN,
    "Access-Control-Allow-Methods": "GET,POST,PATCH,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ---- API: CORS ----
  if (pathname.startsWith("/api/")) {
    if (req.method === "OPTIONS") {
      return new NextResponse(null, { status: 204, headers: corsHeaders() });
    }
    const res = NextResponse.next();
    for (const [k, v] of Object.entries(corsHeaders())) res.headers.set(k, v);
    return res;
  }

  // ---- Páginas do painel: exige sessão ----
  const hasSession = SESSION_COOKIES.some((name) => req.cookies.has(name));
  const isLogin = pathname === "/login";

  if (!hasSession && !isLogin) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (hasSession && isLogin) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
