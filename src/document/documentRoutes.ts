import { Router } from "express";
import { addDocument, deleteDocument, getAllDocuments, getDocumentById, updateDocument } from "./documentController";
import { addDocumentValidation, deleteDocumentValidation, getDocumentByIdValidation, updateDocumentValidation } from "./documentValidator";

const documentRoute = Router();

documentRoute.post('/document/add',addDocument)
documentRoute.get('/document/get', getAllDocuments)
documentRoute.get('/document/get/:id' ,getDocumentById)
documentRoute.put('/document/update/:id' ,updateDocument)
documentRoute.delete('/document/delete/:id' ,deleteDocument)

export default documentRoute

