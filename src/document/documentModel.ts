import mongoose, { Document, Schema } from "mongoose";

export interface DocumentInterface extends Document {
documentName: string;
  status: string; // Draft/ Public
  createdByUserId:mongoose.Types.ObjectId;
//   createdBy: string;
//   email: string;
  description: string;
  contributors?: mongoose.Types.ObjectId[];
  category?: mongoose.Types.ObjectId;
  favourite: boolean;
}

const documentSchema = new Schema<DocumentInterface>(
  {
    documentName: { type: String },
    status: { type: String, default: "Draft" },
    description: { type: String },
    createdByUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Reference to the User model()
        required: true,
      },

    contributors: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Contributor', // Reference to the Contributor model
        }],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    }, // For v2, we can create a new DB for categories and can join it with this,

    favourite: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const newDocumentName = "document";
export const DocumentModel = mongoose.model<DocumentInterface>(newDocumentName, documentSchema);
