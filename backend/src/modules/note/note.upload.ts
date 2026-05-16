import { Readable } from 'node:stream'

import { cloudinary } from '../../config/cloudinary.js'

import type { NoteType } from './note.service.js'

const IMAGE_MIMES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp'])

function noteTypeFromMime(mimetype: string): 'pdf' | 'image' | 'document' | null {
  if (mimetype === 'application/pdf') return 'pdf'
  if (IMAGE_MIMES.has(mimetype)) return 'image'
  if (
    mimetype === 'application/msword' ||
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return 'document'
  }
  return null
}

export async function uploadNoteFileBuffer(
  buffer: Buffer,
  userId: string,
  originalFilename: string | undefined,
  mimetype: string
): Promise<{ fileUrl: string; noteType: NoteType }> {
  const resolved = noteTypeFromMime(mimetype)
  if (!resolved) throw new Error('unsupported file type')

  const safeName =
    (originalFilename ?? 'note').replace(/\..+$/, '').slice(0, 80).replace(/[^\w\-]+/g, '_') || 'note'

  const userSeg = encodeURIComponent(userId)

  if (resolved === 'image') {
    const fileUrl = await new Promise<string>((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: `noteshala/${userSeg}/image`,
          resource_type: 'image',
          use_filename: true,
          filename_override: safeName,
        },
        (error, result) => {
          if (error || !result?.secure_url) reject(error ?? new Error('Cloudinary upload failed'))
          else resolve(result.secure_url)
        }
      )
      Readable.from(buffer).pipe(upload)
    })
    return { fileUrl, noteType: 'image' }
  }

  const fileUrl = await new Promise<string>((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder: `noteshala/${userSeg}/files`,
        resource_type: 'raw',
        use_filename: true,
        filename_override: safeName,
      },
      (error, result) => {
        if (error || !result?.secure_url) reject(error ?? new Error('Cloudinary upload failed'))
        else resolve(result.secure_url)
      }
    )
    Readable.from(buffer).pipe(upload)
  })

  const noteType: NoteType = resolved === 'pdf' ? 'pdf' : 'document'
  return { fileUrl, noteType }
}
