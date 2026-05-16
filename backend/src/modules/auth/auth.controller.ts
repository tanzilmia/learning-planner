import type { AuthService } from './auth.service.js'
import type { Request, Response } from 'express'

import { AUTH_COOKIE_OPTIONS } from './auth.middleware.js'
import type { IUserService } from '../user/user.service.js'

type GoogleBody = { idToken?: string; id_token?: string }

type PatchBody = GoogleBody & {
  theme?: unknown
}

type AuthReq = Request & {
  userId?: string
  cookies?: Record<string, string | undefined>
  body: PatchBody
}

export function buildAuthController(authService: AuthService, users: IUserService) {
  return {
    async googleTokenLogin(req: AuthReq, res: Response) {
      const idToken = req.body.idToken ?? req.body.id_token
      if (!idToken || typeof idToken !== 'string') {
        res.status(400).json({ message: 'ইডিটোকেন প্রয়োজন' })
        return
      }
      try {
        const { token, user } = await authService.loginWithGoogleIdToken(idToken)
        const maxAgeMs = 30 * 24 * 60 * 60 * 1000
        res.cookie(AUTH_COOKIE_OPTIONS.cookieName, token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: maxAgeMs,
          path: '/',
        })
        res.json({ user, token })
      } catch (err) {
        const message = String((err as Error)?.message ?? 'UNKNOWN')
        console.error('[auth] google login failed:', message)
        if (message === 'INVALID_GOOGLE_TOKEN') {
          res.status(401).json({ message: 'গুগল টোকেন যাচাই ব্যর্থ হয়েছে' })
          return
        }
        res.status(500).json({ message: 'প্রমাণীকরণ ব্যর্থ হয়েছে' })
      }
    },

    async me(req: AuthReq, res: Response) {
      try {
        const userId = req.userId
        if (!userId) {
          res.status(401).json({ message: 'প্রয়োজনীয় নয় এমন অনুরোধ' })
          return
        }
        const user = await authService.getUserFromJwt(userId)
        if (!user) {
          res.status(404).json({ message: 'ব্যবহারকারী পাওয়া যায়নি' })
          return
        }
        const o = typeof user.toObject === 'function' ? user.toObject() : user
        res.json({
          user: {
            id: user._id.toString(),
            name: o.name,
            email: o.email,
            avatar: o.avatar ?? null,
            theme: o.theme,
            createdAt: (o as { createdAt?: Date }).createdAt,
          },
        })
      } catch {
        res.status(500).json({ message: 'ব্যবহারকারী লোড করা যায়নি' })
      }
    },

    async patchMe(req: AuthReq, res: Response) {
      const userId = req.userId
      if (!userId) {
        res.status(401).json({ message: 'প্রয়োজনীয় নয় এমন অনুরোধ' })
        return
      }

      const theme = req.body?.theme
      if (theme !== 'light' && theme !== 'dark') {
        res.status(400).json({ message: 'থিম হিসেবে light অথবা dark পাঠাতে হবে' })
        return
      }

      try {
        await users.updateTheme(userId, theme)

        const user = await authService.getUserFromJwt(userId)
        if (!user) {
          res.status(404).json({ message: 'ব্যবহারকারী পাওয়া যায়নি' })
          return
        }

        const o = typeof user.toObject === 'function' ? user.toObject() : user
        res.json({
          user: {
            id: user._id.toString(),
            name: o.name,
            email: o.email,
            avatar: o.avatar ?? null,
            theme: o.theme,
            createdAt: (o as { createdAt?: Date }).createdAt,
          },
        })
      } catch {
        res.status(500).json({ message: 'থিম আপডেট করা গেল না' })
      }
    },
  }
}

export type AuthController = ReturnType<typeof buildAuthController>
