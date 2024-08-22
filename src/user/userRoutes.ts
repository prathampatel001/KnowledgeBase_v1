import { Router } from "express";
import { updateUser } from "./userController";
import { updateUserByIdValidation } from "./userValidator";

const userRoute = Router()

userRoute.put("/user/update/:id", updateUserByIdValidation, updateUser)

export default userRoute;