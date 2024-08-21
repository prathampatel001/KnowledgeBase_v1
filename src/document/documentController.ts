import { Request, Response, NextFunction } from 'express';
import { DocumentModel, DocumentInterface } from './documentModel';
import { AuthenticatedRequest } from '../middlewares/authentication';
import { IUser } from '../user/userModel';

// Create new Document
export const addDocument = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Ensure user is authenticated and has necessary permissions
    const user = req.user as IUser;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized: User not found or not authenticated.' });
    }

    // Create a new document instance with the authenticated user's ID
    const document = new DocumentModel({
      ...req.body, // Spread operator to include other fields from the request body
      createdByUserId: user.id, // Set createdByUserId to the authenticated user's ID
    });

    // Save the new document to the database
    const savedDocument = await document.save();

    res.status(201).json(savedDocument);
  } catch (error) {
    next(error);
  }
};

// Delete Document
export const deleteDocument = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    // Ensure user is authenticated
    const user = req.user as IUser;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found or not authenticated.' });
    }

    // Find the document by ID
    const document = await DocumentModel.findById(id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if the authenticated user is the creator of the document
    if (document.createdByUserId.toString() !== user.id.toString()) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to delete this document' });
    }

    // Delete the document
    await document.deleteOne();

    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    next(error);
  }
};


// Update Document
export const updateDocument = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { documentName, status, description, contributors, category, favourite } = req.body;

  try {
    // Ensure user is authenticated
    const user = req.user as IUser;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found or not authenticated.' });
    }

    // Find the document by ID
    const document = await DocumentModel.findById(id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if the authenticated user is the creator of the document
    if (document.createdByUserId.toString() !== user.id.toString()) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to update this document' });
    }

    // Update the document fields with validated data
    const updatedDocument = await DocumentModel.findByIdAndUpdate(id, {
      documentName,
      status,
      description,
      contributors,
      category,
      favourite,
    }, { new: true });

    if (!updatedDocument) {
      return res.status(404).json({ message: 'Document not found' });
    }
  };
  


// Get a specific Document by ID
export const getDocumentById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params; // Extract the document ID from the request parameters
  
    try {
      // Find the document by ID and populate the related fields
      const document = await DocumentModel.findById(id)
        .populate('createdByUserId', 'name email') 
        .populate('contributors', 'email') 
        .populate('category', 'categoryName'); 
  
      if (!document) {
        return res.status(404).send('Document not found'); 
      }
  
      res.status(200).json(document);
    } catch (error) {
      next(error); 
    }
  };
  


// Get all Documents
export const getAllDocuments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const documents = await DocumentModel.find()
        .populate('createdByUserId', 'name email')
        .populate('contributors', 'email')
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
  