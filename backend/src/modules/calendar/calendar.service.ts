import { Types } from 'mongoose'

import { NoteModel } from '../note/note.model.js'
import { practiceDeadlineFromLocalInstant } from '../note/note.schedule.js'
import { SubjectModel } from '../subject/subject.model.js'

import type { CalendarNoteSlot } from './calendar.types.js'

import type { CalendarEventDoc } from './calendar.model.js'

import { CalendarEventModel } from './calendar.model.js'

export type CalendarCreateInput = {
  subjectId: string
  title: string
  date: string
  duration?: number
  note?: string
  linkedNoteId?: string
  linkedKind?: 'study' | 'deadline'
}

export type CalendarServiceUpdateOutcome =
  | { ok: true; event: CalendarEventDoc }
  | { ok: false; reason: 'NOT_FOUND' | 'SUBJECT_LOCKED' }

function noteSlotDedupeKey(noteId: string, slotType: string) {
  return `${noteId}_${slotType}`
}

export class CalendarService {
  async listMonth(
    userId: string,
    month: number,
    year: number
  ): Promise<{ events: CalendarEventDoc[]; noteSlots: CalendarNoteSlot[] }> {
    const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0))
    const end = new Date(Date.UTC(year, month, 1, 0, 0, 0))

    const [events, noteDocs] = await Promise.all([
      CalendarEventModel.find({
        userId: new Types.ObjectId(userId),
        date: { $gte: start, $lt: end },
      })
        .sort({ date: 1 })
        .exec(),
      NoteModel.find({
        userId: new Types.ObjectId(userId),
        $or: [
          { studyAt: { $gte: start, $lt: end } },
          { practiceDeadline: { $gte: start, $lt: end } },
        ],
      })
        .select('title subjectId chapterId studyAt practiceDeadline')
        .lean()
        .exec(),
    ])

    const noteSlots: CalendarNoteSlot[] = []

    type Lean = {
      _id: Types.ObjectId
      title: string
      subjectId: Types.ObjectId
      chapterId?: Types.ObjectId
      studyAt?: Date
      practiceDeadline?: Date
    }

    for (const raw of noteDocs as Lean[]) {
      if (raw.studyAt && raw.studyAt >= start && raw.studyAt < end) {
        noteSlots.push({
          noteId: String(raw._id),
          subjectId: String(raw.subjectId),
          chapterId: raw.chapterId ? String(raw.chapterId) : null,
          title: raw.title,
          slotType: 'study',
          date: raw.studyAt,
        })
      }
      const pd = raw.practiceDeadline
      if (pd && pd >= start && pd < end) {
        noteSlots.push({
          noteId: String(raw._id),
          subjectId: String(raw.subjectId),
          chapterId: raw.chapterId ? String(raw.chapterId) : null,
          title: raw.title,
          slotType: 'deadline',
          date: pd,
        })
      }
    }

    const linkedCalendarKeys = new Set<string>()
    for (const ev of events as CalendarEventDoc[]) {
      const lid = ev.linkedNoteId
      if (!lid) continue
      const k = ev.linkedKind === 'deadline' ? 'deadline' : 'study'
      linkedCalendarKeys.add(noteSlotDedupeKey(String(lid), k))
    }

    const filteredNoteSlots = noteSlots.filter(
      (s) => !linkedCalendarKeys.has(noteSlotDedupeKey(s.noteId, s.slotType))
    )

    return { events, noteSlots: filteredNoteSlots }
  }

  private async assertLinkedNoteMatchesSubject(
    userId: string,
    subjectId: string,
    noteIdStr: string
  ): Promise<boolean> {
    const note = await NoteModel.findOne({
      _id: new Types.ObjectId(noteIdStr),
      userId: new Types.ObjectId(userId),
    })
      .select('subjectId')
      .lean()
      .exec()

    if (!note) return false
    return String((note as { subjectId: Types.ObjectId }).subjectId) === subjectId
  }

  private async syncNoteFromLinkedEvent(
    userId: string,
    noteIdStr: string,
    kind: 'study' | 'deadline',
    eventDate: Date
  ): Promise<void> {
    const oid = new Types.ObjectId(noteIdStr)
    const uid = new Types.ObjectId(userId)
    const filter = { _id: oid, userId: uid }
    if (kind === 'study') {
      await NoteModel.updateOne(filter, { $set: { studyAt: eventDate } }).exec()
    } else {
      await NoteModel.updateOne(filter, {
        $set: { practiceDeadline: practiceDeadlineFromLocalInstant(eventDate) },
      }).exec()
    }
  }

  private async clearNoteScheduleForLink(
    userId: string,
    noteIdStr: string,
    kind: 'study' | 'deadline'
  ): Promise<void> {
    const oid = new Types.ObjectId(noteIdStr)
    const uid = new Types.ObjectId(userId)
    const filter = { _id: oid, userId: uid }
    if (kind === 'study') await NoteModel.updateOne(filter, { $unset: { studyAt: 1 } }).exec()
    else await NoteModel.updateOne(filter, { $unset: { practiceDeadline: 1 } }).exec()
  }

  async create(userId: string, data: CalendarCreateInput): Promise<CalendarEventDoc | null> {
    const subjectIdTrim = data.subjectId.trim()

    const subExists = await SubjectModel.exists({
      _id: subjectIdTrim,
      userId: new Types.ObjectId(userId),
    }).exec()

    if (!subExists) return null

    let linkedNoteId: Types.ObjectId | undefined
    let linkedKind: 'study' | 'deadline' = data.linkedKind === 'deadline' ? 'deadline' : 'study'

    const rawLink = typeof data.linkedNoteId === 'string' ? data.linkedNoteId.trim() : ''
    if (rawLink) {
      const matches = await this.assertLinkedNoteMatchesSubject(userId, subjectIdTrim, rawLink)
      if (!matches) return null
      linkedNoteId = new Types.ObjectId(rawLink)
    }

    const doc = await CalendarEventModel.create({
      userId: new Types.ObjectId(userId),
      subjectId: new Types.ObjectId(subjectIdTrim),
      title: data.title,
      date: new Date(data.date),
      duration: data.duration ?? 60,
      note: data.note,
      ...(linkedNoteId ? { linkedNoteId, linkedKind } : {}),
    })

    const event = await CalendarEventModel.findById(doc._id).exec()
    if (!event) return null

    if (linkedNoteId) {
      await this.syncNoteFromLinkedEvent(userId, linkedNoteId.toString(), linkedKind, event.date as Date)
    }

    return event
  }

  async update(
    userId: string,
    id: string,
    patch: Partial<{
      title: string
      date: string
      duration: number
      isCompleted: boolean
      note: string
      subjectId: string
    }>
  ): Promise<CalendarServiceUpdateOutcome> {
    const uid = new Types.ObjectId(userId)

    const event = await CalendarEventModel.findOne({
      _id: id,
      userId: uid,
    }).exec()

    if (!event) return { ok: false, reason: 'NOT_FOUND' }

    if (
      patch.subjectId !== undefined &&
      event.linkedNoteId &&
      patch.subjectId !== String(event.subjectId)
    ) {
      return { ok: false, reason: 'SUBJECT_LOCKED' }
    }

    if (patch.title !== undefined) event.title = patch.title
    if (patch.duration !== undefined) event.duration = patch.duration
    if (patch.isCompleted !== undefined) event.isCompleted = patch.isCompleted
    if (patch.note !== undefined) event.note = patch.note

    if (patch.date !== undefined) event.date = new Date(patch.date)

    if (patch.subjectId !== undefined) {
      const subExists = await SubjectModel.exists({
        _id: patch.subjectId,
        userId: uid,
      }).exec()

      if (!subExists) return { ok: false, reason: 'NOT_FOUND' }
      event.subjectId = new Types.ObjectId(patch.subjectId)
    }

    await event.save()

    const lid = event.linkedNoteId
    if (lid) {
      const kind = event.linkedKind === 'deadline' ? 'deadline' : 'study'
      await this.syncNoteFromLinkedEvent(userId, String(lid), kind, event.date as Date)
    }

    return { ok: true, event }
  }

  async remove(userId: string, id: string): Promise<boolean> {
    const uid = new Types.ObjectId(userId)
    const event = await CalendarEventModel.findOne({ _id: id, userId: uid }).exec()

    if (!event) return false

    const linked = event.linkedNoteId
    const kind = event.linkedKind === 'deadline' ? 'deadline' : 'study'

    const result = await CalendarEventModel.deleteOne({
      _id: id,
      userId: uid,
    }).exec()

    if (result.deletedCount === 0) return false

    if (linked) {
      await this.clearNoteScheduleForLink(userId, String(linked), kind)
    }

    return true
  }
}
