import { Request, Response, NextFunction } from 'express';
import { DocumentModel } from './documentModel';
import CategoryModel from '../category/categoryModel';
import { AuthenticatedRequest } from '../middlewares/authentication';
import { IUser } from '../user/userModel';
import { z } from 'zod';
import mongoose from 'mongoose';
import { Contributor } from '../contributor/contributorModel';

// Zod schemas for input validation
const documentSchema = z.object({
  documentName: z.string().min(1, 'Document name is required'),
  status: z.string().optional(),
  description: z.string().optional(),
  category: z.string().refine(
    (id) => mongoose.Types.ObjectId.isValid(id),
    { message: 'Invalid category ID' }
  ),
  favourite: z.boolean().optional(),
});

const updateDocumentSchema = documentSchema.partial(); // Allows partial updates

// Create new Document
export const addDocument = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user as IUser;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
    }

    // Validate the document data
    const documentData = documentSchema.parse(req.body);

    // Fetch the category by ID from the Category schema
    const category = await CategoryModel.findById(documentData.category);
    if (!category) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    // Create a new document instance with the validated data and authenticated user's ID
    const document = new DocumentModel({
      ...documentData,
      createdByUserId: user.id,
    });

    // Save the new document to the database
    const savedDocument = await document.save();

    // Create a new Contributor entry with editAccess set to 0
    const contributorData = {
      documentId: savedDocument._id, // Document ID
      userId: user.id, // Authenticated user ID
      email: user.email, // Optionally include user's email
      editAccess: 0, // Owner access
    };

    // Save the new Contributor entry
    const contributor = new Contributor(contributorData);
    await contributor.save();

    res.status(201).json(savedDocument);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input', errors: error.errors });
    }
    next(error);
  }
};

// Delete Document
export const deleteDocument = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const user = req.user as IUser;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
    }

    // Find the document by ID
    const document = await DocumentModel.findById(id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if the user is a contributor with editAccess level 0
    const contributor = await Contributor.findOne({
      documentId: document._id,
      userId: user.id,
    });

    if (!contributor || contributor.editAccess !== 0) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to delete this document' });
    }

    // Proceed with the deletion
    await document.deleteOne();

    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Update Document
export const updateDocument = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const user = req.user as IUser;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
    }

    // Validate update data
    const updateData = updateDocumentSchema.parse(req.body);

    // Find the document by ID
    const document = await DocumentModel.findById(id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if the user is a contributor with editAccess level 0 or 1
    const contributor = await Contributor.findOne({
      documentId: document._id,
      userId: user.id,
    });

    if (!contributor || (contributor.editAccess !== 0 && contributor.editAccess !== 1)) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to update this document' });
    }

    // Proceed with the update
    const updatedDocument = await DocumentModel.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json(updatedDocument);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input', errors: error.errors });
    }
    next(error);
  }
};

// Get a specific Document by ID
export const getDocumentById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const document = await DocumentModel.findById(id)
      .populate('createdByUserId', 'name email')
      .populate('category', 'categoryName');

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if the user is a contributor with editAccess level 0
    const contributor = await Contributor.findOne({
      documentId: document._id,
    });

    res.status(200).json({document,contributor});
  } catch (error) {
    next(error);
  }
};

// Get all Documents
export const getAllDocuments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const documents = await DocumentModel.find()
      .populate('createdByUserId', 'name email')
      .populate('category', 'categoryName')
      .sort({ createdAt: -1 })
      .lean();

    if (documents.length === 0) {
      return res.status(404).json({ message: 'No documents found' });
    }

    res.status(200).json(documents);
  } catch (error) {
    next(error);
  }
};
