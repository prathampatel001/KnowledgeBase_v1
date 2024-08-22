import mongoose, { Schema, Document } from 'mongoose';

interface PageInterface extends Document {
  title: string;
  content: any;
  contributorId: mongoose.Types.ObjectId[]; // Update to array of ObjectIds
  documentId: mongoose.Types.ObjectId;
  pageNestedUnder?: mongoose.Types.ObjectId[];
}

const pageSchema = new Schema<PageInterface>({
  title: { type: String, required: true },
  content: { type: Schema.Types.Mixed, required: true },
  contributorId: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }], // Update to array
  documentId: { type: Schema.Types.ObjectId, ref: 'Document' },
  pageNestedUnder: [{ type: Schema.Types.ObjectId, ref: 'Page' }],
}, { timestamps: true });

export const Page = mongoose.model<PageInterface>('Page', pageSchema);
