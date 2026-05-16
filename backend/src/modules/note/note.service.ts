import { Types } from 'mongoose'

import { ChapterModel } from '../chapter/chapter.model.js'
import { SubjectModel } from '../subject/subject.model.js'

import { NoteDoc, NoteModel } from './note.model.js'
import { fetchOpenGraph } from './note.og.js'
import { parseYouTube } from './note.youtube.js'

export type NoteType = 'text' | 'pdf' | 'image' | 'document' | 'url' | 'youtube'

export interface CreateNoteInput {
  subjectId: string
  chapterId?: string | null
  type: NoteType
  title: string
  content?: string | null
  fileUrl?: string | null
  sourceUrl?: string | null
  studyAt?: Date | null

  practiceDeadline?: Date | null
}

export class NoteService {
  async list(filters: {
    userId: string
    subjectId?: string
    chapterId?: string
    type?: NoteType | 'file'
  }): Promise<NoteDoc[]> {
    const q: Record<string, unknown> = {
      userId: new Types.ObjectId(filters.userId),
    }

    if (filters.subjectId) q.subjectId = new Types.ObjectId(filters.subjectId)
    if (filters.chapterId) q.chapterId = new Types.ObjectId(filters.chapterId)
    if (filters.type === 'file') {
      q.type = { $in: ['pdf', 'image', 'document'] }
    } else if (filters.type) {
      q.type = filters.type
    }

    return NoteModel.find(q).sort({ updatedAt: -1 }).exec()
  }

  async create(userId: string, data: CreateNoteInput): Promise<NoteDoc | null> {
    const subOk = await SubjectModel.exists({
      _id: data.subjectId,
      userId: new Types.ObjectId(userId),
    }).exec()
    if (!subOk) return null

    let chapterOid: Types.ObjectId | undefined
    if (data.chapterId) {
      const chOk = await ChapterModel.exists({
        _id: data.chapterId,
        subjectId: data.subjectId,
        userId: new Types.ObjectId(userId),
      }).exec()
      if (!chOk) return null
      chapterOid = new Types.ObjectId(data.chapterId)
    }

    let meta: { title?: string; description?: string; thumbnail?: string } | undefined
    let sourceUrl = data.sourceUrl?.trim()
    const type = data.type

    if (type === 'youtube' && sourceUrl) {
      const yt = parseYouTube(sourceUrl)
      if (!yt) return null
      meta = { title: data.title }
      sourceUrl = yt.embedUrl
    } else if (type === 'url' && sourceUrl) {
      meta = await fetchOpenGraph(sourceUrl)
      if (!meta.title) meta.title = data.title
    }

    const created = await NoteModel.create({
      userId: new Types.ObjectId(userId),
      subjectId: new Types.ObjectId(data.subjectId),
      chapterId: chapterOid,
      type,
      title: data.title.trim(),
      content: data.content ?? undefined,
      fileUrl: data.fileUrl ?? undefined,
      sourceUrl,
      ...(data.studyAt ? { studyAt: data.studyAt } : {}),
      ...(data.practiceDeadline ? { practiceDeadline: data.practiceDeadline } : {}),
      ...(meta ? { urlMetadata: meta } : {}),
    })

    return NoteModel.findById(created._id).exec().then((d) => d!)
  }

  async update(
    userId: string,
    id: string,
    patch: Partial<Omit<CreateNoteInput, 'subjectId'>> & { title?: string }
  ): Promise<NoteDoc | null> {
    const existing = await NoteModel.findOne({
      _id: id,
      userId: new Types.ObjectId(userId),
    }).exec()
    if (!existing) return null

    if (patch.title !== undefined) existing.title = patch.title
    if (patch.content !== undefined) existing.content = patch.content ?? undefined
    if (patch.sourceUrl !== undefined) existing.sourceUrl = patch.sourceUrl ?? undefined
    if (patch.fileUrl !== undefined) existing.fileUrl = patch.fileUrl ?? undefined
    if (patch.type !== undefined) existing.type = patch.type
    if (patch.studyAt !== undefined)
      existing.studyAt = patch.studyAt === null ? undefined : patch.studyAt
    if (patch.practiceDeadline !== undefined)
      existing.practiceDeadline = patch.practiceDeadline === null ? undefined : patch.practiceDeadline

    await existing.save()
    return existing
  }

  async remove(userId: string, id: string): Promise<boolean> {
    const r = await NoteModel.deleteOne({
      _id: id,
      userId: new Types.ObjectId(userId),
    }).exec()
    return r.deletedCount > 0
  }
}
