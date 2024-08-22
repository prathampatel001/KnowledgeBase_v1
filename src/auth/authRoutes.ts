import { Router } from "express";
import { createUser, loginUser } from "./authController";

const authRoute = Router();

authRoute.post("/auth/register", createUser);
authRoute.post("/auth/login", loginUser);

export default authRoute;
