import { Router } from "express";
import { updateUser } from "./userController";
import { getUserUpdateByIdValidation } from "./userValidator";

const userRoute = Router()

userRoute.put("/user/update/:id", getUserUpdateByIdValidation, updateUser)

export default userRoute;