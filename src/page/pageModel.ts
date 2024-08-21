import mongoose, { Document, Schema } from "mongoose";

export interface PageInterface extends Document {
  title: string;
  content?: any;//Document can be text or image
  userId:mongoose.Types.ObjectId;
  documentId?: mongoose.Types.ObjectId; // Only for those pages which diretly comes under the document,
  pageNestedUnder?: [{ type: mongoose.Types.ObjectId }]; // any; //An array of the Ids which are nested under this page, (max:3).
  // Only for those pages which comes under some other pages (nested)
}

const ObjectIdReference = { type: mongoose.Schema.Types.ObjectId, ref: "page" };


const pageSchema = new Schema<PageInterface>({
  title: { type: String },
  // document: { type: Array, default: [] },
  content: {
    type: Schema.Types.Mixed,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },

  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "document",
  },
  
  pageNestedUnder: { type:[ObjectIdReference], default: [] },
}, {timestamps: true});

const newPageName="page"
export const Page = mongoose.model<PageInterface>(newPageName, pageSchema)
