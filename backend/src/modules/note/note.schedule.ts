/** Parse ISO datetime strings from the client for `studyAt`. */
export function parseStudyAt(raw: unknown): Date | undefined {
  if (typeof raw !== 'string' || !raw.trim()) return undefined
  const d = new Date(raw.trim())
  return Number.isNaN(d.getTime()) ? undefined : d
}

/**
 * Deadline as calendar day yyyy-mm-dd; stored at UTC noon to stay inside the chosen month boundaries.
 */
export function parsePracticeDeadlineDay(raw: unknown): Date | undefined {
  if (typeof raw !== 'string' || !raw.trim()) return undefined
  const s = raw.trim()
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s)
  if (!m) return undefined
  const y = Number(m[1])
  const mo = Number(m[2])
  const d = Number(m[3])
  if (!y || mo < 1 || mo > 12 || d < 1 || d > 31) return undefined
  return new Date(Date.UTC(y, mo - 1, d, 12, 0, 0))
}

/** Same calendar-day as `event.date`; stored UTC noon like `parsePracticeDeadlineDay`. */
export function practiceDeadlineFromLocalInstant(d: Date): Date {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0))
}

export function interpretSchedulePatchFromBody(body: Record<string, unknown>): {
  studyAt?: Date | null
  practiceDeadline?: Date | null
} {
  const out: { studyAt?: Date | null; practiceDeadline?: Date | null } = {}

  if ('studyAt' in body) {
    const v = body.studyAt
    if (v === '' || v === null) out.studyAt = null
    else if (typeof v === 'string') {
      const parsed = parseStudyAt(v)
      if (parsed) out.studyAt = parsed
    }
  }

  if ('practiceDeadline' in body) {
    const v = body.practiceDeadline
    if (v === '' || v === null) out.practiceDeadline = null
    else if (typeof v === 'string') {
      const parsed = parsePracticeDeadlineDay(v)
      if (parsed) out.practiceDeadline = parsed
    }
  }

  return out
}
