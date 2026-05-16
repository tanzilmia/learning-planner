import { Router } from 'express'

import type { CalendarController } from './calendar.controller.js'
import type { AuthService } from '../auth/auth.service.js'

import { authenticate } from '../auth/auth.middleware.js'

export function calendarRoutes(controller: CalendarController, authService: AuthService): Router {
  const r = Router()

  const auth = authenticate(authService)

  r.get('/', auth, controller.list)

  
  r.post('/', auth, controller.create)

  

  r.put('/:id', auth, controller.update)

  

  
  r.delete('/:id', auth, controller.remove)

  

  

  return r

}
