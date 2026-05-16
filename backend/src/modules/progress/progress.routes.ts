import { Router } from 'express'

import type { ProgressController } from './progress.controller.js'
import type { AuthService } from '../auth/auth.service.js'

import { authenticate } from '../auth/auth.middleware.js'

export function progressRoutes(controller: ProgressController, authService: AuthService): Router {
  const r = Router()
  const auth = authenticate(authService)

  r.get('/summary', auth, controller.summary)
  r.get('/', auth, controller.list)
  r.post('/', auth, controller.create)
  r.put('/:id', auth, controller.update)
  r.delete('/:id', auth, controller.remove)

  return r
}
