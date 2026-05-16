import { NextResponse } from 'next/server'

import { auth } from '@/auth'

export default auth((req) => {
  const path = req.nextUrl.pathname

  if (path.startsWith('/login')) {

    if (req.auth) {

      return NextResponse.redirect(new URL('/', req.url))

    }

    return NextResponse.next()

  }

  if (!req.auth) {

    const login = new URL('/login', req.url)

    login.searchParams.set('callbackUrl', path)

    return NextResponse.redirect(login)

  }

  return NextResponse.next()

})

export const config = {

  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)'],

}
