import { Router } from 'express'

import type { SubjectController } from './subject.controller.js'
import type { AuthService } from '../auth/auth.service.js'

import { authenticate } from '../auth/auth.middleware.js'

export function subjectRoutes(controller: SubjectController, authService: AuthService): Router {
  const r = Router()
  const auth = authenticate(authService)

  r.get('/', auth, controller.list)
  r.post('/', auth, controller.create)
  r.put('/:id', auth, controller.update)
  r.delete('/:id', auth, controller.remove)

  return r
}
