import mongoose, { InferSchemaType, Schema } from 'mongoose'

const subjectSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    icon: { type: String, default: '📚' },
    color: { type: String, default: '#6366f1' },
    isDefault: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export type SubjectDoc = InferSchemaType<typeof subjectSchema> & {
  _id: mongoose.Types.ObjectId
}

export const SubjectModel = mongoose.model('Subject', subjectSchema)
