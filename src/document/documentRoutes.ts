import { Router } from "express";
import { addDocument, deleteDocument, getAllDocuments, getDocumentById, updateDocument } from "./documentController";
import { addDocumentValidation, deleteDocumentValidation, getDocumentByIdValidation, updateDocumentValidation } from "./documentValidator";

const documentRoute = Router();

documentRoute.post('/document/add', addDocumentValidation,addDocument)
documentRoute.get('/document/get', getAllDocuments)
documentRoute.get('/document/get/:id', getDocumentByIdValidation ,getDocumentById)
documentRoute.put('/document/update/:id', updateDocumentValidation ,updateDocument)
documentRoute.delete('/document/delete/:id', deleteDocumentValidation ,deleteDocument)

export default documentRoute

