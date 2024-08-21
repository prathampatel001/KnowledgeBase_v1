import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import authRoute from "./auth/authRoutes";
import cors from "cors";
import pageRoutes from "./page/pageRoutes";
import userRoute from "./user/userRoutes";
import categoryRoute from "./category/categoryRoutes";
const app = express();
app.use(express.json());
app.use(cors());

const basePath = "/api";
app.use(basePath, pageRoutes);

app.get(`/test`, (req, res, next) => {
  res.json({ message: "Hello World" });
});

app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/category", categoryRoute)

// global error handle
app.use(globalErrorHandler);

export default app;
