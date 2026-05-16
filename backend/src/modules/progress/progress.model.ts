import mongoose, { InferSchemaType, Schema } from 'mongoose'

const progressSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    chapterId: { type: Schema.Types.ObjectId, ref: 'Chapter' },
    date: { type: Date, required: true, index: true },
    minutesRead: { type: Number, default: 0 },
    status: { type: String, enum: ['not_started', 'in_progress', 'completed'], required: true },
  },
  
  { timestamps: { createdAt: true, updatedAt: false } }
)

progressSchema.index({ userId: 1, subjectId: 1 })

export type ProgressDoc = InferSchemaType<typeof progressSchema> & { _id: mongoose.Types.ObjectId }

export const ProgressModel = mongoose.model('Progress', progressSchema)
