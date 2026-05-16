import type { NextFunction, Request, Response } from 'express'

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error('[error]', err)
  const message = err instanceof Error ? err.message : 'একটি সমস্যা হয়েছে'
  const rawStatus =
    typeof err === 'object' && err !== null && 'status' in err ? (err as { status?: unknown }).status : undefined

  const status = typeof rawStatus === 'number' && rawStatus >= 400 && rawStatus < 600 ? rawStatus : 500

  res.status(status).json({ message })

}
