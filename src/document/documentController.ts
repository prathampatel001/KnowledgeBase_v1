import { Request, Response, NextFunction } from 'express';
import { DocumentModel, DocumentInterface } from './documentModel';

// Create new Document
export const addDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newDocument: DocumentInterface = req.body;
    const document = new DocumentModel(newDocument);
    const savedDocument = await document.save();

    res.status(201).json(savedDocument);
  } catch (error) {
    next(error);
  }
};

// Delete Document
export const deleteDocument = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const deletedDocument = await DocumentModel.findByIdAndDelete(id);
    if (!deletedDocument) {
      return res.status(404).send('Document not found');
    }

    res.status(200).send('Document deleted successfully');
  } catch (error) {
    next(error);
  }
};

// Update Document
export const updateDocument = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
  
    try {
      // Find the document by ID and update it, returning the updated document
      const updatedDocument = await DocumentModel.findByIdAndUpdate(id, req.body, { new: true });
  
      if (!updatedDocument) {
        return res.status(404).send('Document not found');
      }
  
      res.status(200).json(updatedDocument);
    } catch (error) {
      next(error);
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
  