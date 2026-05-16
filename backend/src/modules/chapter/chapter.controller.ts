import type { Request, Response } from 'express'

import type { ChapterService } from './chapter.service.js'

type Authed = Request & { userId?: string; params: { subjectId?: string; id?: string } }

export function buildChapterController(chapterService: ChapterService) {
  return {
    async list(req: Authed, res: Response) {
      const userId = req.userId!
      const subjectId = req.params.subjectId!
      const chapters = await chapterService.list(subjectId, userId)
      res.json({ chapters })
    },

    async create(req: Authed, res: Response) {
      const userId = req.userId!
      const subjectId = req.params.subjectId!
      const { title } = req.body ?? {}
      if (!title || typeof title !== 'string') {
        res.status(400).json({ message: 'অধ্যায়ের শিরোনাম প্রয়োজন' })
        return
      }
      const chapter = await chapterService.create(subjectId, userId, title)
      if (!chapter) {
        res.status(404).json({ message: 'বিষয় পাওয়া যায়নি' })
        return
      }
      res.status(201).json({ chapter })
    },

    async update(req: Authed & { params: { id: string } }, res: Response) {
      const userId = req.userId!
      const { id } = req.params
      const chapter = await chapterService.update(userId, id, req.body ?? {})
      if (!chapter) {
        res.status(404).json({ message: 'অধ্যায় পাওয়া যায়নি' })
        return
      }
      res.json({ chapter })
    },

    async remove(req: Authed & { params: { id: string } }, res: Response) {
      const userId = req.userId!
      const { id } = req.params
      const deleted = await chapterService.remove(userId, id)
      if (!deleted) {
        res.status(404).json({ message: 'অধ্যায় পাওয়া যায়নি' })
        return
      }
      res.status(204).send()
    },
  }
}

export type ChapterController = ReturnType<typeof buildChapterController>
