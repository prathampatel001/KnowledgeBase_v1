import { Router } from "express";
import { createUser, loginUser } from "./authController";

const authRoute = Router();

authRoute.post("/register", createUser);
authRoute.post("/login", loginUser);

export default authRoute;
