import { AuthService } from './auth.service.js'
import type { Request, Response, NextFunction } from 'express'

type AuthLocals = Request & {
  cookies?: Record<string, string | undefined>
  userId?: string
  userEmail?: string
}

const COOKIE_NAME = 'access_token'

function extractToken(req: AuthLocals): string | undefined {
  const auth = req.headers.authorization
  if (auth?.startsWith('Bearer ')) return auth.slice(7)

  const c = req.cookies?.[COOKIE_NAME]
  if (typeof c === 'string' && c.length) return c

  return undefined
}

export function authenticate(authService: AuthService) {
  return (req: AuthLocals, res: Response, next: NextFunction) => {
    try {
      const token = extractToken(req)
      if (!token) {
        res.status(401).json({ message: 'অননুমোদিত অনুরোধ' })
        return
      }
      const decoded = authService.verifyJwt(token)
      req.userId = decoded.userId
      req.userEmail = decoded.email
      next()
    } catch {
      res.status(401).json({ message: 'সেশন সমাপ্ত হয়েছে বা টোকেন অবৈধ' })
    }
  }
}

export const AUTH_COOKIE_OPTIONS = {
  cookieName: COOKIE_NAME,
} as const
