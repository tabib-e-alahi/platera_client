import type { NextRequest } from 'next/server'
import { handleProxy } from './handleProxy';


// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {

  return handleProxy(request);
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static  (Next.js static files)
     * - _next/image   (Next.js image optimization)
     * - favicon.ico
     * - public files with extension (.png, .jpg, .svg etc.)
     * - api routes (backend handles its own auth)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}