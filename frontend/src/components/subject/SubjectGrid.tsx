'use client'

import { useState } from 'react'

import { Plus } from 'lucide-react'

import { SubjectCard } from '@/components/subject/SubjectCard'

import { SubjectForm } from '@/components/subject/SubjectForm'

import { Button } from '@/components/ui/button'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { usePrefetchNotes } from '@/hooks/useNotes'

import { useSubjects } from '@/hooks/useSubjects'

export function SubjectGrid() {

  const { data: subjects, isLoading } = useSubjects()

  const prefetchNotes = usePrefetchNotes()

  const [createOpen, setCreateOpen] = useState(false)

  return (

    <section className="space-y-4">

      <div className="flex flex-wrap items-center justify-between gap-3">

        <div>

          <h1 className="text-2xl font-semibold tracking-tight">আপনার বিষয়সমূহ</h1>

          <p className="text-sm text-muted-foreground">প্রথম লগইনে তিনটি ডিফল্ট বিষয় যোগ হয়। নতুন বিষয় ও নোট যোগ করুন।</p>

        </div>

        <Button type="button" onClick={() => setCreateOpen(true)} className="gap-2">

          <Plus className="h-4 w-4" />

          নতুন বিষয়

        </Button>

      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>

        <DialogContent>

          <DialogHeader>

            <DialogTitle>নতুন বিষয় যোগ করুন</DialogTitle>

          </DialogHeader>

          <SubjectForm onDone={() => setCreateOpen(false)} />

        </DialogContent>

      </Dialog>

      {isLoading ? (

        <p className="text-sm text-muted-foreground">লোড হচ্ছে...</p>

      ) : !subjects?.length ? (

        <p className="text-sm text-muted-foreground">কোনো বিষয় নেই।</p>

      ) : (

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {subjects.map((s) => (

            <SubjectCard key={s._id} subject={s} onPrefetch={() => prefetchNotes(s._id)} />

          ))}

        </div>

      )}

    </section>

  )

}
