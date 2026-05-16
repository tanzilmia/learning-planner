import { Router } from 'express'

import type { NoteController } from './note.controller.js'
import type { AuthService } from '../auth/auth.service.js'

import { authenticate } from '../auth/auth.middleware.js'
import { uploadPdfMiddleware } from '../../middlewares/upload.middleware.js'

function handleUpload(req: any, res: any, next: any) {
  uploadPdfMiddleware(req, res, (err: unknown) => {
    if (err instanceof Error && err.message.includes('শুধুমাত্র')) {
      res.status(400).json({ message: err.message })
      return
    }

    next(err as never)
  })
}

export function noteRoutes(controller: NoteController, authService: AuthService): Router {
  const r = Router()
  const auth = authenticate(authService)

  r.get('/', auth, controller.list)

  r.post('/', auth, controller.create)

  r.post('/upload', auth, handleUpload as never, controller.uploadPdf)

  r.put('/:id', auth, controller.update)

  r.delete('/:id', auth, controller.remove)

  return r
}
