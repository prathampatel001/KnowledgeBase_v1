import express from "express"
import { addPage, deletePage, getAllPages, getPageById, updatePage } from "./pageController"
import { addPageValidation, deletePageValidation, getPageByIdValidation, updatePageValidation } from "./pageValidator"
const router = express.Router()

router.route("/pages").post(addPageValidation,addPage)
router.route("/pages").get(getAllPages)
router.route("/pages/:id").get(getPageByIdValidation,getPageById)
router.route("/pages/:id").delete(deletePageValidation,deletePage)
router.route("/pages/:id").put(updatePageValidation,updatePage)

export default router

