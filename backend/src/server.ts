// Server configuration

import express from "express";
import cors from "cors";
import { router as authRoutes } from "./routes/auth";
import { router as postRoutes } from "./routes/posts";
import { router as commentRoutes } from "./routes/comments";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

// Error handling
app.use(errorHandler);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
