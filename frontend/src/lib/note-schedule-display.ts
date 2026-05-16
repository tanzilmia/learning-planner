/** Convert stored ISO practice deadline (UTC calendar day) to yyyy-mm-dd for <input type="date"> */
export function deadlineIsoToDateInput(iso?: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
}

/** Convert ISO to value for `<input type="datetime-local">` using local timezone */
export function studyIsoToDatetimeLocal(iso?: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${day}T${h}:${min}`
}

export function formatStudyAtBn(iso?: string): string {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleString('bn-BD', { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    return ''
  }
}

export function formatDeadlineDateBn(iso?: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())).toLocaleDateString('bn-BD', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function deadlineCountdownBn(iso?: string): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null

  const y = d.getUTCFullYear()
  const mo = d.getUTCMonth()
  const day = d.getUTCDate()

  const endUtc = Date.UTC(y, mo, day)
  const now = new Date()
  const startToday = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())

  const diffDays = Math.round((endUtc - startToday) / 86400000)

  if (diffDays < 0) return `ডেডলাইন থেকে হেরে গেছে — ${Math.abs(diffDays)} দিন আগে`
  if (diffDays === 0) return 'আজই প্র্যাক্টিসের শেষ দিন'
  if (diffDays === 1) return 'আর ১ দিন বাকি (ডেডলাইন পর্যন্ত)'
  return `প্র্যাক্টিস ডেডলাইন পর্যন্ত আর ${diffDays} দিন বাকি`
}
