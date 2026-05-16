import { cookies } from 'next/headers'

import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export const dynamic = 'force-dynamic'

type RouteCtx = { params: Promise<{ path?: string[] }> }

async function proxy(req: NextRequest, ctx: RouteCtx) {
  const backendBase = process.env.BACKEND_API_URL

  if (!backendBase) {
    return NextResponse.json({ message: 'ব্যাকএন্ড ইউআরএল কনফিগার করা নেই' }, { status: 500 })
  }

  const { path: segments } = await ctx.params

  const path = (segments ?? []).join('/')

  if (!path) {
    return NextResponse.json({ message: 'পথ অনুপস্থিত' }, { status: 400 })
  }

  const url = new URL(req.url)

  const qs = url.searchParams.toString()

  const target = `${backendBase}/${path}${qs ? `?${qs}` : ''}`

  const jar = await cookies()

  const access = jar.get('access_token')?.value

  const headers = new Headers()

  if (access) headers.set('Authorization', `Bearer ${access}`)

  const incomingCt = req.headers.get('content-type')

  if (incomingCt) headers.set('content-type', incomingCt)

  const init: RequestInit & { duplex?: 'half' } = {
    method: req.method,
    headers,
    cache: 'no-store',
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = req.body

    init.duplex = 'half'
  }

  const res = await fetch(target, init)

  const out = new Headers()

  const ct = res.headers.get('content-type')

  if (ct) out.set('content-type', ct)

  return new NextResponse(res.body, { status: res.status, headers: out })
}

export async function GET(req: NextRequest, ctx: RouteCtx) {

  return proxy(req, ctx)

}

export async function POST(req: NextRequest, ctx: RouteCtx) {

  return proxy(req, ctx)

}

export async function PUT(req: NextRequest, ctx: RouteCtx) {

  return proxy(req, ctx)

}

export async function PATCH(req: NextRequest, ctx: RouteCtx) {

  return proxy(req, ctx)

}

export async function DELETE(req: NextRequest, ctx: RouteCtx) {

  return proxy(req, ctx)

}
