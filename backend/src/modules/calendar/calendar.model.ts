import mongoose, { InferSchemaType, Schema } from 'mongoose'

const calendarEventSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    title: { type: String, required: true },
    date: { type: Date, required: true, index: true },
    duration: { type: Number, default: 60 },
    isCompleted: { type: Boolean, default: false },
    note: { type: String },
    linkedNoteId: { type: Schema.Types.ObjectId, ref: 'Note', index: true },
    linkedKind: { type: String, enum: ['study', 'deadline'], default: 'study' },
  },
  { timestamps: true }
)

export type CalendarEventDoc = InferSchemaType<typeof calendarEventSchema> & {
  _id: mongoose.Types.ObjectId
}

export const CalendarEventModel = mongoose.model('CalendarEvent', calendarEventSchema)
