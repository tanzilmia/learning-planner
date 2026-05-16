import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'

import { calendarKeys } from '@/hooks/useCalendar'

import type { Note, NoteType } from '@/types/models'

export type NotesListTypeFilter = NoteType | 'file'

export const noteKeys = {
  all: ['notes'] as const,

  list: (filters: { subjectId?: string; chapterId?: string; type?: NotesListTypeFilter | 'all' }) =>
    [...noteKeys.all, 'list', filters] as const,
}

async function fetchNotes(filters: { subjectId?: string; chapterId?: string; type?: NotesListTypeFilter }) {
  const params = new URLSearchParams()

  if (filters.subjectId) params.set('subjectId', filters.subjectId)
  if (filters.chapterId) params.set('chapterId', filters.chapterId)
  if (filters.type) params.set('type', filters.type)

  const qs = params.toString()
  const { data } = await api.get<{ notes: Note[] }>(`/notes${qs ? `?${qs}` : ''}`)
  return data.notes
}

async function invalidateNoteAndCalendar(qc: ReturnType<typeof useQueryClient>) {
  await Promise.all([
    qc.invalidateQueries({ queryKey: noteKeys.all }),
    qc.invalidateQueries({ queryKey: calendarKeys.all }),
  ])
}

export function useNotes(filters: { subjectId?: string; chapterId?: string; type?: NotesListTypeFilter | 'all' }) {
  const activeType = filters.type === 'all' || !filters.type ? undefined : filters.type

  return useQuery({
    enabled: !!filters.subjectId,
    queryKey: noteKeys.list(filters),
    queryFn: async () =>
      fetchNotes({
        subjectId: filters.subjectId,
        chapterId: filters.chapterId,
        type: activeType,
      }),
  })
}

export function usePrefetchNotes() {
  const qc = useQueryClient()

  return (subjectId: string, chapterId?: string) => {
    const filters = { subjectId, chapterId, type: 'all' as const }
    void qc.prefetchQuery({
      queryKey: noteKeys.list(filters),
      queryFn: () => fetchNotes({ subjectId, chapterId }),
    })
  }
}

export function useCreateNote() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {
      subjectId: string
      chapterId?: string | null
      type: NoteType
      title: string
      content?: string
      sourceUrl?: string
      studyAt?: string
      practiceDeadline?: string
    }) => {
      const { data } = await api.post<{ note: Note }>('/notes', payload)
      return data.note
    },
    onSuccess: async () => {
      await invalidateNoteAndCalendar(qc)
    },
  })
}

export function useUploadFileNote() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (vars: {
      subjectId: string
      chapterId?: string | null
      title: string
      file: File
      studyAt?: string
      practiceDeadline?: string
      onProgress?: (pct: number) => void
    }) => {
      const fd = new FormData()

      fd.append('subjectId', vars.subjectId)
      if (vars.chapterId) fd.append('chapterId', vars.chapterId)

      fd.append('title', vars.title)
      fd.append('file', vars.file)

      if (vars.studyAt) fd.append('studyAt', vars.studyAt)
      if (vars.practiceDeadline) fd.append('practiceDeadline', vars.practiceDeadline)

      const { data } = await api.post<{ note: Note }>('/notes/upload', fd, {
        onUploadProgress: (evt) => {
          if (!vars.onProgress || !evt.total) return
          vars.onProgress(Math.round((evt.loaded / evt.total) * 100))
        },
      })

      return data.note
    },
    onSuccess: async () => {
      await invalidateNoteAndCalendar(qc)
    },
  })
}

/** @deprecated use useUploadFileNote */
export const useUploadPdfNote = useUploadFileNote

export function useUpdateNote() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {
      id: string

      title?: string

      content?: string | null

      sourceUrl?: string | null

      fileUrl?: string | null

      type?: NoteType

      studyAt?: string | null

      practiceDeadline?: string | null
    }) => {
      const { id, ...patch } = payload
      const { data } = await api.put<{ note: Note }>(`/notes/${id}`, patch)

      return data.note
    },
    onSuccess: async () => {
      await invalidateNoteAndCalendar(qc)
    },
  })
}

export function useDeleteNote() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/notes/${id}`)
    },
    onSuccess: async () => {
      await invalidateNoteAndCalendar(qc)
    },
  })
}
