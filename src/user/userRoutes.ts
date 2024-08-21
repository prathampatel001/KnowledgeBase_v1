import { Router } from "express";
import { updateUser } from "./userController";
import { authenticate } from "../middlewares/authentication";

const userRoute = Router()

userRoute.put("/user/update/:id", authenticate, updateUser)

export default userRoute;