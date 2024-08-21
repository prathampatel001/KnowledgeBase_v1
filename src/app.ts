import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import cors from "cors";
import pageRoutes from "./page/pageRoutes";
import contributorRoutes from "./contributor/contributorRoutes";
const app = express();
app.use(express.json());
app.use(cors());


const basePath = "/api";
app.use(basePath,pageRoutes)
app.use(basePath,contributorRoutes)

app.get(`/test`, (req, res, next) => {
  res.json({ message: "Hello World" });
});

// global error handle
app.use(globalErrorHandler);

export default app;
