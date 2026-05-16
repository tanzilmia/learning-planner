import type { Request, Response } from 'express'

import type { CalendarService } from './calendar.service.js'

type Authed = Request & {
  userId?: string
  query: Record<string, string | undefined>
  params?: { id?: string }
}

function parseMonthYear(query: Record<string, string | undefined>): { month: number; year: number } | null {
  const m = Number.parseInt(query.month ?? '', 10)
  const y = Number.parseInt(query.year ?? '', 10)

  if (!Number.isFinite(m) || !Number.isFinite(y) || m < 1 || m > 12) return null

  return { month: m, year: y }
}

export function buildCalendarController(service: CalendarService) {
  return {
    async list(req: Authed, res: Response) {
      
      const userId = req.userId!
      const monthYear = parseMonthYear(req.query)
      if (!monthYear) {
        res.status(400).json({ message: 'মাস ও সাল প্রয়োজন' })

        return
      }

      const { events, noteSlots } = await service.listMonth(userId, monthYear.month, monthYear.year)
      res.json({ events, noteSlots })

    },

    async create(req: Request & { userId?: string; body: Record<string, unknown> }, res: Response) {
      const userId = req.userId!
      
      const { subjectId, title, date } = req.body

      const duration = typeof req.body.duration === 'number' ? req.body.duration : undefined
      const note = typeof req.body.note === 'string' ? req.body.note : undefined

      if (
        typeof subjectId !== 'string' ||
        typeof title !== 'string' ||
        typeof date !== 'string' ||
        !subjectId.trim() ||
        !title.trim() ||
        !date.trim()
      ) {

        res.status(400).json({ message: 'বিষয়, শিরোনাম ও তারিখ প্রয়োজন' })

        return
      }

      let linkedNoteId: string | undefined
      const rawLn = req.body.linkedNoteId
      if (typeof rawLn === 'string' && rawLn.trim()) linkedNoteId = rawLn.trim()

      let linkedKind: 'study' | 'deadline' | undefined
      const rawK = req.body.linkedKind
      if (rawK === 'deadline' || rawK === 'study') linkedKind = rawK

      const event = await service.create(userId, {
        subjectId: subjectId.trim(),
        title: title.trim(),
        date: date.trim(),
        duration,
        note,
        linkedNoteId,
        linkedKind,
      })

      if (!event) {
        res.status(404).json({ message: 'বিষয় বা লিঙ্ক করা নোট খুঁজে পাওয়া যায়নি' })

        return
      }

      
      res.status(201).json({ event })
    },

    async update(req: Request & { userId?: string; params: { id: string }; body: Record<string, unknown> }, res: Response) {
      const userId = req.userId!
      const { id } = req.params
      const body = req.body

      const patch: Partial<{
        title: string
        date: string
        duration: number
        isCompleted: boolean
        note: string
        subjectId: string
      }> = {}

      if (typeof body.title === 'string') patch.title = body.title
      
      if (typeof body.note === 'string') patch.note = body.note
      if (typeof body.subjectId === 'string') patch.subjectId = body.subjectId
      if (typeof body.date === 'string') patch.date = body.date
      
      if (typeof body.duration === 'number') patch.duration = body.duration
      if (typeof body.isCompleted === 'boolean') patch.isCompleted = body.isCompleted
      
      const result = await service.update(userId, id, patch)

      if (!result.ok) {
        if (result.reason === 'SUBJECT_LOCKED') {
          res.status(403).json({ message: 'লিঙ্ক করা ইভেন্টের বিষয় পরিবর্তন করা যাবে না' })
          return
        }
        res.status(404).json({ message: 'ইভেন্ট পাওয়া যায়নি' })

        return
      }

      
      res.json({ event: result.event })

    },

    async remove(req: Request & { userId?: string; params: { id: string } }, res: Response) {
      
      const userId = req.userId!
      const ok = await service.remove(userId, req.params.id)


      if (!ok) {


        res.status(404).json({ message: 'ইভেন্ট পাওয়া যায়নি' })

        return


      }



      res.status(204).send()


    },

  }

}

export type CalendarController = ReturnType<typeof buildCalendarController>
