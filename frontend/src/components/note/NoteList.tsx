'use client'

import type { Note } from '@/types/models'

import { NoteCard } from '@/components/note/NoteCard'

export function NoteList({ notes, isLoading }: { notes: Note[] | undefined; isLoading: boolean }) {

  if (isLoading) return <p className="text-sm text-muted-foreground">নোট লোড হচ্ছে...</p>

  if (!notes?.length) return <p className="text-sm text-muted-foreground">এই ফিল্টারে কোনো নোট নেই।</p>

  return (

    <div className="grid gap-4 lg:grid-cols-2">

      {notes.map((n) => (

        <NoteCard key={n._id} note={n} />

      ))}

    </div>

  )

}
