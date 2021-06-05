import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import { errorHandler, notFound } from "./middlewares/errorMiddleware";

import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();

app.use(cors());

if (process.env.NODE_ENV === "DEVELOPMENT") app.use(morgan("dev"));

const PORT = process.env.PORT || 6000;

app.use("/api/users", userRoutes);

app.use(notFound); // Handling routes that are not available
app.use(errorHandler); // Returning error message and conditionally the error stack

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
