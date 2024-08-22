
import { Request, Response, NextFunction } from 'express';
import { Contributor, ContributorInterface } from './contributorModel';
import { IUser } from '../user/userModel';
import { AuthenticatedRequest } from '../middlewares/authentication';

// Create new Contributor
export const addContributor = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user as IUser;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found or not authenticated.' });
    }

    const { editAccess } = req.body;

    // Ensure that editAccess is either 1 or 2
    if (![1, 2].includes(editAccess)) {
      return res.status(400).json({ message: 'Invalid editAccess value. Must be either 1 (edit) or 2 (view-only).' });
    }

    const newContributor: ContributorInterface = {
      ...req.body,
      userId: req.body.userId, // Get the userId from the frontend
      email: req.body.email || user.email,
      editAccess, // Assign the validated editAccess
    };

    const contributor = new Contributor(newContributor);
    const savedContributor = await contributor.save();

    res.status(201).json(savedContributor);
  } catch (error) {
    next(error);
  }
};


// Delete Contributor
export const deleteContributor = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const user = req.user as IUser;

  try {
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
    }

    // Find the contributor by ID
    const contributor = await Contributor.findById(id);

    if (!contributor) {
      return res.status(404).send('Contributor not found');
    }

    // Check if the userId in the contributor matches the logged-in user's ID
    if (contributor.userId.toString() !== user.id.toString()) {
      return res.status(403).send('Forbidden: You do not have permission to delete this contributor');
    }

    // Delete the contributor
    await Contributor.findByIdAndDelete(id);

    res.status(200).send('Contributor deleted successfully');
  } catch (error) {
    next(error);
  }
};


// Update Contributor
export const updateContributor = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const user = req.user as IUser;

  try {
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
    }

    // Find the contributor by ID
    const contributor = await Contributor.findById(id);

    if (!contributor) {
      return res.status(404).send('Contributor not found');
    }

    // Check if the userId in the contributor matches the logged-in user's ID
    if (contributor.userId.toString() !== user.id.toString()) {
      return res.status(403).send('Forbidden: You do not have permission to update this contributor');
    }

    // Update the contributor with the new data
    const updatedContributor = await Contributor.findByIdAndUpdate(id, req.body, { new: true });

    res.status(200).json(updatedContributor);
  } catch (error) {
    next(error);
  }
};


// Get a specific Contributor
export const getContributorById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const contributor = await Contributor.findById(id);
    if (!contributor) {
      return res.status(404).send('Contributor not found');
    }
    res.status(200).json(contributor);
  } catch (error) {
    next(error);
  }
};

// Get all Contributors with optional email search
export const getAllContributors = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.query;
  
    try {
      // If email query parameter is provided, search by email
      const query = email ? { email: new RegExp(email as string, 'i') } : {};
  
      const contributors = await Contributor.find(query);
      res.status(200).json(contributors);
    } catch (error) {
      next(error);
    }
  };
  
