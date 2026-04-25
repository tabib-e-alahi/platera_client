import { handleProxy } from './handleProxy';
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  return handleProxy(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}