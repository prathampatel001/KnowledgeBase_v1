import { Response } from 'express';
import User from './userModel';
import bcrypt from 'bcryptjs';
import { AuthenticatedRequest } from '../middlewares/authentication';

// Define the interface for the update fields
interface UpdateFields {
  name?: string;
  password?: string;
  profilePhoto?: string;
}

// Validate the update fields
const validateUpdateFields = (updates: UpdateFields): { valid: boolean, message?: string } => {
  // Check for valid profilePhoto URL if provided
  if (updates.profilePhoto && !isValidURL(updates.profilePhoto)) {
    return { valid: false, message: 'Invalid profile photo URL' };
  }

  // Check for password requirements if provided
  if (updates.password && updates.password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long' };
  }

  return { valid: true };
};

// Helper function to validate URL
const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true; 
  } catch {
    return false;
  }
};

// Update an existing user
export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates: UpdateFields = req.body;

    // Validate the update fields
    const { valid, message } = validateUpdateFields(updates);
    if (!valid) {
      return res.status(400).json({ message });
    }

    // Initialize an object to hold the sanitized update fields
    const updateFields: Partial<UpdateFields> = {};

    // Handle password hashing
    if (updates.password) {
      updateFields.password = await bcrypt.hash(updates.password, 10);
    }

    // Handle other fields (name, profilePhoto)
    if (updates.name) {
      updateFields.name = updates.name;
    }
    if (updates.profilePhoto) {
      updateFields.profilePhoto = updates.profilePhoto;
    }

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};
