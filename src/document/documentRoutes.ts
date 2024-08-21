import express from "express"
import { addDocument, deleteDocument, getAllDocuments, getDocumentById, updateDocument } from "./documentController"
const router = express.Router()

router.route('./documents').post(addDocument)
router.route('./documents').get(getAllDocuments)
router.route('./documents/:id').get(getDocumentById)
router.route('./documents/:id').put(updateDocument)
router.route('./documents/:id').delete(deleteDocument)

export default router