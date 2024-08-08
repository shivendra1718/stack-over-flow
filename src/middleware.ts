// middleware.ts or middleware.js
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getOrCreateDB } from './models/server/dbSetup'
import { getOrCreateStorage } from './models/server/storage.Setup'

export async function middleware(request: NextRequest) {
    await Promise.all([
        getOrCreateDB(),
       getOrCreateStorage()
    ])
    console.log("Middleware is running")
    return NextResponse.next()
}

export const config = {
  matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)"
  ]
}
