import type { Request, Response } from 'express'

import type { NoteService } from './note.service.js'

import type { NoteType } from './note.service.js'
import { interpretSchedulePatchFromBody, parsePracticeDeadlineDay, parseStudyAt } from './note.schedule.js'
import { uploadNoteFileBuffer } from './note.upload.js'

type MulterReq = Request & {
  userId?: string
  file?: Express.Multer.File
}

type TypedBody = Request & {
  userId?: string
  body: {
    subjectId?: unknown
    chapterId?: unknown
    type?: unknown
    title?: unknown
    content?: unknown
    sourceUrl?: unknown
    fileUrl?: unknown
  }
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length ? value.trim() : undefined
}

function parseListType(raw: string | undefined): NoteType | 'file' | undefined {
  if (!raw?.trim()) return undefined
  const t = raw.trim()
  if (t === 'file') return 'file'
  if (
    t === 'text' ||
    t === 'pdf' ||
    t === 'image' ||
    t === 'document' ||
    t === 'url' ||
    t === 'youtube'
  ) {
    return t as NoteType
  }
  return undefined
}

export function buildNoteController(noteService: NoteService) {
  return {
    async list(req: Request & { userId?: string; query: Record<string, string | undefined> }, res: Response) {
      const userId = req.userId!
      const { subjectId, chapterId, type } = req.query
      const notes = await noteService.list({
        userId,
        subjectId,
        chapterId,
        type: parseListType(type),
      })
      res.json({ notes })
    },

    async create(req: TypedBody, res: Response) {
      const userId = req.userId!

      const subjectId = asString(req.body.subjectId)
      const title = asString(req.body.title)

      const type = asString(req.body.type) as NoteType | undefined
      const chapterId = req.body.chapterId === '' || req.body.chapterId == null ? null : asString(req.body.chapterId)

      if (!subjectId || !title || !type) {
        res.status(400).json({ message: 'বিষয়, শিরোনাম ও ধরন প্রয়োজন' })
        return
      }

      const content = asString(req.body.content) ?? undefined
      const sourceUrl = asString(req.body.sourceUrl) ?? undefined

      const rawBody = req.body as Record<string, unknown>
      const studyAt = parseStudyAt(rawBody.studyAt)
      const practiceDeadline = parsePracticeDeadlineDay(rawBody.practiceDeadline)

      const note = await noteService.create(userId, {
        subjectId,
        chapterId,
        type,
        title,
        content,
        sourceUrl,
        ...(studyAt ? { studyAt } : {}),
        ...(practiceDeadline ? { practiceDeadline } : {}),
      })

      if (!note) {
        res.status(400).json({ message: 'নোট তৈরি করা সম্ভব হয়নি' })
        return
      }

      res.status(201).json({ note })
    },

    async uploadFile(req: MulterReq, res: Response) {
      const userId = req.userId!

      const subjectId = asString((req.body as Record<string, unknown>).subjectId)
      const chapterIdRaw = (req.body as Record<string, unknown>).chapterId
      const chapterId =
        chapterIdRaw === '' || chapterIdRaw == null ? null : asString(chapterIdRaw as unknown)

      const title = asString((req.body as Record<string, unknown>).title)

      if (!subjectId || !title) {
        res.status(400).json({ message: 'বিষয় ও শিরোনাম প্রয়োজন' })
        return
      }

      const file = req.file
      if (!file?.buffer?.length) {
        res.status(400).json({ message: 'ফাইল প্রয়োজন' })
        return
      }

      try {
        const { fileUrl, noteType } = await uploadNoteFileBuffer(
          file.buffer,
          userId,
          file.originalname,
          file.mimetype
        )
        const rawBody = req.body as Record<string, unknown>
        const studyAt = parseStudyAt(rawBody.studyAt)
        const practiceDeadline = parsePracticeDeadlineDay(rawBody.practiceDeadline)

        const note = await noteService.create(userId, {
          subjectId,
          chapterId,
          type: noteType,
          title,
          fileUrl,
          ...(studyAt ? { studyAt } : {}),
          ...(practiceDeadline ? { practiceDeadline } : {}),
        })

        if (!note) {
          res.status(400).json({ message: 'নোট সংরক্ষণ করা সম্ভব হয়নি' })
          return
        }

        res.status(201).json({ note })
      } catch (error) {
        console.error('[note] file upload failed', error)
        res.status(500).json({ message: 'আপলোড ব্যর্থ হয়েছে' })
      }
    },

    async update(req: TypedBody & { params: { id: string } }, res: Response) {
      const userId = req.userId!

      const { id } = req.params

      const patch: Partial<{
        title: string
        content?: string | null
        sourceUrl?: string | null
        fileUrl?: string | null
        type: NoteType
        studyAt?: Date | null
        practiceDeadline?: Date | null
      }> = {}

      const title = asString(req.body.title)

      const contentRaw = req.body.content
      if (contentRaw !== undefined) patch.content = typeof contentRaw === 'string' ? contentRaw : null

      const sourceUrlRaw = req.body.sourceUrl
      if (sourceUrlRaw !== undefined) patch.sourceUrl = typeof sourceUrlRaw === 'string' ? sourceUrlRaw : undefined

      const fileUrlRaw = req.body.fileUrl
      if (fileUrlRaw !== undefined) patch.fileUrl = typeof fileUrlRaw === 'string' ? fileUrlRaw : undefined

      const typeRaw = asString(req.body.type)
      if (
        typeRaw === 'text' ||
        typeRaw === 'pdf' ||
        typeRaw === 'image' ||
        typeRaw === 'document' ||
        typeRaw === 'url' ||
        typeRaw === 'youtube'
      ) {
        patch.type = typeRaw
      }

      if (title) patch.title = title

      Object.assign(patch, interpretSchedulePatchFromBody(req.body as Record<string, unknown>))

      const note = await noteService.update(userId, id, patch as never)
      if (!note) {
        res.status(404).json({ message: 'নোট পাওয়া যায়নি' })
        return
      }

      res.json({ note })
    },

    async remove(req: TypedBody & { params: { id: string } }, res: Response) {
      const userId = req.userId!

      const deleted = await noteService.remove(userId, req.params.id)
      if (!deleted) {
        res.status(404).json({ message: 'নোট পাওয়া যায়নি' })
        return
      }

      res.status(204).send()
    },
  }
}

export type NoteController = ReturnType<typeof buildNoteController>
