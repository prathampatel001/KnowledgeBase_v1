import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import authRoute from "./auth/authRoutes";
import cors from "cors";
import pageRoutes from "./page/pageRoutes";
import contributorRoutes from "./contributor/contributorRoutes";
import userRoute from "./user/userRoutes";
import categoryRoute from "./category/categoryRoutes";
import documentRoutes from "./document/documentRoutes";
import { authenticate } from "./middlewares/authentication";


const app = express();
app.use(express.json());
app.use(cors());

const basePath = "/api";

app.use(basePath, authRoute);
app.use(authenticate)
app.use(basePath,pageRoutes)
app.use(basePath,contributorRoutes)
app.use(basePath,documentRoutes)
app.use(basePath, categoryRoute)
app.use(basePath, userRoute);

app.get(`/test`, (req, res, next) => {
  res.json({ message: "Hello World" });
});
// global error handle
app.use(globalErrorHandler);

export default app;
