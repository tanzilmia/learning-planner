'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'

import { Label } from '@/components/ui/label'

import { useCreateSubject } from '@/hooks/useSubjects'

export function SubjectForm({ onDone }: { onDone?: () => void }) {

  const create = useCreateSubject()

  const [name, setName] = useState('')

  const [icon, setIcon] = useState('📚')

  const [color, setColor] = useState('#6366f1')

  const submit = async (e: React.FormEvent) => {

    e.preventDefault()

    if (!name.trim()) return

    await create.mutateAsync({ name: name.trim(), icon, color })

    setName('')

    onDone?.()

  }

  return (

    <form className="space-y-4" onSubmit={(e) => void submit(e)}>

      <div className="space-y-2">

        <Label htmlFor="sub-name">বিষয়ের নাম</Label>

        <Input id="sub-name" value={name} onChange={(e) => setName(e.target.value)} required />

      </div>

      <div className="grid grid-cols-2 gap-3">

        <div className="space-y-2">

          <Label htmlFor="sub-icon">আইকন (ইমোজি)</Label>

          <Input id="sub-icon" value={icon} onChange={(e) => setIcon(e.target.value)} />

        </div>

        <div className="space-y-2">

          <Label htmlFor="sub-color">রং</Label>

          <Input id="sub-color" type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 p-1" />

        </div>

      </div>

      <Button type="submit" disabled={create.isPending} className="w-full">

        {create.isPending ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}

      </Button>

    </form>

  )

}
