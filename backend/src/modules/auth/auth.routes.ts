import { Router } from 'express'

import type { AuthController } from './auth.controller.js'
import type { AuthService } from './auth.service.js'

import { authenticate } from './auth.middleware.js'

export function authRoutes(controller: AuthController, authService: AuthService): Router {
  const r = Router()
  const authMw = authenticate(authService)

  r.post('/google', controller.googleTokenLogin)
  r.get('/me', authMw, controller.me)
  r.patch('/me', authMw, controller.patchMe)

  return r
}
