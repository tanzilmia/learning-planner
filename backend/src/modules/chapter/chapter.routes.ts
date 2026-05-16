import { Router } from 'express'

import type { ChapterController } from './chapter.controller.js'
import type { AuthService } from '../auth/auth.service.js'

import { authenticate } from '../auth/auth.middleware.js'

/** GET/POST `/api/subjects/:subjectId/chapters` */
export function chapterRoutesNested(controller: ChapterController, authService: AuthService): Router {
  const r = Router({ mergeParams: true })
  const auth = authenticate(authService)

  r.get('/', auth, controller.list)
  r.post('/', auth, controller.create)

  return r
}

/** PUT/DELETE `/api/chapters/:id` */
export function chapterRoutesFlat(controller: ChapterController, authService: AuthService): Router {
  const r = Router()
  const auth = authenticate(authService)

  r.put('/:id', auth, controller.update)
  r.delete('/:id', auth, controller.remove)

  return r
}
