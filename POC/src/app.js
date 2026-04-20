import helmet from "helmet";
import  morgan from "morgan"
import express from "express";
import errorMiddleware from "./middlewares/error.middleware.js";
import router from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();


const app = express();
app.use(helmet());
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (_, res) => {
  res.send("Hello World!");
});

app.use("/api", router);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});
app.use(errorMiddleware);

export default app;
