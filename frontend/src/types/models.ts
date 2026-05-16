export interface Subject {

  _id: string


  userId?: string


  name: string


  icon: string


  color: string


  isDefault: boolean


  order: number


  createdAt?: string


}

export interface Chapter {

  _id: string


  userId?: string


  subjectId: string


  title: string


  order: number


  createdAt?: string


}

export type NoteType = 'text' | 'pdf' | 'image' | 'document' | 'url' | 'youtube'

export interface Note {

  _id: string


  userId?: string


  subjectId: string


  chapterId?: string


  type: NoteType


  title: string


  content?: string


  fileUrl?: string


  sourceUrl?: string


  urlMetadata?: {


    title?: string


    description?: string


    thumbnail?: string


  }


  studyAt?: string


  practiceDeadline?: string


  createdAt?: string


  updatedAt?: string


}

export interface CalendarEvent {

  _id: string


  userId?: string


  subjectId: string


  title: string


  date: string


  duration: number


  isCompleted: boolean


  note?: string


  linkedNoteId?: string


  linkedKind?: 'study' | 'deadline'


  createdAt?: string


}

export interface CalendarNoteSlot {

  noteId: string


  subjectId: string


  chapterId: string | null


  title: string


  slotType: 'study' | 'deadline'


  date: string


}

export type ProgressStatus = 'not_started' | 'in_progress' | 'completed'

export interface ProgressRow {

  _id: string


  userId?: string


  subjectId: string


  chapterId?: string


  date: string


  minutesRead: number


  status: ProgressStatus


  createdAt?: string


}

export interface BackendUser {

  id: string


  name: string


  email: string


  avatar: string | null


  theme: 'light' | 'dark'


  createdAt?: string


}
