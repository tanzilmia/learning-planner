import multer from 'multer'

const storage = multer.memoryStorage()

export const uploadPdfMiddleware = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true)

      return
    }
    cb(new Error('শুধুমাত্র পিডিএফ ফাইল আপলোড করা যাবে'))
  },
}).single('file')
