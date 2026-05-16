import 'dotenv/config'

import { createExpressApp } from './app.js'

import { connectDatabase } from './config/db.js'
import { configureCloudinary } from './config/cloudinary.js'
import { configurePassport } from './config/passport.js'

import { errorHandler } from './middlewares/error.middleware.js'

import { authRoutes } from './modules/auth/auth.routes.js'

import { buildAuthController } from './modules/auth/auth.controller.js'
import { AuthService } from './modules/auth/auth.service.js'
import { buildChapterController } from './modules/chapter/chapter.controller.js'
import { chapterRoutesNested, chapterRoutesFlat } from './modules/chapter/chapter.routes.js'
import { ChapterService } from './modules/chapter/chapter.service.js'
import { buildCalendarController } from './modules/calendar/calendar.controller.js'
import { calendarRoutes } from './modules/calendar/calendar.routes.js'
import { CalendarService } from './modules/calendar/calendar.service.js'
import { buildNoteController } from './modules/note/note.controller.js'
import { noteRoutes } from './modules/note/note.routes.js'
import { NoteService } from './modules/note/note.service.js'
import { buildProgressController } from './modules/progress/progress.controller.js'
import { progressRoutes } from './modules/progress/progress.routes.js'
import { ProgressService } from './modules/progress/progress.service.js'
import { buildSubjectController } from './modules/subject/subject.controller.js'
import { subjectRoutes } from './modules/subject/subject.routes.js'
import { SubjectService } from './modules/subject/subject.service.js'

import { UserService } from './modules/user/user.service.js'

async function main() {
  const mongoUri = process.env.MONGODB_URI
  const jwtSecret = process.env.JWT_SECRET
  const googleClientId = process.env.GOOGLE_CLIENT_ID
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
  const googleCallbackUrl = process.env.GOOGLE_CALLBACK_URL

  const clientUrl = process.env.CLIENT_URL ?? 'http://localhost:3000'

  const port = Number(process.env.PORT ?? '5000')

  if (!mongoUri) throw new Error('MONGODB_URI is required')

  if (!jwtSecret) throw new Error('JWT_SECRET is required')

  if (!googleClientId) throw new Error('GOOGLE_CLIENT_ID is required for verifying Google tokens')

  await connectDatabase(mongoUri)

  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    configureCloudinary()
  }

  if (!googleClientId || !googleClientSecret || !googleCallbackUrl) {
    console.warn('[boot] Passport Google OAuth is not configured (missing Google env)')
  } else {
    configurePassport(googleClientId, googleClientSecret, googleCallbackUrl)
  }

  const users = new UserService()
  const subjects = new SubjectService()

  const authService = new AuthService(users, async (uid) => {
    await subjects.seedDefaultsForNewUser(uid)
  })

  const chapters = new ChapterService()
  const notes = new NoteService()
  const calendar = new CalendarService()
  const progress = new ProgressService()

  const authController = buildAuthController(authService, users)
  const chapterController = buildChapterController(chapters)
  const subjectController = buildSubjectController(subjects)

  const noteController = buildNoteController(notes)
  const calendarController = buildCalendarController(calendar)

  const progressController = buildProgressController(progress)

  const app = createExpressApp(clientUrl)

  app.use('/api/auth', authRoutes(authController, authService))
  app.use('/api/subjects', subjectRoutes(subjectController, authService))
  app.use('/api/subjects/:subjectId/chapters', chapterRoutesNested(chapterController, authService))
  app.use('/api/chapters', chapterRoutesFlat(chapterController, authService))

  app.use('/api/notes', noteRoutes(noteController, authService))
  app.use('/api/calendar', calendarRoutes(calendarController, authService))
  app.use('/api/progress', progressRoutes(progressController, authService))

  app.use(errorHandler)

  app.listen(port, () => console.log(`[noteshala-api] Listening on ${port}`))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
