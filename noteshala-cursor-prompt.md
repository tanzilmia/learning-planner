# NoteShala (নোটশালা) — Cursor Project Prompt

## ROLE

You are an expert full-stack developer. Your job is to build a complete production-ready web application called **NoteShala (নোটশালা)** — a Bangla-language study note management system. Follow every instruction in this file precisely. Do not skip any section. Ask for clarification only if something is genuinely ambiguous.

---

## WHAT IS THIS APP

NoteShala is a personal study notes web app written entirely in Bangla language (UI text). Students can:
- Log in with Google
- See default subjects (বাংলা, ইংরেজি, গণিত) on first login
- Add their own subjects with a custom icon and color
- Write notes under each subject, organized by chapter
- Save notes as: typed text, uploaded PDF, saved URL, or YouTube/video link
- Track their learning progress per subject and chapter
- Plan their reading schedule using a calendar
- Switch between dark and light mode

---

## TECH STACK

### Frontend
- Next.js **16.2.6** with App Router
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui for components
- next-auth **v5** — Google login only
- next-themes — dark/light mode
- Axios — HTTP client
- TanStack Query **v5** — all server state and data fetching
- Zustand **v5** — UI state only (modals, sidebar, active tabs)
- Tiptap — rich text editor for text notes
- FullCalendar React v6 — calendar UI
- Turbopack for dev server

### Backend
- Node.js with Express.js
- TypeScript throughout
- Strictly modular pattern (one folder per feature)
- Mongoose as MongoDB ODM
- Passport.js with Google OAuth 2.0 strategy
- JWT for authentication — token validity **30 days**
- Multer for file uploads
- Cloudinary for PDF/file storage

### Database
- MongoDB

---

## PROJECT STRUCTURE

### Frontend folder layout
```
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/login/page.tsx
│   │   ├── (dashboard)/page.tsx
│   │   ├── (dashboard)/subject/[id]/page.tsx
│   │   ├── (dashboard)/subject/[id]/chapter/[chapterId]/page.tsx
│   │   ├── (dashboard)/calendar/page.tsx
│   │   ├── (dashboard)/progress/page.tsx
│   │   ├── (dashboard)/settings/page.tsx
│   │   ├── api/auth/[...nextauth]/route.ts
│   │   ├── layout.tsx
│   │   └── providers.tsx
│   ├── components/
│   │   ├── ui/               ← shadcn components
│   │   ├── layout/           ← Sidebar, Header, MobileNav
│   │   ├── subject/          ← SubjectCard, SubjectGrid, SubjectForm
│   │   ├── note/             ← NoteList, NoteCard, NoteForm, editors/
│   │   ├── chapter/          ← ChapterSidebar, ChapterForm
│   │   ├── calendar/         ← CalendarView, EventForm
│   │   └── progress/         ← ProgressOverview, SubjectProgress
│   ├── hooks/                ← useSubjects, useNotes, useChapters, useCalendar, useProgress
│   ├── lib/                  ← api.ts (Axios instance), utils.ts
│   ├── store/                ← uiStore.ts, userStore.ts (Zustand)
│   ├── types/                ← subject.ts, note.ts, chapter.ts, calendar.ts, progress.ts
│   └── auth.ts               ← next-auth v5 config
```

### Backend folder layout
```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/             ← controller, service, routes, middleware
│   │   ├── user/             ← controller, service, routes, model
│   │   ├── subject/          ← controller, service, routes, model
│   │   ├── chapter/          ← controller, service, routes, model
│   │   ├── note/             ← controller, service, routes, model
│   │   ├── calendar/         ← controller, service, routes, model
│   │   └── progress/         ← controller, service, routes, model
│   ├── config/               ← db.ts, passport.ts
│   ├── middlewares/          ← auth.middleware.ts, upload.middleware.ts
│   └── app.ts
```

---

## DATABASE COLLECTIONS

### users
- googleId (unique), name, email (unique), avatar, theme (light/dark), createdAt

### subjects
- userId, name, icon (emoji), color (hex), isDefault (boolean), order, createdAt

### chapters
- userId, subjectId, title, order, createdAt

### notes
- userId, subjectId, chapterId (optional), type (text/pdf/url/youtube), title, content (Tiptap HTML), fileUrl (Cloudinary), sourceUrl, urlMetadata (title, description, thumbnail), createdAt, updatedAt

### calendar_events
- userId, subjectId, title, date, duration (minutes), isCompleted, note, createdAt

### progress
- userId, subjectId, chapterId (optional), date, minutesRead, status (not_started/in_progress/completed), createdAt

---

## API DESIGN

All routes under `/api`. All routes except `/api/auth/*` require `Authorization: Bearer <token>`.

### Auth
- `POST /api/auth/google` — verify Google id_token, create user if new, return JWT
- `GET /api/auth/me` — return current user from JWT

### Subjects
- `GET /api/subjects` — all subjects for user, sorted by order
- `POST /api/subjects` — create subject
- `PUT /api/subjects/:id` — update name, icon, color
- `DELETE /api/subjects/:id` — delete (reject if isDefault)

### Chapters
- `GET /api/subjects/:subjectId/chapters` — all chapters
- `POST /api/subjects/:subjectId/chapters` — create chapter
- `PUT /api/chapters/:id` — update title or order
- `DELETE /api/chapters/:id` — delete chapter

### Notes
- `GET /api/notes?subjectId=&chapterId=&type=` — filtered notes list
- `POST /api/notes` — create text, url, or youtube note
- `POST /api/notes/upload` — upload PDF (multipart/form-data) to Cloudinary
- `PUT /api/notes/:id` — update note
- `DELETE /api/notes/:id` — delete note

### Calendar
- `GET /api/calendar?month=&year=` — events for a month
- `POST /api/calendar` — create event
- `PUT /api/calendar/:id` — update or mark as complete
- `DELETE /api/calendar/:id` — delete event

### Progress
- `GET /api/progress?subjectId=` — progress records
- `POST /api/progress` — log a progress entry
- `PUT /api/progress/:id` — update progress record
- `GET /api/progress/summary` — weekly and monthly reading stats

---

## STRICT RULES — READ CAREFULLY

### Next.js 15 rules
- `params` and `searchParams` props are async — always `await params` before using them
- Always set `--turbopack` flag in the dev script
- Always set `cache` explicitly on every `fetch` call — there is no default
- Use next-auth **v5** API only: `auth()`, `handlers`, `signIn`, `signOut` — never v4 syntax

### Backend modular pattern rules
Every module must be split into exactly these four files with strict separation of concerns:
- `*.routes.ts` — route definitions and middleware assignment only, zero logic
- `*.controller.ts` — parse request, call service, return JSON response only
- `*.service.ts` — all business logic and all Mongoose/DB operations
- `*.model.ts` — Mongoose schema and model export only

### Authentication rules
- Google login is the **only** login method — no email/password
- After verifying the Google token on the backend, issue a custom JWT with 30-day expiry
- On a user's **very first login**, auto-create three default subjects: বাংলা, ইংরেজি, গণিত
- Default subjects can be renamed but **cannot be deleted**
- Store JWT in httpOnly cookie on the frontend
- Protect all non-auth backend routes with JWT middleware

### TanStack Query rules
- Use TanStack Query v5 for **all** server data fetching — never useEffect + useState for API calls
- Create one custom hook file per feature inside `/hooks`
- Each hook file must export: one `useQuery` hook and `useMutation` hooks for create, update, delete
- Use array-based query keys for all queries
- After every mutation `onSuccess`, invalidate the relevant query keys
- On subject page hover, prefetch that subject's notes using `queryClient.prefetchQuery`
- For PDF upload mutation, track upload progress using Axios `onUploadProgress`

### Zustand rules
- Zustand is for **UI state only**: sidebar open/close, active modal, active tab, theme preference
- Never store server/API data in Zustand — that belongs in TanStack Query

### Note types rules
- **text** — Tiptap rich text editor, saves HTML string to `content` field
- **pdf** — Multer upload → Cloudinary → save `fileUrl`, render in frontend with a PDF viewer
- **url** — save the URL and fetch Open Graph metadata (title, description, thumbnail) on the backend
- **youtube** — detect YouTube URL, save embed URL, render with iframe embed

### UI rules
- Every single UI text string must be in **Bangla language**
- Support dark mode and light mode using next-themes with a toggle in settings
- Design must be fully responsive and mobile-first
- Use Hind Siliguri font from Google Fonts for Bangla text rendering
- Each subject card must show its custom emoji icon and color
- Notes list must be filterable by type (text, pdf, url, youtube)
- Subject page must have a chapter sidebar for navigation between chapters

---

## ENVIRONMENT VARIABLES

### Backend `.env`
```
PORT=5000
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=30d
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLIENT_URL=http://localhost:3000
```

### Frontend `.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
```

---

## BUILD ORDER

Build in this exact sequence. Do not move to the next step until the current one is complete and working.

1. Backend project setup — tsconfig, Express app, MongoDB connection, error handler
2. User model + Google OAuth strategy + JWT issue endpoint
3. JWT auth middleware — protect all private routes
4. Subject module — full CRUD + default subject seeding on first login
5. Chapter module — full CRUD
6. Note module — text, url, youtube first, then PDF upload with Cloudinary
7. Calendar module — full CRUD
8. Progress module — CRUD + summary endpoint
9. Frontend project setup — Next.js 15.2.6, Tailwind, shadcn init, Google Fonts (Hind Siliguri)
10. next-auth v5 config + Google provider + middleware route protection
11. Login page — Google sign-in button only, Bangla text
12. Axios instance with JWT interceptor + TanStack Query provider setup
13. Zustand stores — uiStore, userStore
14. All TypeScript types in `/types`
15. All custom TanStack Query hooks in `/hooks`
16. Layout components — Sidebar, Header, MobileNav (responsive)
17. Dashboard page — subject grid with add, edit, delete
18. Subject page — chapter sidebar + note list + note type filter tabs
19. Note editors — Tiptap text editor, PDF viewer, URL card with metadata, YouTube embed
20. Calendar page — FullCalendar with event create, edit, delete, mark complete
21. Progress page — subject-wise and chapter-wise progress with summary stats
22. Settings page — dark/light mode toggle, profile info display
23. Final pass — dark mode polish across all pages, mobile responsiveness fixes, Bangla font check

---

## PACKAGE VERSIONS TO USE

### Frontend
```
next: 15.2.6
react: ^19.0.0
react-dom: ^19.0.0
next-auth: ^5.0.0
next-themes: ^0.4.4
axios: ^1.7.0
@tanstack/react-query: ^5.0.0
@tanstack/react-query-devtools: ^5.0.0
zustand: ^5.0.0
@tiptap/react: ^2.0.0
@fullcalendar/react: ^6.0.0
tailwindcss: ^3.4.0
typescript: ^5.0.0
@types/react: ^19.0.0
@types/node: ^22.0.0
```

### Backend
```
express: ^4.21.0
mongoose: ^8.0.0
passport: ^0.7.0
passport-google-oauth20: ^2.0.0
jsonwebtoken: ^9.0.0
multer: ^1.4.5
cloudinary: ^2.0.0
cors: ^2.8.5
dotenv: ^16.0.0
typescript: ^5.0.0
```
### Database 

```
mongodb+srv://learning-routine:02xV8wB2I0tvtoWD@cluster0.vexdo8q.mongodb.net/?appName=Cluster0

```


### Cloudinary

```

CLOUDINARY_CLOUD_NAME=learning-routine
CLOUDINARY_API_KEY=818583261377961
CLOUDINARY_API_SECRET=x48679AkEcqAIn3ur-TevsR8PWg

```