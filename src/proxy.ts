<<<<<<< HEAD
import { handleProxy } from './handleProxy';
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
=======
import type { NextRequest } from 'next/server'
import { handleProxy } from './handleProxy';


// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {

>>>>>>> dc5656236feee959b1e0e891718009336b905842
  return handleProxy(request);
}

export const config = {
<<<<<<< HEAD
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
=======
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
>>>>>>> dc5656236feee959b1e0e891718009336b905842
}