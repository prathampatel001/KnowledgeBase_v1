import mongoose, { Document, Schema } from "mongoose";

export interface ContributorInterface extends Document {
  documentId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  email?: string; 
  editAccess: 0 | 1 | 2; // 0 for owner, 1 for edit, 2 for view only
}

const contributorSchema = new Schema<ContributorInterface>(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'document', // Reference to the Document model
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user', // Reference to the User model
      required: true,
    },
    email: {
      type: String,
      required: function() {
        return !this.userId; // email is required if userId is not provided
      },
    },
    editAccess: {
      type: Number,
      enum: [0, 1, 2], // 0 for owner, 1 for edit, 2 for view only
      required: true,
    },
  },
  { timestamps: true }
);

export const Contributor = mongoose.model<ContributorInterface>('Contributor', contributorSchema);
