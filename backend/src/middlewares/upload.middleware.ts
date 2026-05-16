import multer from 'multer'

import { isAllowedNoteFileMime } from '../constants/note-file-upload.js'

const storage = multer.memoryStorage()

export const uploadNoteFileMiddleware = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (isAllowedNoteFileMime(file.mimetype)) {
      cb(null, true)
      return
    }
    cb(new Error('শুধুমাত্র ছবি (JPEG, PNG, GIF, WebP), পিডিএফ ও ওয়ার্ড (.doc, .docx) ফাইল আপলোড করা যাবে'))
  },
}).single('file')
