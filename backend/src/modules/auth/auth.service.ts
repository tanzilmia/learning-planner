import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'

import type { JwtPayload } from './auth.dto.js'
import type { IUserService } from '../user/user.service.js'

const oauthClientCache = new Map<string, OAuth2Client>()

function getOAuthClient(clientId: string) {
  let c = oauthClientCache.get(clientId)
  if (!c) {
    c = new OAuth2Client(clientId)
    oauthClientCache.set(clientId, c)
  }
  return c
}

async function verifyGooglePayload(idToken: string, audience: string): Promise<{ sub: string; email: string; name?: string; picture?: string }> {
  const ticket = await getOAuthClient(audience).verifyIdToken({
    idToken,
    audience,
  })
  const payload = ticket.getPayload()
  if (!payload?.sub || !payload.email || !payload.aud) {
    throw new Error('INVALID_GOOGLE_TOKEN')
  }
  return {
    sub: payload.sub,
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
  }
}

export class AuthService {
  constructor(
    private readonly users: IUserService,
    private readonly ensureDefaultSubjectsForUser?: (userId: string) => Promise<void>
  ) {}

  signJwt(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    const secret = process.env.JWT_SECRET!
    const expiresIn = process.env.JWT_EXPIRES_IN || '30d'
    return jwt.sign(payload, secret, { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] })
  }

  verifyJwt(token: string): JwtPayload {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
  }

  async loginWithGoogleIdToken(idToken: string): Promise<{ userId: string; token: string; user: Record<string, unknown> }> {
    const audience = process.env.GOOGLE_CLIENT_ID!
    const verified = await verifyGooglePayload(idToken, audience)
    const { user, isNew } = await this.users.findOrCreateFromGoogle({
      googleId: verified.sub,
      email: verified.email,
      name: verified.name ?? verified.email.split('@')[0],
      avatar: verified.picture,
    })
    const userId = user._id.toString()
    if (isNew && this.ensureDefaultSubjectsForUser) {
      await this.ensureDefaultSubjectsForUser(userId)
    }
    const token = this.signJwt({ userId, email: user.email })
    const uObj = typeof user.toObject === 'function' ? user.toObject() : user
    return {
      userId,
      token,
      user: {
        id: userId,
        name: uObj.name,
        email: uObj.email,
        avatar: uObj.avatar ?? null,
        theme: uObj.theme,
        createdAt: uObj.createdAt,
      },
    }
  }

  async getUserFromJwt(userId: string) {
    return this.users.getById(userId)
  }
}
