
import { Request, Response, NextFunction } from 'express';
import { Contributor, ContributorInterface } from './contributorModel';

// Create new Contributor
export const addContributor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newContributor: ContributorInterface = req.body;
    const contributor = new Contributor(newContributor);
    const savedContributor = await contributor.save();


    res.status(201).json(savedContributor);
  } catch (error) {
    next(error);
  }
};

// Delete Contributor
export const deleteContributor = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const deletedContributor = await Contributor.findByIdAndDelete(id);
    if (!deletedContributor) {
      return res.status(404).send('Contributor not found');
    }

    res.status(200).send('Contributor deleted successfully');
  } catch (error) {
    next(error);
  }
};

// Update Contributor
export const updateContributor = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const updatedContributor = await Contributor.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedContributor) {
      return res.status(404).send('Contributor not found');
    }

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
  
