'use client'

import { useMemo, useState } from 'react'

import type { ProgressStatus } from '@/types/models'

import { Button } from '@/components/ui/button'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { Input } from '@/components/ui/input'

import { Label } from '@/components/ui/label'

import { Separator } from '@/components/ui/separator'

import { useChapters } from '@/hooks/useChapters'

import { useCreateProgress, useDeleteProgress, useProgress } from '@/hooks/useProgress'

import { useSubjects } from '@/hooks/useSubjects'

const STATUS_LABELS: Record<ProgressStatus, string> = {

  not_started: 'শুরু হয়নি',

  in_progress: 'চলছে',

  completed: 'সম্পন্ন',

}

export function SubjectProgress() {

  const { data: subjects } = useSubjects()

  const [subjectPick, setSubjectPick] = useState<string>('')

  const { data: chapters } = useChapters(subjectPick || undefined)

  const { data: rows } = useProgress(subjectPick || undefined)

  const createRow = useCreateProgress()

  const delRow = useDeleteProgress()

  const sorted = useMemo(() => [...(rows ?? [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [rows])

  const [open, setOpen] = useState(false)

  const [minutes, setMinutes] = useState(25)

  const [status, setStatus] = useState<ProgressStatus>('in_progress')

  const [chapterPick, setChapterPick] = useState('')

  const [when, setWhen] = useState(() => new Date().toISOString().slice(0, 16))

  const resetForm = () => {

    setMinutes(25)

    setStatus('in_progress')

    setChapterPick('')

    setWhen(new Date().toISOString().slice(0, 16))

  }

  const submit = async () => {

    if (!subjectPick) return

    await createRow.mutateAsync({

      subjectId: subjectPick,

      chapterId: chapterPick || undefined,

      date: new Date(when).toISOString(),

      minutesRead: minutes,

      status,

    })

    resetForm()

    setOpen(false)

  }

  const subjectName = (id: string) => subjects?.find((s) => s._id === id)?.name ?? id

  return (

    <Card>

      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <CardTitle className="text-base">লগ ও বিস্তারিত</CardTitle>

          <p className="text-sm text-muted-foreground">বিষয় ফিল্টার করে অগ্রগতির লগ দেখুন ও যোগ করুন।</p>

        </div>

        <Button type="button" onClick={() => setOpen(true)} disabled={!subjectPick}>

          নতুন লগ

        </Button>

      </CardHeader>

      <CardContent className="space-y-4">

        <div className="space-y-2">

          <Label>বিষয় ফিল্টার</Label>

          <select

            className="flex h-10 w-full max-w-md rounded-md border border-input bg-background px-3 text-sm"

            value={subjectPick}

            onChange={(e) => setSubjectPick(e.target.value)}

          >

            <option value="">সব বিষয়</option>

            {subjects?.map((s) => (

              <option key={s._id} value={s._id}>

                {s.icon} {s.name}

              </option>

            ))}

          </select>

        </div>

        <Separator />

        {!sorted.length ? (

          <p className="text-sm text-muted-foreground">কোনো লগ নেই। বিষয় নির্বাচন করে ফিল্টার করুন।</p>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left text-sm">

              <thead>

                <tr className="border-b text-muted-foreground">

                  <th className="py-2 pr-3">তারিখ</th>

                  <th className="py-2 pr-3">বিষয়</th>

                  <th className="py-2 pr-3">মিনিট</th>

                  <th className="py-2 pr-3">অবস্থা</th>

                  <th className="py-2">কর্ম</th>

                </tr>

              </thead>

              <tbody>

                {sorted.map((r) => (

                  <tr key={r._id} className="border-b border-border/60">

                    <td className="py-2 pr-3">{new Date(r.date).toLocaleString('bn-BD')}</td>

                    <td className="py-2 pr-3">{subjectName(r.subjectId)}</td>

                    <td className="py-2 pr-3">{r.minutesRead}</td>

                    <td className="py-2 pr-3">{STATUS_LABELS[r.status]}</td>

                    <td className="py-2">

                      <Button variant="ghost" size="sm" type="button" onClick={() => void delRow.mutateAsync(r._id)}>

                        মুছুন

                      </Button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>

        <DialogContent>

          <DialogHeader>

            <DialogTitle>অগ্রগতির লগ যোগ করুন</DialogTitle>

          </DialogHeader>

          <div className="space-y-3">

            <div className="space-y-2">

              <Label>অধ্যায় (ঐচ্ছিক)</Label>

              <select

                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"

                value={chapterPick}

                onChange={(e) => setChapterPick(e.target.value)}

              >

                <option value="">অধ্যায় ছাড়া</option>

                {chapters?.map((c) => (

                  <option key={c._id} value={c._id}>

                    {c.title}

                  </option>

                ))}

              </select>

            </div>

            <div className="grid gap-3 sm:grid-cols-2">

              <div className="space-y-2">

                <Label htmlFor="pg-min">মিনিট</Label>

                <Input id="pg-min" type="number" min={1} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} />

              </div>

              <div className="space-y-2">

                <Label>অবস্থা</Label>

                <select

                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"

                  value={status}

                  onChange={(e) => setStatus(e.target.value as ProgressStatus)}

                >

                  {(Object.keys(STATUS_LABELS) as ProgressStatus[]).map((k) => (

                    <option key={k} value={k}>

                      {STATUS_LABELS[k]}

                    </option>

                  ))}

                </select>

              </div>

            </div>

            <div className="space-y-2">

              <Label htmlFor="pg-when">সময়</Label>

              <Input id="pg-when" type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} />

            </div>

            <Button type="button" className="w-full" disabled={!subjectPick || createRow.isPending} onClick={() => void submit()}>

              সংরক্ষণ করুন

            </Button>

          </div>

        </DialogContent>

      </Dialog>

    </Card>

  )

}
