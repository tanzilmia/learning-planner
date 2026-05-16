import { Types } from 'mongoose'

import { SubjectModel } from '../subject/subject.model.js'

import type { ProgressDoc } from './progress.model.js'
import { ProgressModel } from './progress.model.js'

export type ProgressStatus = 'not_started' | 'in_progress' | 'completed'

export class ProgressService {
  async list(userId: string, subjectId?: string): Promise<ProgressDoc[]> {
    const q: Record<string, unknown> = { userId: new Types.ObjectId(userId) }
    if (subjectId) q.subjectId = new Types.ObjectId(subjectId)
    return ProgressModel.find(q).sort({ date: -1 }).exec()
  }

  async create(
    userId: string,
    payload: {
      subjectId: string
      chapterId?: string
      date: string
      minutesRead: number
      status: ProgressStatus
    }
  ): Promise<ProgressDoc | null> {
    const subOk = await SubjectModel.exists({
      _id: payload.subjectId,
      userId: new Types.ObjectId(userId),
    }).exec()

    if (!subOk) return null

    const row = await ProgressModel.create({
      userId: new Types.ObjectId(userId),
      subjectId: new Types.ObjectId(payload.subjectId),
      chapterId: payload.chapterId ? new Types.ObjectId(payload.chapterId) : undefined,
      date: new Date(payload.date),
      minutesRead: payload.minutesRead,
      status: payload.status,
    })

    const doc = await ProgressModel.findById(row._id).exec()

    return doc
  }

  async update(
    userId: string,
    id: string,
    patch: Partial<{ date: string; minutesRead: number; status: ProgressStatus; chapterId: string | null }>
  ): Promise<ProgressDoc | null> {
    const existing = await ProgressModel.findOne({
      _id: id,
      userId: new Types.ObjectId(userId),
    }).exec()

    if (!existing) return null

    if (patch.date !== undefined) existing.date = new Date(patch.date)

    if (patch.minutesRead !== undefined) existing.minutesRead = patch.minutesRead

    if (patch.status !== undefined) existing.status = patch.status as never

    if (patch.chapterId !== undefined) {
      existing.chapterId = patch.chapterId ? new Types.ObjectId(patch.chapterId) : undefined
    }

    await existing.save()

    return existing
  }

  async remove(userId: string, id: string): Promise<boolean> {
    const result = await ProgressModel.deleteOne({
      _id: id,
      userId: new Types.ObjectId(userId),
    }).exec()

    return result.deletedCount > 0
  }

  async summary(userId: string): Promise<{ weeklyMinutes: number; monthlyMinutes: number }> {
    const now = new Date()
    const day = now.getUTCDay()
    const diff = (day + 6) % 7
    const startOfWeek = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - diff, 0, 0, 0))

    const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0))

    const sumSince = async (since: Date): Promise<number> => {
      const rows = await ProgressModel.aggregate([
        { $match: { userId: new Types.ObjectId(userId), date: { $gte: since } } },
        { $group: { _id: null, minutes: { $sum: '$minutesRead' } } },
      ]).exec()

      return Number(rows?.[0]?.minutes ?? 0)
    }

    const [weeklyMinutes, monthlyMinutes] = await Promise.all([sumSince(startOfWeek), sumSince(startOfMonth)])

    return { weeklyMinutes, monthlyMinutes }
  }
}
