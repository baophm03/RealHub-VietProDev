import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all paths except:
  // - /api (API routes)
  // - /_next, /_vercel (Next.js internals)
  // - files containing a dot (static assets: favicon.ico, images, etc.)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
