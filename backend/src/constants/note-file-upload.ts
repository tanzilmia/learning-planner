/** Allowed MIME types for note file uploads (images, PDFs, Word). */
export const NOTE_FILE_MIMES: readonly string[] = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

export function isAllowedNoteFileMime(mimetype: string): boolean {
  return NOTE_FILE_MIMES.includes(mimetype)
}
