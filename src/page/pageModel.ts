import mongoose, { Document, Schema } from "mongoose";

export interface PageInterface extends Document {
  title: string;
  document?: any;//Document can be text or image
  authorName?: string;
  authorEmail: string;
  //   isDeleted?: Boolean;
  collectionId?: mongoose.Types.ObjectId; // Only for those pages which diretly comes under the document,
  pageNestedUnder?: [{ type: mongoose.Types.ObjectId }]; // any; //An array of the Ids which are nested under this page, (max:3).
  // Only for those pages which comes under some other pages (nested)
}

const ObjectIdReference = { type: mongoose.Schema.Types.ObjectId, ref: "page" };


const pageSchema = new Schema<PageInterface>({
  title: { type: String },
  // document: { type: Array, default: [] },
  document: {
    type: Schema.Types.Mixed,
  },
  authorName: { type: String },
  authorEmail: { type: String },
  //   isDeleted: { type: Boolean, default: false },
  collectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "collection",
  },
  
  pageNestedUnder: { type:[ObjectIdReference], default: [] },
}, {timestamps: true});

const newPageName="page"
export const Page = mongoose.model<PageInterface>(newPageName, pageSchema)
