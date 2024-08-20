import { Schema, model, Document } from 'mongoose';

// Define the user type enum
enum UserType {
  USER = 'user',
  SUPER_USER = 'super_user',
}

// Define the User interface extending the Document interface from mongoose
interface IUser extends Document {
  name: string;
  userType: UserType;
  email: string;
  password: string;
  profilePhoto: string;
}

// Create the schema
const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: Object.values(UserType),
    required: true,
    default: UserType.USER,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePhoto: {
    type: String,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

// Create and export the model
const User = model<IUser>('User', UserSchema);

export default User;
