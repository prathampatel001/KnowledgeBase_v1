import { Request, Response, NextFunction } from 'express';
import { IUser } from '../user/userModel'; // Adjust the import path as needed
import { AuthenticatedRequest } from './authentication';

// Middleware to check if the user has super_user privileges
const authorizeSuperUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const user = req.user as IUser; // Type assertion to ensure req.user is of type IUser

  // Check if user is not defined
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized: User not found or not authenticated.' });
  }

  // Check if user has super_user privileges
  if (user.userType !== 'super_user') {
    return res.status(403).json({ message: 'Forbidden: You do not have permission to perform this action.' });
  }

  // User is authenticated and authorized, proceed to the next middleware or route handler
  next();
};

export default authorizeSuperUser;
