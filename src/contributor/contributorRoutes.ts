import express from "express"
import { addContributor, deleteContributor, getAllContributors, getContributorById, updateContributor } from "./contributorController"
import { addContributorValidation } from "./contributorValidation"

const router = express.Router()

router.route('/contributor').post(addContributorValidation,addContributor)
router.route('/contributor').get(getAllContributors)
router.route('/contributor/:id').get(getContributorById)
router.route('/contributor/:id').put(updateContributor)
router.route('/contributor/:id').delete(deleteContributor)

export default router