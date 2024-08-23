import { Router } from "express";
import { addDocument, deleteDocument, getAllDocuments, getDocumentById, getAllDocumentsByUsers, updateDocument } from "./documentController";
import { addDocumentValidation, deleteDocumentValidation, getDocumentByIdValidation, updateDocumentValidation } from "./documentValidator";

const documentRoute = Router();

documentRoute.post('/document/add',addDocument)
documentRoute.get('/document/get', getAllDocuments)
documentRoute.get('/document/get/:id' ,getDocumentById)
documentRoute.put('/document/update/:id' ,updateDocument)
documentRoute.delete('/document/delete/:id' ,deleteDocument)
documentRoute.get('/document/getbyuser',getAllDocumentsByUsers)


export default documentRoute

