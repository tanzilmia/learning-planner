import { Readable } from 'node:stream'

import { cloudinary } from '../../config/cloudinary.js'

export async function uploadPdfBuffer(buffer: Buffer, userId: string, originalFilename?: string): Promise<string> {
  const safeName =
    (originalFilename ?? 'note').replace(/\..+$/, '').slice(0, 80).replace(/[^\w\-]+/g, '_')

  const folder = `noteshala/${encodeURIComponent(userId)}/pdf`

  return await new Promise<string>((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'raw',
        use_filename: true,
        filename_override: safeName.length ? safeName : 'note',
      },
      (error, result) => {
        if (error || !result?.secure_url) reject(error ?? new Error('Cloudinary upload failed'))
        else resolve(result.secure_url)
      }
    )

    Readable.from(buffer).pipe(upload)
  })
}
