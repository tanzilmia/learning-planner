import mongoose, { InferSchemaType, Schema } from 'mongoose'

const urlMetadataSchema = new Schema(
  {
    title: { type: String },
    description: { type: String },
    thumbnail: { type: String },
  },
  { _id: false }
)

const noteSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
    chapterId: { type: Schema.Types.ObjectId, ref: 'Chapter', index: true },
    type: { type: String, enum: ['text', 'pdf', 'url', 'youtube'], required: true },
    title: { type: String, required: true, trim: true },
    content: { type: String },
    fileUrl: { type: String },
    sourceUrl: { type: String },
    urlMetadata: { type: urlMetadataSchema },
  },
  { timestamps: true }
)

noteSchema.index({ userId: 1, subjectId: 1, chapterId: 1 })

export type NoteDoc = InferSchemaType<typeof noteSchema> & { _id: mongoose.Types.ObjectId }

export const NoteModel = mongoose.model('Note', noteSchema)
