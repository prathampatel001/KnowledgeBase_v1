import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for the Document model
export interface DocumentInterface extends Document {
  documentName: string;
  status: string; // Using string here to match the custom validation
  createdByUserId: mongoose.Types.ObjectId;
  description: string;
  category: mongoose.Types.ObjectId;
  favourite: boolean;
}

// Function to validate the status value
function validateCategories(value: string): boolean {
  const allowedCategories = ['Draft', 'Public'];
  return allowedCategories.includes(value);
}

// Define the schema for the Document model
export const DocumentSchema = new Schema<DocumentInterface>(
  {
    documentName: {
      type: String,
      required: true, // Ensuring that documentName is required
    },
    status: {
      type: String,
      validate: {
        validator: validateCategories, // Using custom validation function
        message: (props: { value: string }) => `${props.value} is not a valid status`, // Custom error message
      },
      default: 'Draft',
    },
    description: {
      type: String,
      required: true, // Ensuring that description is required
    },
    createdByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category', // Reference to the Category model
    },
    favourite: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Create and export the Document model
export const DocumentModel = mongoose.model<DocumentInterface>('Document', DocumentSchema);
