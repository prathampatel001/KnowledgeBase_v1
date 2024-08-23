import { Request, Response, NextFunction } from 'express';
import { DocumentModel } from './documentModel';
import CategoryModel from '../category/categoryModel';
import { AuthenticatedRequest } from '../middlewares/authentication';
import { IUser } from '../user/userModel';
import { z } from 'zod';
import mongoose from 'mongoose';
import { Contributor } from '../contributor/contributorModel';
import redisClient from '../config/redisDB';

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

    console.log("user",user);
    
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
    // Delete the cached Pages
    await redisClient?.del("allDocuments");

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

    await redisClient?.del("allDocuments");

    const documentKey = `singleDocument:${id}`;
    await redisClient?.del(documentKey);

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

    if (!updatedDocument) {
      return res.status(404).json({ message: 'Document not found' });

    }
    await redisClient?.del("allDocuments");
    const documentKey = `singleDocument:${id}`;
    await redisClient?.del(documentKey);
    res.status(200).json(updatedDocument);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input', errors: error.errors });
    }
  }
};

// Get a specific Document by ID
export const getDocumentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params; // Extract the document ID from the request parameters
    const cacheKey = `singleDocument:${id}`;
    // Check if the document is cached
    const cachedDocument = await redisClient?.get(cacheKey);
    if (cachedDocument) {
      console.log('Returning cached Document');
      return res.status(200).json(JSON.parse(cachedDocument));
    }
    // Find the document by ID and populate the related fields
    const document = await DocumentModel.findById(id)
      .populate('createdByUserId', 'name email')
      .populate('category', 'categoryName');

    if (!document) {
      return res.status(404).send('Document not found');
    }

    // Cache the document
    await redisClient?.set(cacheKey, JSON.stringify(document), {
      EX: 1800, // Cache expires in 30 minutes
    });

    res.status(200).json(document);
  } catch (error) {
    next(error);
  }
};

// Get all Documents
export const getAllDocuments = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const cachedDocuments = await redisClient?.get('allDocuments');
    if (cachedDocuments) {
      console.log('Returning cached Documents');
      return res.status(200).json(JSON.parse(cachedDocuments));
    }

    const documents = await DocumentModel.find()
      .populate('createdByUserId', 'name email')
      .populate('category', 'categoryName')
      .sort({ createdAt: -1 })
      .lean();

    if (documents.length === 0) {
      return res.status(404).json({ message: 'No documents found' });
    }

    await redisClient?.set('allDocuments', JSON.stringify(documents), {
      EX: 1800, // Cache expires in 30 minutes
    });

    res.status(200).json(documents);
  } catch (error) {
    next(error);
  }
};

// Get all Documents for the logged-in user
export const getAllDocumentsByUsers = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user as IUser;

    console.log("user",user);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
    }

    console.log("user.id",user.id);
    
    const cacheKey = `allDocuments:${user.id}`;
    console.log("cacheKey",cacheKey);
    
    const cachedDocuments = await redisClient?.get(cacheKey);
    if (cachedDocuments) {
      console.log('Returning cached Documents for user');
      return res.status(200).json(JSON.parse(cachedDocuments));
    } else{
    const documents = await DocumentModel.find({ createdByUserId: user.id })
      .populate('createdByUserId', 'name email')
      .populate('category', 'categoryName')
      .sort({ createdAt: -1 })
      .lean();

    if (documents.length === 0) {
      return res.status(404).json({ message: 'No documents found for the current user' });
    }

    await redisClient?.set(cacheKey, JSON.stringify(documents), {
      EX: 1800, // Cache expires in 30 minutes
    });

    res.status(200).json({ user, documents });
    }


  } catch (error) {
    next(error);
  }
};





