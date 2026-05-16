export type CalendarNoteSlot = {
  noteId: string
  subjectId: string
  chapterId: string | null
  title: string
  slotType: 'study' | 'deadline'
  date: Date
}
