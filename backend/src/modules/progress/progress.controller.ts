import type { Request, Response } from 'express'

import type { ProgressService, ProgressStatus } from './progress.service.js'

type Authed = Request & { userId?: string }

function isProgressStatus(value: unknown): value is ProgressStatus {
  return value === 'not_started' || value === 'in_progress' || value === 'completed'
}

export function buildProgressController(service: ProgressService) {
  return {
    async list(req: Request & Authed & { query: Record<string, string | undefined> }, res: Response) {
      const userId = req.userId!
      const subjectId = req.query.subjectId
      const items = await service.list(userId, subjectId)
      res.json({ progress: items })
    },

    async summary(req: Authed, res: Response) {
      const stats = await service.summary(req.userId!)
      res.json(stats)
    },

    async create(req: Request & Authed & { body: Record<string, unknown> }, res: Response) {
      const userId = req.userId!
      const { subjectId, chapterId, date, minutesRead, status } = req.body

      let chapterParsed: string | undefined
      if (typeof chapterId === 'string') chapterParsed = chapterId

      if (
        typeof subjectId !== 'string' ||
        typeof date !== 'string' ||
        typeof minutesRead !== 'number' ||
        typeof status !== 'string' ||
        !isProgressStatus(status)
      ) {
        res.status(400).json({
          message: 'বিষয়, তারিখ, মিনিট এবং অগ্রগতির অবস্থা সঠিকভাবে প্রয়োজন',
        })

        return
      }

      const row = await service.create(userId, {
        subjectId,
        chapterId: chapterParsed,
        date,
        minutesRead,
        status,
      })

      if (!row) {
        res.status(404).json({ message: 'বিষয় পাওয়া যায়নি' })

        return
      }

      res.status(201).json({ progress: row })
    },

    async update(req: Request & Authed & { params: { id: string }; body: Record<string, unknown> }, res: Response) {
      const userId = req.userId!
      const { id } = req.params

      const patch: Record<string, unknown> = {}

      if (typeof req.body.date === 'string') patch.date = req.body.date
      if (typeof req.body.minutesRead === 'number') patch.minutesRead = req.body.minutesRead
      if (typeof req.body.status === 'string' && isProgressStatus(req.body.status)) patch.status = req.body.status
      if (req.body.chapterId === null) patch.chapterId = null
      if (typeof req.body.chapterId === 'string') patch.chapterId = req.body.chapterId

      const updated = await service.update(userId, id, patch as never)

      if (!updated) {
        res.status(404).json({ message: 'অগ্রগতি খুঁজে পাওয়া যায়নি' })

        return
      }

      res.json({ progress: updated })
    },

    async remove(req: Request & Authed & { params: { id: string } }, res: Response) {
      const ok = await service.remove(req.userId!, req.params.id)

      if (!ok) {
        res.status(404).json({ message: 'অগ্রগতি খুঁজে পাওয়া যায়নি' })

        return
      }

      res.status(204).send()
    },
  }
}

export type ProgressController = ReturnType<typeof buildProgressController>
