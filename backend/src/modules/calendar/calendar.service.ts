import { Types } from 'mongoose'

import { SubjectModel } from '../subject/subject.model.js'

import type { CalendarEventDoc } from './calendar.model.js'
import { CalendarEventModel } from './calendar.model.js'

export class CalendarService {
  async listMonth(userId: string, month: number, year: number): Promise<CalendarEventDoc[]> {
    const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0))
    const end = new Date(Date.UTC(year, month, 1, 0, 0, 0))

    return CalendarEventModel.find({
      userId: new Types.ObjectId(userId),
      date: { $gte: start, $lt: end },
    })
      .sort({ date: 1 })
      .exec()
  }

  async create(
    userId: string,
    data: { subjectId: string; title: string; date: string; duration?: number; note?: string }
  ): Promise<CalendarEventDoc | null> {
    const subExists = await SubjectModel.exists({
      _id: data.subjectId,
      userId: new Types.ObjectId(userId),
    }).exec()

    if (!subExists) return null

    const doc = await CalendarEventModel.create({
      userId: new Types.ObjectId(userId),
      subjectId: new Types.ObjectId(data.subjectId),
      title: data.title,
      date: new Date(data.date),
      duration: data.duration ?? 60,
      note: data.note,
    })

    return CalendarEventModel.findById(doc._id).exec().then((event) => event!)
  }

  async update(
    userId: string,
    id: string,
    patch: Partial<{ title: string; date: string; duration: number; isCompleted: boolean; note: string; subjectId: string }>
  ): Promise<CalendarEventDoc | null> {
    const event = await CalendarEventModel.findOne({
      _id: id,
      userId: new Types.ObjectId(userId),
    }).exec()

    if (!event) return null

    if (patch.title !== undefined) event.title = patch.title
    if (patch.duration !== undefined) event.duration = patch.duration
    if (patch.isCompleted !== undefined) event.isCompleted = patch.isCompleted
    if (patch.note !== undefined) event.note = patch.note

    if (patch.date !== undefined) event.date = new Date(patch.date)

    if (patch.subjectId !== undefined) {
      const subExists = await SubjectModel.exists({
        _id: patch.subjectId,
        userId: new Types.ObjectId(userId),
      }).exec()

      if (!subExists) return null
      event.subjectId = new Types.ObjectId(patch.subjectId)
    }

    await event.save()
    return event
  }

  async remove(userId: string, id: string): Promise<boolean> {
    const result = await CalendarEventModel.deleteOne({
      _id: id,
      userId: new Types.ObjectId(userId),
    }).exec()

    return result.deletedCount > 0
  }
}
