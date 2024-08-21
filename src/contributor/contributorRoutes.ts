import express from "express"
import { addContributor, deleteContributor, getAllContributors, getContributorById, updateContributor } from "./contributorController"

const router = express.Router()

router.route('./contributor').post(addContributor)
router.route('./contributor').get(getAllContributors)
router.route('./contributor/:id').get(getContributorById)
router.route('./contributor').put(updateContributor)
router.route('./contributor').delete(deleteContributor)

export default router