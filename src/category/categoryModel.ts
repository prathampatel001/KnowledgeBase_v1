import { Schema, model, Document, Types } from 'mongoose';

// Define the Category interface extending the Document interface from mongoose
interface ICategory extends Document {
  categoryName: string;
  categoryCreatedBy: Types.ObjectId; // Updated to ObjectId type
  isActive: boolean;
}

// Create the schema
const CategorySchema = new Schema<ICategory>({
  categoryName: {
    type: String,
    required: true,
    unique: true,
  },
  categoryCreatedBy: {
    type: Schema.Types.ObjectId, // Reference to User model
    ref: 'User', // Reference to the User collection
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

// Create and export the model
const Category = model<ICategory>('Category', CategorySchema);

export default Category;
