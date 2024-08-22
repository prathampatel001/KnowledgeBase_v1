import { Request, Response, NextFunction } from 'express';
import { Page } from './pageModel';
import { AuthenticatedRequest } from '../middlewares/authentication';
import { IUser } from '../user/userModel';
import { z } from 'zod';
import mongoose from 'mongoose';
import { Contributor, ContributorInterface } from '../contributor/contributorModel';

const pageSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.any(), // Mixed types
  contributorId: z.string().refine((id) => mongoose.isValidObjectId(id), {
    message: 'Invalid user ID',
  }).optional(), // Expecting a single userId instead of an array
  documentId: z.string().refine((id) => mongoose.isValidObjectId(id), {
    message: 'Invalid document ID',
  }),
  pageNestedUnder: z.array(z.string().refine((id) => mongoose.isValidObjectId(id), {
    message: 'Invalid pageNestedUnder ID',
  })).optional(),
});

// Create a partial schema for updates
const updatePageSchema = pageSchema.partial();

// Create new Page
export const addPage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user as IUser;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
    }

    // Validate input
    const pageData = pageSchema.parse(req.body);
    console.log(pageData);

    // Fetch the contributor for the document
    const contributor = await Contributor.findOne({
      documentId: pageData.documentId,
      userId: user.id,
    });

    if (!contributor) {
      return res.status(403).json({ message: 'Forbidden: You are not a contributor for this document.' });
    }

    // Check if the contributor has owner access
    if (contributor.editAccess !== 0) {
      return res.status(403).json({ message: 'Forbidden: You do not have the required access to add a page.' });
    }

    // Create a plain object for the new page
    const newPageData = {
      ...pageData,
      contributorId: contributor._id, // Include the logged-in user ID
    };

    // Create and save the new page document
    const page = new Page(newPageData);
    const savedPage = await page.save();
    console.log(savedPage);

    res.status(201).json(savedPage);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input', errors: error.errors });
    }
    next(error);
  }
};

// Delete Page
export const deletePage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const user = req.user as IUser;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
    }

    // Find the page by ID
    const page = await Page.findById(id);
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    // Fetch the contributor for the document
    const contributor = await Contributor.findOne({
      documentId: page.documentId,
      userId: user.id,
    });

    if (!contributor) {
      return res.status(403).json({ message: 'Forbidden: You are not a contributor for this document.' });
    }

    // Check if the contributor has edit access level 0
    if (contributor.editAccess !== 0) {
      return res.status(403).json({ message: 'Forbidden: You do not have the required access to delete this page.' });
    }

    // Delete the page
    await page.deleteOne();

    res.status(200).json({ message: 'Page deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Update Page
export const updatePage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const user = req.user as IUser;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
    }

    // Validate input
    const updateData = updatePageSchema.parse(req.body);

    // Find the page by ID
    const page = await Page.findById(id);
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    // Fetch the contributor for the document
    const contributor = await Contributor.findOne({
      documentId: page.documentId,
      userId: user.id,
    });

    if (!contributor) {
      return res.status(403).json({ message: 'Forbidden: You are not a contributor for this document.' });
    }

    // Check if the contributor has edit access level 0 or 1
    if (contributor.editAccess !== 0 && contributor.editAccess !== 1) {
      return res.status(403).json({ message: 'Forbidden: You do not have the required access to update this page.' });
    }

     // Directly add the contributor ID to the array and update the document in one step
    const updatedPage = await Page.findByIdAndUpdate(
      id,
      {
        ...updateData,
        $push: { contributorId: contributor.id }, // Use $push to add the contributor ID
      },
      { new: true }
    );

    res.status(200).json(updatedPage);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input', errors: error.errors });
    }
    next(error);
  }
};

// Get Single Page by ID
export const getPageById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const user = req.user as IUser;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
    }

    // Find the page by ID
    const page = await Page.findById(id)
      .populate({
        path: 'pageNestedUnder',
        populate: {
          path: 'pageNestedUnder',
          populate: {
            path: 'pageNestedUnder',
            populate: {
              path: 'pageNestedUnder',
            },
          },
        },
      })
      .populate('documentId')
      .populate({
        path: 'contributorId',
        select: 'documentId userId',
      });

    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    // Check if the user is a collaborator on the document
    const contributor = await Contributor.findOne({
      documentId: page.documentId,
      userId: user.id,
    });

    if (!contributor) {
      return res.status(403).json({ message: 'Forbidden: You are not a collaborator on this document.' });
    }

    res.status(200).json(page);
  } catch (error) {
    next(error);
  }
};

// Get all Pages
export const getAllPages = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user as IUser;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
    }

    // Find all contributors for the user's documents
    const contributors = await Contributor.find({ userId: user.id });

    if (contributors.length === 0) {
      return res.status(403).json({ message: 'Forbidden: You are not a collaborator on any documents.' });
    }

    // Extract document IDs where the user is a contributor
    const documentIds = contributors.map(contributor => contributor.documentId);

    // Find pages associated with the documents the user is a contributor on
    const pages = await Page.find({ documentId: { $in: documentIds } })
      .populate({
        path: 'pageNestedUnder',
        populate: {
          path: 'pageNestedUnder',
          populate: {
            path: 'pageNestedUnder',
            populate: {
              path: 'pageNestedUnder',
            },
          },
        },
      })
      .populate('documentId')
      .populate({
        path: 'userId',
        select: 'name email',
      })
      .sort({ createdAt: -1 })
      .lean();

    if (pages.length === 0) {
      return res.status(404).json({ message: 'No pages found for your documents.' });
    }

    res.status(200).json(pages);
  } catch (error) {
    next(error);
  }
};

