import { Router } from "express";
import { updateUser } from "./userController";
import { authenticate } from "../middlewares/auth";

const userRoute = Router()

userRoute.put("/update_user/:id", authenticate, updateUser)

export default userRoute;