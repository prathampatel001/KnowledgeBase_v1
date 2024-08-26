import { Router } from "express";
import { addDocument, deleteDocument, getAllDocuments, getDocumentById, getAllDocumentsByUsers, updateDocument } from "./documentController";

const documentRoute = Router();

documentRoute.post('/document/add',addDocument)
documentRoute.get('/document/getAllDocuments', getAllDocuments)
documentRoute.get('/document/get/:id' ,getDocumentById)
documentRoute.put('/document/update/:id' ,updateDocument)
documentRoute.delete('/document/delete/:id' ,deleteDocument)
documentRoute.get('/document/getDocByUserId',getAllDocumentsByUsers)


export default documentRoute

