import { NextRequest, NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const secret = process.env.AUTH_SECRET
  const backendBase = process.env.BACKEND_API_URL

  if (!secret || !backendBase) {
    return NextResponse.json({ message: 'সার্ভার কনফিগারেশন অনুপস্থিত' }, { status: 500 })
  }

  const jwt = await getToken({ req, secret })
  const idToken = jwt?.googleIdToken

  if (!idToken || typeof idToken !== 'string') {
    return NextResponse.json({ message: 'গুগল টোকেন পাওয়া যায়নি — আবার লগইন করুন' }, { status: 401 })
  }

  const upstream = await fetch(`${backendBase}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_token: idToken }),
    cache: 'no-store',
  })

  const data: unknown = await upstream.json().catch(() => null)

  if (!upstream.ok || !data || typeof data !== 'object') {
    const msg =
      data && typeof data === 'object' && 'message' in data && typeof (data as { message?: unknown }).message === 'string'
        ? (data as { message: string }).message
        : 'ব্যাকএন্ড লগইন ব্যর্থ'
    return NextResponse.json({ message: msg }, { status: upstream.status || 502 })
  }

  const token = 'token' in data && typeof (data as { token?: unknown }).token === 'string' ? (data as { token: string }).token : null

  const user = 'user' in data ? (data as { user?: unknown }).user : undefined

  if (!token) {
    return NextResponse.json({ message: 'ব্যাকএন্ড টোকেন পাওয়া যায়নি' }, { status: 502 })
  }

  const response = NextResponse.json({ ok: true, user })

  response.cookies.set('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })

  return response
}
