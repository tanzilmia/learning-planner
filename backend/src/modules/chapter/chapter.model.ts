import mongoose, { InferSchemaType, Schema } from 'mongoose'

const chapterSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
    title: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export type ChapterDoc = InferSchemaType<typeof chapterSchema> & { _id: mongoose.Types.ObjectId }

export const ChapterModel = mongoose.model('Chapter', chapterSchema)
