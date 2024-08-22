import express from "express"
import { addPage, deletePage, getAllPages, getPageById, updatePage } from "./pageController"
const router = express.Router()

router.route("/pages").post(addPage)
router.route("/pages").get(getAllPages)
router.route("/pages/:id").get(getPageById)
router.route("/pages/:id").delete(deletePage)
router.route("/pages/:id").put(updatePage)

export default router

