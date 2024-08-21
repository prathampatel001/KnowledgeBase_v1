import { Router } from "express";
import { createUser, loginUser } from "./authController";
import { addUserValidation } from "../user/userValidator";

const authRoute = Router();

authRoute.post("/auth/register", addUserValidation, createUser);
authRoute.post("/auth/login", loginUser);

export default authRoute;
