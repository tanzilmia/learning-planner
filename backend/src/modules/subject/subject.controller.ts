import type { Request, Response } from 'express'

import type { SubjectService } from './subject.service.js'

type Authed = Request & { userId?: string }

export function buildSubjectController(subjectService: SubjectService) {
  return {
    async list(req: Authed, res: Response) {
      const userId = req.userId!
      const subjects = await subjectService.list(userId)
      res.json({ subjects })
    },

    async create(req: Authed, res: Response) {
      const userId = req.userId!
      const { name, icon, color, order } = req.body ?? {}
      if (!name || typeof name !== 'string') {
        res.status(400).json({ message: 'বিষয়ের নাম প্রয়োজন' })
        return
      }
      const subject = await subjectService.create(userId, { name, icon, color, order })
      res.status(201).json({ subject })
    },

    async update(req: Authed & { params: { id: string } }, res: Response) {
      const userId = req.userId!
      const { id } = req.params
      const patch = req.body ?? {}
      const updated = await subjectService.update(userId, id, patch)
      if (!updated) {
        res.status(404).json({ message: 'বিষয় পাওয়া যায়নি' })
        return
      }
      res.json({ subject: updated })
    },

    async remove(req: Authed & { params: { id: string } }, res: Response) {
      const userId = req.userId!
      const { id } = req.params
      const result = await subjectService.remove(userId, id)
      if (!result.ok) {
        res.status(result.reason ? 403 : 404).json({ message: result.reason ?? 'পাওয়া যায়নি' })
        return
      }
      res.status(204).send()
    },
  }
}

export type SubjectController = ReturnType<typeof buildSubjectController>
